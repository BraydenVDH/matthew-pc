<?php

namespace App\Http\Controllers;

use DOMDocument;
use DOMXPath;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class AmazonPreviewController extends Controller
{
    private const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15';

    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate([
            'url' => 'required|string|max:2048',
        ]);

        try {
            $response = Http::withHeaders([
                'User-Agent' => self::UA,
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language' => 'en-GB,en;q=0.9',
                'Cache-Control' => 'no-cache',
            ])
                ->withOptions(['allow_redirects' => ['max' => 10, 'track_redirects' => true]])
                ->timeout(10)
                ->get($data['url']);
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            return response()->json(['error' => 'timeout'], 504);
        } catch (Throwable $e) {
            return response()->json(['error' => 'fetch'], 502);
        }

        if (! $response->successful()) {
            return response()->json(['error' => 'blocked'], 502);
        }

        $finalUrl = $this->finalUrl($data['url'], $response);
        $asin = $this->extractAsin($finalUrl);

        // Cache by ASIN when we have one
        if ($asin) {
            try {
                $cached = cache()->store('file')->get("amazon-preview:{$asin}");
                if ($cached) {
                    return response()->json($cached);
                }
            } catch (Throwable $e) {
                // ignore cache errors
            }
        }

        try {
            $parsed = $this->parse($response->body(), $finalUrl, $asin);
        } catch (Throwable $e) {
            return response()->json(['error' => 'parse'], 500);
        }

        if (! $parsed) {
            return response()->json(['error' => 'blocked'], 502);
        }

        if ($asin) {
            try {
                cache()->store('file')->put("amazon-preview:{$asin}", $parsed, now()->addHours(24));
            } catch (Throwable $e) {
                // ignore
            }
        }

        return response()->json($parsed);
    }

    private function finalUrl(string $original, $response): string
    {
        $redirects = $response->handlerStats()['redirect_url'] ?? null;
        if (is_string($redirects) && $redirects !== '') {
            return $redirects;
        }
        $history = $response->getHeader('X-Guzzle-Redirect-History');
        if (! empty($history)) {
            return end($history);
        }
        return $original;
    }

    private function extractAsin(string $url): ?string
    {
        if (preg_match('#/(?:dp|gp/product)/([A-Z0-9]{10})#i', $url, $m)) {
            return strtoupper($m[1]);
        }
        return null;
    }

    private function parse(string $html, string $finalUrl, ?string $asin): ?array
    {
        $previousErrors = libxml_use_internal_errors(true);
        $doc = new DOMDocument();
        $doc->loadHTML('<?xml encoding="UTF-8">' . $html);
        libxml_clear_errors();
        libxml_use_internal_errors($previousErrors);

        $xp = new DOMXPath($doc);

        // Robot check / blocked page
        $pageTitle = $this->firstText($xp, '//title');
        if ($pageTitle && stripos($pageTitle, 'Robot Check') !== false) {
            return null;
        }

        $title = $this->firstText($xp, '//*[@id="productTitle"]');
        if (! $title) {
            // Not a product page — bail
            return null;
        }

        $brand = $this->firstText($xp, '//tr[contains(@class,"po-brand")]//td[contains(@class,"po-break-word")]//span');
        if (! $brand) {
            $byline = $this->firstText($xp, '//*[@id="bylineInfo"]');
            if ($byline) {
                $brand = trim(preg_replace('/^(Visit the|Brand:)\s+/i', '', $byline));
                $brand = trim(preg_replace('/\s+Store$/i', '', $brand));
            }
        }

        // Image
        $image = $this->firstAttr($xp, '//*[@id="landingImage"]', 'data-old-hires')
            ?: $this->firstAttr($xp, '//*[@id="landingImage"]', 'src')
            ?: $this->firstAttr($xp, '//meta[@property="og:image"]', 'content');

        if (! $image && $asin) {
            $image = "https://images-na.ssl-images-amazon.com/images/P/{$asin}._SL600_.jpg";
        }

        // Subtitle: prefer last breadcrumb
        $subtitle = null;
        $crumbs = $xp->query('//*[@id="wayfinding-breadcrumbs_feature_div"]//a');
        if ($crumbs && $crumbs->length > 0) {
            $subtitle = trim($crumbs->item($crumbs->length - 1)->textContent);
        }

        // Features
        $features = [];
        $bullets = $xp->query('//*[@id="feature-bullets"]//li[not(contains(@class,"aok-hidden"))]//span[contains(@class,"a-list-item")]');
        if ($bullets) {
            foreach ($bullets as $node) {
                $text = trim(preg_replace('/\s+/', ' ', $node->textContent));
                if ($text !== '' && mb_strlen($text) < 500) {
                    $features[] = $text;
                }
                if (count($features) >= 6) {
                    break;
                }
            }
        }

        // Specs from product overview
        $specs = [];
        $rows = $xp->query('//*[@id="productOverview_feature_div"]//table//tr');
        if ($rows) {
            foreach ($rows as $row) {
                $cells = $xp->query('.//td', $row);
                if ($cells && $cells->length >= 2) {
                    $k = trim(preg_replace('/\s+/', ' ', $cells->item(0)->textContent));
                    $v = trim(preg_replace('/\s+/', ' ', $cells->item(1)->textContent));
                    if ($k && $v) {
                        $specs[] = [$k, $v];
                    }
                }
                if (count($specs) >= 4) {
                    break;
                }
            }
        }

        return [
            'url' => $finalUrl,
            'asin' => $asin,
            'brand' => $brand ?: '',
            'title' => $title,
            'subtitle' => $subtitle ?: '',
            'image' => $image ?: '',
            'features' => $features,
            'specs' => $specs,
        ];
    }

    private function firstText(DOMXPath $xp, string $query): ?string
    {
        $nodes = $xp->query($query);
        if ($nodes && $nodes->length > 0) {
            $text = trim(preg_replace('/\s+/', ' ', $nodes->item(0)->textContent));
            return $text !== '' ? $text : null;
        }
        return null;
    }

    private function firstAttr(DOMXPath $xp, string $query, string $attr): ?string
    {
        $nodes = $xp->query($query);
        if ($nodes && $nodes->length > 0) {
            $val = $nodes->item(0)->getAttribute($attr);
            return $val !== '' ? $val : null;
        }
        return null;
    }
}
