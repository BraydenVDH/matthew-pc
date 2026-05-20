<!doctype html>
<html lang="en" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>matthew.sys — admin</title>
    @viteReactRefresh
    @vite(['resources/css/app.css'])
</head>
<body class="min-h-dvh bg-background text-foreground antialiased">
    <div aria-hidden class="pointer-events-none fixed inset-0 -z-10 opacity-60"
         style="background: radial-gradient(40rem 30rem at 50% 0%, color-mix(in oklch, var(--color-chart-1) 14%, transparent), transparent 60%);">
    </div>

    <main class="flex min-h-dvh items-center justify-center px-6">
        <div class="w-full max-w-md">
            <a href="/" class="mb-8 flex items-center gap-2.5 font-mono text-sm tracking-tight">
                <span class="relative grid size-6 place-items-center rounded-md border bg-card">
                    <span class="size-1.5 rounded-full bg-chart-1" style="box-shadow: 0 0 10px var(--color-chart-1);"></span>
                </span>
                <span class="font-semibold">matthew.sys</span>
                <span class="ml-1 rounded-md border px-2 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground">admin</span>
            </a>

            <div class="rounded-xl border bg-card p-8 shadow-sm">
                <div class="mb-6">
                    <h1 class="text-2xl font-semibold tracking-tight">Admin sign-in</h1>
                    <p class="mt-2 text-sm text-muted-foreground">Single-account access. Password only.</p>
                </div>

                <form method="POST" action="/login" class="grid gap-4">
                    @csrf
                    <div class="grid gap-2">
                        <label for="password" class="text-sm font-medium leading-none">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            autofocus
                            autocomplete="current-password"
                            class="flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none transition focus:ring-2 focus:ring-ring/50"
                            style="background: color-mix(in oklch, var(--color-input) 30%, transparent);"
                        >
                        @error('password')
                            <p class="font-mono text-xs text-destructive">{{ $message }}</p>
                        @enderror
                    </div>
                    <button
                        type="submit"
                        class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90"
                    >
                        Sign in →
                    </button>
                </form>

                <p class="mt-6 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Lost your password? Re-run the AdminSeeder.
                </p>
            </div>

            <a href="/" class="mt-6 inline-block font-mono text-[11px] text-muted-foreground hover:text-foreground">← back to site</a>
        </div>
    </main>
</body>
</html>
