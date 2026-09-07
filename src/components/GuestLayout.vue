<script setup>
import { RouterLink } from 'vue-router';
import { asset } from '@/lib/imagen';
</script>

<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
    :style="{ backgroundImage: `url('${asset('images/login_bg.png')}')` }"
  >
    <div class="absolute inset-0 bg-black/40 z-0"></div>

    <div class="relative z-10 w-full sm:max-w-md flex flex-col items-center">
      <RouterLink to="/" class="flex flex-col items-center group">
        <div class="flex items-center justify-center h-20 w-20 rounded-full bg-white/20 backdrop-blur-md shadow-lg border border-white/30 transition-transform duration-300 group-hover:scale-110">
          <svg class="h-12 w-12 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </div>
        <h1 class="mt-4 text-3xl font-extrabold text-white tracking-tight drop-shadow-md transition-transform duration-300 group-hover:scale-105">
          GeoTurismo<span class="text-green-400">SV</span>
        </h1>
      </RouterLink>

      <p class="mt-4 text-center text-sm text-gray-200 drop-shadow font-medium">
        Donde cada lugar cuenta una historia
      </p>
    </div>

    <div class="relative z-10 mt-8 w-full sm:max-w-md overflow-hidden bg-white/90 backdrop-blur-xl px-8 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.2)] sm:rounded-3xl border border-white/50">
      <slot />
    </div>
  </div>
</template>
