import * as React from "react";
import { ArrowUpRight, CircleCheck, Plus, Trash2, Pencil, Lock, LogOut } from "lucide-react";
import { isAdmin, getCsrfToken } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DialogTrigger } from "@/components/ui/dialog";
import CreatePickDialog from "@/components/CreatePickDialog";

const STORAGE_KEY = "matthew.sys.picks";

// Default seeded pick from the user's first Amazon link.
const seedPick = {
  id: "seed-1",
  seeded: true,
  url: "https://amzn.to/4dveVNu",
  asin: "B0DTHV8THW",
  brand: "ASUS",
  title: "ROG Astral GeForce RTX 5090 32GB GDDR7 OC",
  subtitle: "Flagship gaming graphics card",
  image: "https://images-na.ssl-images-amazon.com/images/P/B0DTHV8THW._SL600_.jpg",
  features: [
    "32 GB GDDR7 memory, PCIe 5.0",
    "Quad-fan ROG Astral cooler — lower temps, less noise",
    "Dual HDMI 2.1 + triple DisplayPort 2.1",
    "NVIDIA DLSS 4 + ray tracing, 8K ready",
    "Addressable RGB (Aura Sync)",
  ],
  specs: [
    ["Memory", "32 GB GDDR7"],
    ["Bus", "PCIe 5.0"],
    ["Slot", "3.8-slot"],
    ["Outputs", "2× HDMI · 3× DP"],
  ],
};

// Format a URL for display only. Keep amzn.to short links as-is.
// For full Amazon product URLs, strip everything down to amazon.<tld>/dp/<ASIN>.
// The original URL is still used as the click target (preserves affiliate tag).
function displayUrl(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (/^amzn\.(to|com|co\.uk|eu)$/i.test(u.hostname)) return url;
    const m = u.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
    if (m) {
      const host = u.hostname.replace(/^www\./, "");
      return `${host}/dp/${m[1].toUpperCase()}`;
    }
    return url;
  } catch {
    return url;
  }
}

function NavLink({ href, children }) {
  return (
    <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
      <a href={href}>{children}</a>
    </Button>
  );
}

