<!doctype html>
<html lang="en" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>matthew.sys — PC optimisation & custom builds</title>
    <meta name="description" content="Hand-tuned BIOS, Windows and hardware optimisation. Custom UK PC build sheets. Done by a human, not an .exe.">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
