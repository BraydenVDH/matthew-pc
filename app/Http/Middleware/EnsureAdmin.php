<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->session()->get('is_admin')) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'unauthenticated'], 401);
            }
            return redirect()->guest('/login');
        }
        return $next($request);
    }
}
