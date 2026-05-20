import * as React from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Cpu,
  Wrench,
  Activity,
  Gauge,
  ShieldCheck,
  FileText,
  Terminal,
  CircleCheck,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const stats = [
  { n: "50–60%", l: "Typical performance gain after a full optimisation pass." },
  { n: "100+", l: "PCs personally tuned, configured and signed off." },
  { n: "£70", l: "Custom part list + full optimisation, all-in." },
  { n: "0", l: "Sketchy auto-tuners used. Every tweak is manual and reversible." },
];

const benchRows = [
  { lbl: "1% Low", old: "30", v: "65", delta: "+116%" },
  { lbl: "Avg FPS", old: "94", v: "168", delta: "+78%" },
  { lbl: "Frametime σ", old: "8.4", v: "2.1", delta: "−75%" },
];

const reasons = [
  {
    icon: Terminal,
    title: "Programs can't touch BIOS",
    body: "Auto-tools refuse to write firmware-level changes — the risk is on them. XMP, EXPO, fan curves, PBO, memory timings: that's where the gains live.",
  },
  {
    icon: ShieldCheck,
    title: "No legal-safe overclock",
    body: "If a script fries your GPU, the vendor has to replace it. So they don't script it. I undervolt + overclock by hand on a curve your silicon can actually hold.",
  },
  {
    icon: FileText,
    title: "Every tweak documented",
    body: "You get a plain-text log of every change — registry, service, BIOS field, driver version. Want to revert? One file, one reboot.",
  },
  {
    icon: Activity,
    title: "Before / after benchmarks",
    body: "CapFrameX + 3DMark + your own game. You see the delta in numbers, not vibes.",
  },
];

const steps = [
  { n: "01", tag: "~ 10 min", title: "Intake", body: "You drop your specs, peripherals, budget and the games you actually play. I confirm what is and isn't worth touching." },
  { n: "02", tag: "~ 30 min", title: "Baseline", body: "Remote session, before-benchmarks captured, hardware identified down to memory die. Nothing is changed yet." },
  { n: "03", tag: "2–4 hrs", title: "The pass", body: "Windows debloat → BIOS pass → memory tuning → GPU curve → driver pinning → network & latency. Every step logged." },
  { n: "04", tag: "~ 20 min", title: "Sign-off", body: "After-benchmarks, side-by-side report, a written changelog in your hands, and a 30-day window for free re-tuning." },
];

const testimonials = [
  {
    quote: "Went from stuttering in Rust raids to a flat 165 hz line. Genuinely had no idea my own PC could feel this responsive.",
    who: "Jamie K.",
    meta: "Rust · 4 mo player",
    price: "£25",
  },
  {
    quote: "Asked for a £900 build, got a sheet that came in £40 under and outperforms the prebuilt I almost bought at £1.2k.",
    who: "Anon",
    meta: "Discord",
    price: "£45",
  },
  {
    quote: "He actually shows you the numbers. No magic, no marketing, just a log of every tweak. Will be back for the next build.",
    who: "L.",
    meta: "Valorant",
    price: "£70",
  },
];

const faqs = [
  { q: "Will an overclock fry my parts?", a: "Not the way I do it. I undervolt where I can, set a curve your silicon proves it can hold under 30 minutes of stress testing, and back off two notches before signing it off. Every value is documented and reversible." },
  { q: "How is this different from a £10 'auto-tuner'?", a: "Auto-tuners can't touch BIOS, can't set memory timings by hand, and won't overclock for legal reasons. I do all three — by hand, on your specific silicon, with before/after benchmarks. That's the gap between +10% and +60%." },
  { q: "Is it remote, in-person, or both?", a: "99% remote — AnyDesk or Parsec, your call. In-person possible in the South-East UK with notice. Either way you watch every change." },
  { q: "What if I want to undo everything?", a: "You get a plain-text changelog with every setting touched. Restore points are made before BIOS and Windows passes. Worst case: one revert script, one reboot, untouched system." },
  { q: "Do you build the PC for me physically?", a: "For the £45 build service I produce the part list and supervise the assembly over voice. Physical build-out is a separate quote depending on location." },
  { q: "Why so cheap?", a: "Because I'm doing it on and off around other things, and word-of-mouth from Discord players is worth more to me than rinsing each client. Prices go up once the queue does." },
];