function PickCard({ pick, index, onRemove, onEdit }) {
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-[1.1fr_1fr]">
        {/* image */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-background via-card to-chart-1/[0.06] p-6 sm:p-10 md:p-14">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(30rem 20rem at 50% 50%, color-mix(in oklch, var(--color-chart-1) 18%, transparent), transparent 70%)",
            }}
          />
          {pick.image ? (
            <img
              src={pick.image}
              alt={`${pick.brand} ${pick.title}`}
              className="relative z-10 max-h-[380px] w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
              loading="lazy"
            />
          ) : (
            <div className="relative z-10 grid h-48 w-full place-items-center rounded-md border text-xs text-muted-foreground">
              no image · paste a full /dp/ URL for auto-image
            </div>
          )}
          <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5 sm:left-6 sm:top-6 sm:gap-2">
            <Badge variant="outline" className="font-mono">
              Pick · {String(index + 1).padStart(2, "0")}
            </Badge>
            <Badge variant="outline" className="font-mono text-chart-1 border-chart-1/30">
              <span className="size-1 rounded-full bg-chart-1" /> Signed off
            </Badge>
          </div>
          {pick.asin && (
            <span className="absolute bottom-3 right-3 z-10 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:bottom-6 sm:right-6">
              ASIN · {pick.asin}
            </span>
          )}
        </div>

        {/* details */}
        <div className="flex flex-col gap-5 p-6 sm:gap-6 sm:p-8 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {pick.brand} · {pick.subtitle}
              </div>
              <CardTitle className="mt-3 text-xl font-semibold leading-tight tracking-tight sm:text-2xl md:text-3xl">
                {pick.title}
              </CardTitle>
            </div>
            {!pick.seeded && (
              <div className="flex items-center gap-1">
                {onEdit && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(pick)}
                    aria-label="Edit pick"
                  >
                    <Pencil className="size-4" />
                  </Button>
                )}
                {onRemove && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(pick.id)}
                    aria-label="Remove pick"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {pick.features?.length > 0 && (
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {pick.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Plus className="mt-0.5 size-3.5 shrink-0 text-chart-1" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {pick.specs?.length > 0 && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border">
                {pick.specs.map(([k, v], i) => (
                  <div key={i} className="bg-card p-3">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {k}
                    </div>
                    <div className="mt-1 text-sm font-medium">{v}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button asChild size="lg" className="flex-1 justify-between">
              <a href={pick.url} target="_blank" rel="nofollow sponsored noopener">
                View on Amazon
                <ArrowUpRight />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1">
              <a href="/#order">Want a full build sheet? £45</a>
            </Button>
          </div>
          <p className="break-all font-mono text-[11px] text-muted-foreground">
            {displayUrl(pick.url)}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function Parts() {
  const [picks, setPicks] = React.useState([seedPick]);
  const [open, setOpen] = React.useState(false);
  const [editingPick, setEditingPick] = React.useState(null);
  const admin = isAdmin();

  // hydrate from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) {
          setPicks([seedPick, ...saved]);
        }
      }
    } catch {}
  }, []);

  const persist = (next) => {
    const userPicks = next.filter((p) => !p.seeded);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userPicks));
    } catch {}
  };

  const handleSave = (incoming) => {
    setPicks((prev) => {
      const exists = prev.some((p) => p.id === incoming.id);
      const next = exists
        ? prev.map((p) => (p.id === incoming.id ? { ...p, ...incoming } : p))
        : [...prev, incoming];
      persist(next);
      return next;
    });
    setEditingPick(null);
  };

  const handleEdit = (pick) => {
    setEditingPick(pick);
    setOpen(true);
  };

  const handleOpenChange = (next) => {
    setOpen(next);
    if (!next) setEditingPick(null);
  };

  const handleRemove = (id) => {
    setPicks((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persist(next);
      return next;
    });
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(50rem 35rem at 20% -10%, color-mix(in oklch, var(--color-chart-1) 12%, transparent), transparent 60%), radial-gradient(40rem 30rem at 90% 30%, color-mix(in oklch, var(--color-chart-2) 10%, transparent), transparent 60%)",
        }}
      />

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6">
          <a href="/" className="flex items-center gap-2.5 font-mono text-sm tracking-tight">
            <span className="relative grid size-6 place-items-center rounded-md border bg-card">
              <span className="size-1.5 rounded-full bg-chart-1 shadow-[0_0_10px_var(--color-chart-1)]" />
            </span>
            <span className="font-semibold">matthew.sys</span>
            <Badge variant="outline" className="ml-1 hidden font-mono text-[10px] tracking-wider sm:inline-flex">
              parts
            </Badge>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/#services">Services</NavLink>
            <NavLink href="/#process">Process</NavLink>
            <NavLink href="/parts">Parts</NavLink>
            <NavLink href="/#faq">FAQ</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            {admin ? (
              <form method="POST" action="/logout" className="inline">
                <input type="hidden" name="_token" value={getCsrfToken()} />
                <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <LogOut /> Sign out
                </Button>
              </form>
            ) : (
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <a href="/login">
                  <Lock /> Admin
                </a>
              </Button>
            )}
            <Button asChild size="sm">
              <a href="/#order">
                Book a slot <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO INTRO */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-8 sm:pt-20 sm:pb-10 md:pt-24">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="outline" className="mb-6 font-mono">
                <CircleCheck className="size-3 text-chart-1" /> Affiliate · honest picks
              </Badge>
              <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-[0.95] tracking-tight sm:text-4xl md:text-6xl">
                Parts I'd
                <br />
                <span className="text-muted-foreground">actually buy.</span>
              </h1>
              <p className="mt-6 max-w-prose text-muted-foreground md:text-lg">
                Hand-picked recommendations for the next rig I'd build. Amazon links below — I earn a small commission, you pay the same price.
              </p>
            </div>
            {admin && (
              <Button
                size="lg"
                onClick={() => { setEditingPick(null); setOpen(true); }}
              >
                <Plus /> Create pick
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* PICKS */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 px-4 sm:px-6 py-10 sm:py-16 md:py-20">
          {picks.map((p, i) => (
            <PickCard
              key={p.id}
              pick={p}
              index={i}
              onRemove={admin ? handleRemove : undefined}
              onEdit={admin ? handleEdit : undefined}
            />
          ))}

          {admin && (
            <button
              type="button"
              onClick={() => { setEditingPick(null); setOpen(true); }}
              className="group grid w-full place-items-center gap-3 rounded-xl border border-dashed bg-card/30 px-6 py-16 text-center text-muted-foreground transition-colors hover:border-chart-1/40 hover:bg-card/60 hover:text-foreground"
            >
              <span className="grid size-12 place-items-center rounded-full border bg-card transition-colors group-hover:border-chart-1/40 group-hover:text-chart-1">
                <Plus className="size-5" />
              </span>
              <span className="text-sm">Add another recommendation</span>
              <span className="font-mono text-[10px] uppercase tracking-wider">
                Paste Amazon link → save
              </span>
            </button>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="flex flex-col items-start justify-between gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:flex-row md:items-center">
            <span>
              Disclosure: as an Amazon Associate I earn from qualifying purchases. Picks are stored in your browser.
            </span>
            <a href="/" className="hover:text-foreground">← back to matthew.sys</a>
          </div>
        </div>
      </footer>

      <CreatePickDialog
        open={open}
        onOpenChange={handleOpenChange}
        onSave={handleSave}
        editingPick={editingPick}
      />
    </div>
  );
}
