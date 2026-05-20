import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Link2,
  Pencil,
  Check,
  Loader2,
  AlertTriangle,
  Plus,
  Download,
  RotateCcw,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCsrfToken } from "@/lib/csrf";

const STEPS = [
  { id: 1, key: "url",    title: "Link",       icon: Link2,  hint: "Paste the Amazon URL — short or full. We'll pull the rest." },
  { id: 2, key: "review", title: "Review",     icon: Pencil, hint: "Auto-filled from Amazon. Tweak anything that looks off." },
  { id: 3, key: "save",   title: "Save",       icon: Check,  hint: "Confirm and save the pick." },
];

function displayUrl(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (/^amzn\.(to|com|co\.uk|eu)$/i.test(u.hostname)) return url;
    const m = u.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
    if (m) return `${u.hostname.replace(/^www\./, "")}/dp/${m[1].toUpperCase()}`;
    return url;
  } catch {
    return url;
  }
}

function extractAsin(url) {
  if (!url) return "";
  const m = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return m ? m[1].toUpperCase() : "";
}

function amazonImageFromAsin(asin) {
  if (!asin) return "";
  return `https://images-na.ssl-images-amazon.com/images/P/${asin}._SL600_.jpg`;
}

const emptyForm = () => ({
  url: "",
  brand: "",
  title: "",
  subtitle: "",
  image: "",
  asin: "",
  features: "",
  specs: [
    { k: "", v: "" },
    { k: "", v: "" },
    { k: "", v: "" },
    { k: "", v: "" },
  ],
  autofilled: false,
});

