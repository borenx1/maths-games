<script>
  import '../app.css';
  import { theme } from '$lib/stores/app';

  function toggleTheme() {
    theme.update((value) => value === 'dark' ? 'light' : 'dark');
  }
</script>

<header class="w-full flex items-stretch border-b sm:px-4">
  <a href="/" class="inline-flex items-center text-center px-2 sm:px-4 py-2 sm:py-4">
    <h1 class="text-lg sm:text-xl font-bold">Maths Games</h1>
  </a>
  <nav class="inline-flex items-stretch">
    <a href="/games" class="flex items-center text-center px-2 sm:px-4 py-2 hover:text-sky-600 dark:hover:text-sky-400">
      Games
    </a>
    <a href="/resources" class="flex items-center text-center px-2 sm:px-4 py-2 hover:text-sky-600 dark:hover:text-sky-400">
      Resources
    </a>
    <a href="/about" class="flex items-center text-center px-2 sm:px-4 py-2 hover:text-sky-600 dark:hover:text-sky-400">
      About
    </a>
  </nav>
  <div class="inline-flex ml-auto">
    <button
      type="button"
      class="hover:text-sky-600 dark:hover:text-sky-400 p-2 sm:p-4"
      title="Toggle dark mode"
      aria-label="Toggle dark mode"
      on:click={toggleTheme}
    >
      <!-- https://heroicons.com/ -->
      {#if $theme === 'dark'}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      {/if}
    </button>
  </div>
</header>

<div class="px-4 sm:px-8">
  <slot />
</div>

<footer class="w-full">

</footer>