function SectionEyebrow({ num, label }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
      <span className="text-chart-1">{num}</span>
      <span className="h-px w-8 bg-border" />
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      {/* ambient mesh */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(60rem 40rem at 80% -10%, color-mix(in oklch, var(--color-chart-1) 14%, transparent), transparent 60%), radial-gradient(40rem 30rem at 10% 10%, color-mix(in oklch, var(--color-chart-3) 10%, transparent), transparent 60%)",
        }}
      />

      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-6">
          <a href="/" className="flex items-center gap-2.5 font-mono text-sm tracking-tight">
            <span className="relative grid size-6 place-items-center rounded-md border bg-card">
              <span className="size-1.5 rounded-full bg-chart-1 shadow-[0_0_10px_var(--color-chart-1)]" />
            </span>
            <span className="font-semibold">matthew.sys</span>
            <Badge variant="outline" className="ml-1 font-mono text-[10px] tracking-wider">
              v0.4.1
            </Badge>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {[
              ["Services", "#services"],
              ["Process", "#process"],
              ["Parts", "/parts"],
              ["FAQ", "#faq"],
            ].map(([t, h]) => (
              <Button key={h} asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <a href={h}>{t}</a>
              </Button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 font-mono text-xs text-muted-foreground sm:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-chart-1" />
              Accepting orders
            </span>
            <Button asChild size="sm">
              <a href="#order">
                Book a slot <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative border-b">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-end">
              <Badge variant="outline" className="mb-6 gap-2 font-mono">
                <span className="size-1 rounded-full bg-chart-1" />
                BIOS-level optimisation · custom builds · overclocking
              </Badge>
              <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
                Double your frames.
                <br />
                <span className="text-muted-foreground">Half the excuses.</span>
              </h1>
              <p className="mt-6 max-w-prose text-base text-muted-foreground md:text-lg">
                Hand-tuned BIOS, Windows and hardware optimisation for gamers who actually care about 1% lows. No miracle .exe. No nervous program that will fry your board. Just a human who has done this on a hundred rigs.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <a href="#order">
                    Book a session <ArrowUpRight />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#services">View services</a>
                </Button>
                <Separator orientation="vertical" className="mx-2 hidden h-8 sm:block" />
                <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <CircleCheck className="size-3.5 text-chart-1" />
                  100+ rigs signed off
                </div>
              </div>
            </div>

            {/* bench card */}
            <div className="min-w-0 md:pl-8">
              <Card className="overflow-hidden border-border/80">
                <CardHeader className="border-b pb-4">
                  <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider">
                    <span className="text-muted-foreground">Last run · Rust 1440p</span>
                    <Badge className="bg-chart-1/15 text-chart-1 ring-1 ring-chart-1/30 border-0">
                      <CircleCheck className="size-3" /> Signed off
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  {benchRows.map((r) => (
                    <div
                      key={r.lbl}
                      className="grid grid-cols-[1fr_auto_auto] items-baseline gap-4 border-b border-dashed py-4 last:border-b-0"
                    >
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {r.lbl}
                      </span>
                      <div className="flex items-baseline gap-3 font-mono">
                        <span className="text-base text-muted-foreground line-through decoration-destructive">
                          {r.old}
                        </span>
                        <span className="text-3xl font-semibold tracking-tight text-foreground">
                          {r.v}
                        </span>
                      </div>
                      <Badge variant="outline" className="font-mono text-chart-1 border-chart-1/30">
                        {r.delta}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>SYS · 7700X · 4070 · DDR5-6000</span>
                  <span>Build #114</span>
                </CardFooter>
              </Card>

              {/* mini ticker strip */}
              <div className="mt-4 overflow-hidden rounded-md border bg-card/50">
                <div className="flex animate-[slide_38s_linear_infinite] gap-10 whitespace-nowrap py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <React.Fragment key={i}>
                      <span><span className="text-chart-1">+62%</span> Avg FPS</span>
                      <span>·</span>
                      <span><span className="text-chart-1">−71%</span> Bg svcs</span>
                      <span>·</span>
                      <span><span className="text-chart-1">£45</span> Part list</span>
                      <span>·</span>
                      <span><span className="text-chart-1">£25</span> Optimisation</span>
                      <span>·</span>
                      <span>BIOS · XMP / EXPO</span>
                      <span>·</span>
                      <span>OC · safe curve / PBO2</span>
                      <span>·</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`relative px-6 py-10 ${i < stats.length - 1 ? "lg:border-r" : ""} ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""}`}
            >
              <span className="absolute right-4 top-4 font-mono text-[10px] tracking-wider text-muted-foreground">
                0{i + 1}
              </span>
              <div className="text-4xl font-semibold tracking-tight md:text-5xl">{s.n}</div>
              <div className="mt-3 max-w-[28ch] text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="services" className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
            <SectionEyebrow num="01" label="Services" />
            <div>
              <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Two things, done properly.
              </h2>
              <p className="mt-5 max-w-prose text-muted-foreground">
                No bloated packages. No "tier 3 ultimate gold". You either need a rig spec-ced and budgeted for you, or you need the one you already own tuned to its limit. Pick one. Pick both.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* Build */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono">
                    <Cpu className="size-3" /> SVC-01 · Build
                  </Badge>
                  <Badge variant="outline" className="font-mono text-chart-1 border-chart-1/30">
                    <span className="size-1 rounded-full bg-chart-1" /> Available
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-3xl tracking-tight md:text-4xl">
                  Custom part list
                </CardTitle>
                <CardDescription className="mt-2 max-w-prose text-[15px]">
                  Tell me a budget and what you play. I price-check every component across UK retailers, pair the parts for zero bottlenecks, and hand you a build sheet you can buy from in five minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-muted-foreground">£</span>
                  <span className="text-5xl font-semibold tracking-tight">45</span>
                  <span className="ml-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    flat fee
                  </span>
                </div>
                <Separator className="my-5" />
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "Budget research & bottleneck modelling",
                    "Live UK price tracking",
                    "Compatibility & thermals check",
                    "Assembly guidance — chat or call",
                    "One free revision after delivery",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <Plus className="mt-0.5 size-3.5 text-chart-1" /> {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <a href="#order">
                    Order a build sheet <ArrowRight />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            {/* Opti */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono">
                    <Gauge className="size-3" /> SVC-02 · Opti
                  </Badge>
                  <Badge variant="outline" className="font-mono text-chart-1 border-chart-1/30">
                    <span className="size-1 rounded-full bg-chart-1" /> Available
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-3xl tracking-tight md:text-4xl">
                  Full optimisation
                </CardTitle>
                <CardDescription className="mt-2 max-w-prose text-[15px]">
                  Windows, BIOS, drivers, memory timings, GPU curve, network stack — done by hand over remote session. Reversible. Documented. You watch the FPS counter climb.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-muted-foreground">£</span>
                  <span className="text-5xl font-semibold tracking-tight">25</span>
                  <span className="ml-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    per rig
                  </span>
                </div>
                <Separator className="my-5" />
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "Windows debloat & service surgery",
                    "BIOS tuning · XMP / EXPO / PBO",
                    "Undervolt + safe overclock curve",
                    "Latency & network stack tuning",
                    "Before / after benchmark report",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <Plus className="mt-0.5 size-3.5 text-chart-1" /> {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <a href="#order">
                    Book optimisation <ArrowRight />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            {/* Bundle */}
            <Card className="md:col-span-2 overflow-hidden bg-gradient-to-br from-card via-card to-chart-1/[0.06]">
              <div className="grid md:grid-cols-2">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-chart-1 text-background hover:bg-chart-1">
                      <Wrench className="size-3" /> Bundle 01 + 02
                    </Badge>
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Best value
                    </span>
                  </div>
                  <h3 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                    Full stack
                    <br />
                    <span className="text-muted-foreground">build &amp; tune</span>
                  </h3>
                  <p className="mt-4 max-w-prose text-muted-foreground">
                    Part list, build supervision, full optimisation, and a 30-day check-in. The same rig you would have built — but faster, quieter and cooler.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border">
                    {[
                      ["Price", "£70"],
                      ["Turnaround", "3–5 d"],
                      ["Remote", "UK · EU"],
                      ["Guarantee", "100%"],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-card p-4">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {k}
                        </div>
                        <div className="mt-1 text-xl font-semibold tracking-tight">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t bg-card/50 p-6 md:border-l md:border-t-0 md:p-8">
                  <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    <span>Schedule</span>
                    <span>Next slot · Tue 14:00</span>
                  </div>
                  <div className="mt-6 divide-y">
                    {[
                      ["Mon 27", "Full", "muted"],
                      ["Tue 28", "2 slots", "chart"],
                      ["Wed 29", "4 slots", "chart"],
                      ["Thu 30", "3 slots", "chart"],
                      ["Fri 31", "1 slot", "amber"],
                    ].map(([d, s, tone]) => (
                      <div key={d} className="flex items-center justify-between py-3 font-mono text-sm">
                        <span>{d}</span>
                        <span
                          className={
                            tone === "chart"
                              ? "text-chart-1"
                              : tone === "amber"
                              ? "text-chart-2"
                              : "text-muted-foreground"
                          }
                        >
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="mt-6 w-full" size="lg">
                    <a href="#order">
                      Reserve a slot <ArrowRight />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ WHY HUMAN ============ */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
            <SectionEyebrow num="02" label="The argument" />
            <div>
              <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Why a human still beats <span className="text-muted-foreground">the .exe.</span>
              </h2>
              <p className="mt-5 max-w-prose text-muted-foreground">
                Every auto-tuner on the market has to play it safe. They can't touch your BIOS, won't risk an overclock, and can't replace a board they brick. That ceiling is exactly where I start.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-[1.1fr_1fr]">
            <Card className="bg-card/60">
              <CardContent className="flex h-full flex-col justify-between gap-8 p-8 md:p-10">
                <p className="text-balance text-2xl font-medium leading-snug tracking-tight md:text-3xl">
                  <span className="text-chart-1">"</span>When you properly do a BIOS, Windows and hardware pass, you can see up to a doubling in performance — your 1% lows go from 30 to 65. For an FPS game, that's the whole match.<span className="text-chart-1">"</span>
                </p>
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <span>Matthew · Operator log</span>
                  <span>#114</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {reasons.map((r) => {
                const Icon = r.icon;
                return (
                  <Card key={r.title}>
                    <CardContent className="flex gap-4 p-5">
                      <div className="grid size-10 shrink-0 place-items-center rounded-md border bg-card text-chart-1">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{r.title}</h4>
                        <p className="mt-1.5 text-sm text-muted-foreground">{r.body}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section id="process" className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
            <SectionEyebrow num="03" label="How it runs" />
            <div>
              <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Four steps, one <span className="text-muted-foreground">tighter</span> rig.
              </h2>
              <p className="mt-5 max-w-prose text-muted-foreground">
                From Discord DM to signed-off benchmark report — every job is the same disciplined pass. No surprise upcharges, no "oh by the way you need a new PSU."
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-4">
            {steps.map((s) => (
              <Card key={s.n}>
                <CardContent className="flex h-full flex-col justify-between gap-8 p-6">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-3xl font-semibold tracking-tight text-chart-1">
                      {s.n}
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {s.tag}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold">{s.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-card/60">
                <CardContent className="flex h-full flex-col justify-between gap-8 p-6 md:p-8">
                  <p className="text-balance text-lg leading-snug tracking-tight">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider">
                    <span>
                      <span className="text-foreground">{t.who}</span>
                      <span className="text-muted-foreground"> · {t.meta}</span>
                    </span>
                    <span className="text-chart-1">{t.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ORDER ============ */}
      <section id="order" className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
            <SectionEyebrow num="04" label="Book a slot" />
            <div>
              <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Drop the details.
                <br />
                I'll <span className="text-muted-foreground">quote</span> back same day.
              </h2>
              <p className="mt-5 max-w-prose text-muted-foreground">
                No card up front. Quote, scope, schedule — all confirmed in chat before a single setting changes.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-[1fr_1.4fr]" id="pricing">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl tracking-tight">
                  Tell me what you're running.
                </CardTitle>
                <CardDescription>
                  The more I know up front, the less time we waste on the call. Hardware, OS, peripherals — whatever you've got.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="divide-y">
                  {[
                    ["Response", "< 12h"],
                    ["Channels", "Discord · Email"],
                    ["Payment", "PayPal · Revolut · BTC"],
                    ["Timezone", "UK · GMT / BST"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-3 text-sm">
                      <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {k}
                      </dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 md:p-8">
                <form
                  className="grid gap-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const btn = e.currentTarget.querySelector("[data-submit]");
                    if (btn) btn.innerText = "Sent ✓  I'll reply in Discord";
                  }}
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name / Handle</Label>
                      <Input id="name" placeholder="e.g. Jamie K. / jam.exe" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="discord">Discord</Label>
                      <Input id="discord" placeholder="user#0000" required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@domain.gg" required />
                  </div>

                  <div className="grid gap-3">
                    <Label>Service</Label>
                    <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
                      {[
                        ["build", "Custom build · £45", true],
                        ["opti", "Full optimisation · £25", true],
                        ["oc", "Overclock only · £15", false],
                        ["retune", "Re-tune · existing client", false],
                      ].map(([id, label, def]) => (
                        <label
                          key={id}
                          htmlFor={id}
                          className="flex cursor-pointer items-center gap-3 rounded-md p-2 text-sm transition-colors hover:bg-accent"
                        >
                          <Checkbox id={id} defaultChecked={def} />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="budget">Budget (£)</Label>
                      <Input id="budget" placeholder="900" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="game">Primary game</Label>
                      <Input id="game" placeholder="Rust · CS2 · Tarkov…" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="rig">What you're running (or want)</Label>
                    <Textarea id="rig" rows={4} placeholder="CPU / GPU / RAM / monitor — or just a vibe" />
                  </div>

                  <Button type="submit" size="lg" className="mt-2 w-full justify-between">
                    <span data-submit>Send it</span>
                    <ArrowUpRight />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
            <div>
              <SectionEyebrow num="05" label="Honest questions only" />
              <h3 className="mt-6 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                The ones I actually get asked in Discord.
              </h3>
              <p className="mt-4 max-w-[30ch] text-muted-foreground">
                Not the ones a marketing page invents.
              </p>
            </div>
            <Card>
              <Accordion type="single" collapsible defaultValue="q-0" className="px-2 md:px-4">
                {faqs.map((f, i) => (
                  <AccordionItem value={`q-${i}`} key={i} className="px-4">
                    <AccordionTrigger className="text-left text-base font-medium md:text-lg">
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-chart-1">
                          Q.0{i + 1}
                        </span>
                        <span>{f.q}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-10 pr-4 text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ CTA + FOOTER ============ */}
      <footer className="relative">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-balance text-6xl font-semibold leading-[0.95] tracking-tight md:text-8xl">
            Run it <span className="text-muted-foreground">faster.</span>
          </h2>
          <div className="mt-12 grid gap-10 border-t pt-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="size-1.5 rounded-full bg-chart-1" />
                matthew.sys
              </div>
              <p className="mt-3 max-w-[42ch] text-sm text-muted-foreground">
                Independent PC optimisation &amp; custom build service. Based UK, working globally over Discord. One-man operation — that's the point.
              </p>
            </div>
            {[
              ["Service", [["Custom build · £45", "#services"], ["Optimisation · £25", "#services"], ["Bundle · £70", "#services"], ["Parts I recommend", "/parts"], ["Re-tune", "#order"]]],
              ["Contact", [["Discord", "#order"], ["Email", "#order"], ["Booking", "#order"]]],
              ["Legal", [["Terms", "#"], ["Privacy", "#"], ["Refund", "#"]]],
            ].map(([title, items]) => (
              <div key={title}>
                <h5 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {title}
                </h5>
                <ul className="mt-4 space-y-2 text-sm">
                  {items.map(([t, h]) => (
                    <li key={t}>
                      <a href={h} className="text-foreground/80 transition-colors hover:text-foreground">
                        {t}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t pt-6 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:flex-row md:items-center">
            <span>© {new Date().getFullYear()} matthew.sys · Built on Laravel · v0.4.1</span>
            <span>Builds signed — 114 · Uptime — 99.4%</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
