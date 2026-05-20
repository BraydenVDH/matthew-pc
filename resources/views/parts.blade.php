<!doctype html>
<html lang="en" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="is-admin" content="{{ session('is_admin') ? 'true' : 'false' }}">
    <title>matthew.sys — Parts I actually recommend</title>
    <meta name="description" content="A short, opinionated list of PC parts and peripherals worth buying. Amazon UK links — I earn a small commission, you pay the same price.">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/parts.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
