# matthew.sys

Hand-tuned PC optimisation + custom build service — single-page Laravel + React site with a small admin area for managing Amazon affiliate "parts I'd actually buy" recommendations.

## Stack

- **Laravel 13** (PHP 8.3+) — routes, blade shells, single scrape endpoint
- **React 19** mounted via Vite + Laravel Vite plugin
- **Tailwind CSS v4** + **shadcn/ui** primitives (Radix-backed)
- **Geist / Geist Mono** typography (via Bunny Fonts)

## Pages

| Route | What |
|---|---|
| `/` | Marketing landing page — hero, services, process, FAQ, order form |
| `/parts` | "Parts I'd actually buy" — picks rendered from localStorage; admins can add/edit/delete |
| `/login` | Single-account admin sign-in (password only) |

## Local setup

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run dev               # Vite
php artisan serve         # Laravel
```

Then open <http://127.0.0.1:8000>.

## Admin

Picks editing on `/parts` is gated behind a single-account login. To activate:

1. Open `database/seeders/AdminSeeder.php`, set your password on the line marked `👉 EDIT THIS LINE`.
2. Run:
   ```bash
   php artisan migrate
   php artisan db:seed --class=AdminSeeder
   ```
3. Visit `/login` and sign in. The Create / Edit / Delete UI on `/parts` lights up.

Re-running the seeder rotates the password (idempotent on `id=1`).

## Amazon scrape endpoint

`POST /api/amazon/preview` (admin-only) takes `{ url }`, follows `amzn.to/...` redirects, and returns `{ brand, title, subtitle, image, features[], specs[[k,v]], asin, url }` parsed from Amazon UK's HTML via `DOMDocument` + `DOMXPath`. Results are file-cached 24h per ASIN.

The result powers the 3-step "Create pick" dialog: paste link → review (editable, pre-filled) → save.

> ⚠ Amazon's Operating Agreement technically requires the Product Advertising API for programmatic product data. Scraping is fine for personal/portfolio use; switch to PA-API if this ever goes commercial.

## Storage

Picks are saved to the visitor's `localStorage` under the key `matthew.sys.picks`. The site has no DB persistence for picks — only the admin password lives in the database.

## License

Personal project — no license granted.