export default function CreatePickDialog({ open, onOpenChange, onSave, editingPick }) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState(emptyForm);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const editingId = editingPick?.id || null;

  React.useEffect(() => {
    if (!open) return;
    setLoading(false);
    setError(null);
    if (editingPick) {
      // hydrate from existing pick, skip to review step
      const specs = (editingPick.specs || [])
        .concat(Array.from({ length: 4 }, () => ["", ""]))
        .slice(0, 4)
        .map(([k, v]) => ({ k: k || "", v: v || "" }));
      setForm({
        url: editingPick.url || "",
        brand: editingPick.brand || "",
        title: editingPick.title || "",
        subtitle: editingPick.subtitle === "Recommended pick" ? "" : (editingPick.subtitle || ""),
        image: editingPick.image || "",
        asin: editingPick.asin || "",
        features: (editingPick.features || []).join("\n"),
        specs,
        autofilled: false,
      });
      setStep(2);
    } else {
      setForm(emptyForm());
      setStep(1);
    }
  }, [open, editingPick]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));
  const updateSpec = (i, patch) =>
    setForm((f) => ({
      ...f,
      specs: f.specs.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));

  const asinHint = extractAsin(form.url);

  async function fetchFromAmazon() {
    if (!form.url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/amazon/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": getCsrfToken(),
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ url: form.url.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `http_${res.status}`);
      }
      const data = await res.json();
      const specs = (data.specs || []).concat(
        Array.from({ length: 4 }, () => ["", ""])
      );
      setForm((f) => ({
        ...f,
        // keep the user's original short link — the resolved URL is ugly
        // and the affiliate tag is preserved by the amzn.to redirect anyway
        asin: data.asin || asinHint,
        brand: data.brand || "",
        title: data.title || "",
        subtitle: data.subtitle || "",
        image: data.image || (data.asin ? amazonImageFromAsin(data.asin) : ""),
        features: (data.features || []).join("\n"),
        specs: specs.slice(0, 4).map(([k, v]) => ({ k: k || "", v: v || "" })),
        autofilled: true,
      }));
      setStep(2);
    } catch (e) {
      const code = (e && e.message) || "fetch";
      const msg =
        code === "blocked"
          ? "Amazon blocked the request (CAPTCHA or unusual page)."
          : code === "timeout"
          ? "Amazon took too long to respond."
          : code === "parse"
          ? "Couldn't parse the product page."
          : "Couldn't fetch product details.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function fillManually() {
    setForm((f) => ({
      ...f,
      asin: asinHint,
      image: asinHint ? amazonImageFromAsin(asinHint) : "",
      autofilled: false,
    }));
    setError(null);
    setStep(2);
  }

  const canAdvanceReview =
    form.brand.trim() && form.title.trim() && form.features.trim();

  function handleSave() {
    const features = form.features
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const specs = form.specs
      .map(({ k, v }) => [k.trim(), v.trim()])
      .filter(([k, v]) => k && v);

    onSave({
      id: editingId || crypto.randomUUID(),
      createdAt: editingPick?.createdAt || new Date().toISOString(),
      updatedAt: editingId ? new Date().toISOString() : undefined,
      url: form.url.trim(),
      asin: form.asin || extractAsin(form.url),
      image: form.image,
      brand: form.brand.trim(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || "Recommended pick",
      features,
      specs,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col gap-4 p-0 sm:max-w-2xl">
        <DialogHeader className="px-6 pt-6">
          <Badge variant="outline" className="mb-2 w-fit font-mono text-[10px]">
            {editingId ? "Edit pick" : "New pick"}
          </Badge>
          <DialogTitle className="text-2xl tracking-tight">
            {editingId ? "Edit recommendation" : "Add a recommendation"}
          </DialogTitle>
          <DialogDescription>{STEPS[step - 1].hint}</DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <ol className="flex items-center gap-2 px-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = s.id === step;
            const done = s.id < step;
            return (
              <li key={s.id} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full border text-[11px] transition-colors",
                    done && "border-chart-1/40 bg-chart-1/15 text-chart-1",
                    active && "border-chart-1 bg-chart-1 text-background",
                    !done && !active && "border-border bg-card text-muted-foreground"
                  )}
                >
                  {done ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-px flex-1 transition-colors",
                      done ? "bg-chart-1/40" : "bg-border"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          {/* ─── Step 1: URL + fetch ─── */}
          {step === 1 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="url">Amazon URL</Label>
                <Input
                  id="url"
                  placeholder="https://amzn.to/… or https://www.amazon.co.uk/dp/B0XXXXXXXX"
                  value={form.url}
                  onChange={(e) => update({ url: e.target.value })}
                  autoFocus
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading && form.url.trim()) {
                      e.preventDefault();
                      fetchFromAmazon();
                    }
                  }}
                />
                <p className="font-mono text-[11px] text-muted-foreground">
                  Tip: paste the SiteStripe short link or full /dp/ URL. The rest is pulled from Amazon.
                </p>
              </div>

              {asinHint && !loading && (
                <div className="flex items-center gap-3 rounded-md border bg-card/50 p-3">
                  <img
                    src={amazonImageFromAsin(asinHint)}
                    alt=""
                    className="size-14 rounded-md border bg-background object-contain"
                  />
                  <div>
                    <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      ASIN detected
                    </div>
                    <div className="font-mono text-sm">{asinHint}</div>
                  </div>
                  <Badge variant="outline" className="ml-auto font-mono text-chart-1 border-chart-1/30">
                    <CircleCheck className="size-3" /> ready
                  </Badge>
                </div>
              )}

              {loading && (
                <div className="space-y-3 rounded-md border bg-card/50 p-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin text-chart-1" />
                    Fetching from Amazon…
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-1/2 animate-pulse rounded bg-muted/60" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-muted/60" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-muted/60" />
                  </div>
                </div>
              )}

              {error && !loading && (
                <div className="flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div className="flex-1">
                    <div className="font-medium">{error}</div>
                    <button
                      type="button"
                      onClick={fillManually}
                      className="mt-1 font-mono text-[11px] text-chart-1 underline-offset-4 hover:underline"
                    >
                      Fill in manually instead →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Step 2: Review & edit ─── */}
          {step === 2 && (
            <div className="grid gap-5">
              {form.autofilled && (
                <Badge variant="outline" className="w-fit font-mono text-chart-1 border-chart-1/30">
                  <Download className="size-3" /> Auto-filled from Amazon
                </Badge>
              )}

              <div className="grid gap-4 md:grid-cols-[140px_1fr]">
                <div className="flex items-center justify-center rounded-md border bg-card/50 p-3">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt=""
                      className="max-h-32 w-full object-contain"
                    />
                  ) : (
                    <div className="grid size-24 place-items-center text-[10px] text-muted-foreground">
                      no image
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={form.brand}
                        onChange={(e) => update({ brand: e.target.value })}
                        autoFocus
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="subtitle">Category</Label>
                      <Input
                        id="subtitle"
                        value={form.subtitle}
                        onChange={(e) => update({ subtitle: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => update({ title: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="features">Features · one per line</Label>
                <Textarea
                  id="features"
                  rows={5}
                  value={form.features}
                  onChange={(e) => update({ features: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Specs · up to 4</Label>
                {form.specs.map((s, i) => (
                  <div key={i} className="grid grid-cols-[1fr_2fr] gap-2">
                    <Input
                      placeholder="Key"
                      value={s.k}
                      onChange={(e) => updateSpec(i, { k: e.target.value })}
                    />
                    <Input
                      placeholder="Value"
                      value={s.v}
                      onChange={(e) => updateSpec(i, { v: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex w-fit items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-3" /> Re-fetch from Amazon
              </button>
            </div>
          )}

          {/* ─── Step 3: Save preview ─── */}
          {step === 3 && (
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-lg border bg-card/50">
                <div className="grid sm:grid-cols-[1fr_1.2fr]">
                  <div className="flex items-center justify-center bg-background p-6">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt=""
                        className="max-h-44 w-full object-contain"
                      />
                    ) : (
                      <div className="grid size-32 place-items-center rounded-md border text-xs text-muted-foreground">
                        no image
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {form.brand || "?"} · {form.subtitle || "Recommended pick"}
                    </div>
                    <div className="text-lg font-semibold leading-tight tracking-tight">
                      {form.title || "Untitled pick"}
                    </div>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {form.features
                        .split("\n")
                        .map((l) => l.trim())
                        .filter(Boolean)
                        .slice(0, 5)
                        .map((l, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Plus className="mt-0.5 size-3 shrink-0 text-chart-1" /> {l}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                {form.specs.some((s) => s.k && s.v) && (
                  <div className="grid grid-cols-2 gap-px border-t bg-border sm:grid-cols-4">
                    {form.specs
                      .filter((s) => s.k && s.v)
                      .map((s, i) => (
                        <div key={i} className="bg-card p-3">
                          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {s.k}
                          </div>
                          <div className="mt-1 text-sm font-medium">{s.v}</div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <p className="break-all font-mono text-[11px] text-muted-foreground">
                → {displayUrl(form.url)}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="items-center border-t bg-card px-6 py-4 sm:justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            Step {step} of {STEPS.length} · {STEPS[step - 1].title}
          </span>
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={loading}>
                <ArrowLeft /> Back
              </Button>
            )}
            {step === 1 && (
              <Button
                disabled={!form.url.trim() || loading}
                onClick={fetchFromAmazon}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Fetching…
                  </>
                ) : (
                  <>
                    <Download /> Fetch from Amazon
                  </>
                )}
              </Button>
            )}
            {step === 2 && (
              <Button
                disabled={!canAdvanceReview}
                onClick={() => setStep(3)}
              >
                Continue <ArrowRight />
              </Button>
            )}
            {step === 3 && (
              <Button onClick={handleSave}>
                <Check /> {editingId ? "Update pick" : "Save pick"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
