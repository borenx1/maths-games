<script>
  import '../app.css';
</script>

<header class="w-full bg-sky-200 flex items-stretch">
  <a href="/" class="inline-block text-center px-2 sm:px-4 py-2 sm:py-4">
    <h1 class="text-xl sm:text-3xl font-bold">Maths Games</h1>
  </a>
  <nav class="inline-flex items-stretch">
    <a href="/games" class="flex items-center text-center px-2 py-2">Games</a>
    <a href="/resources" class="flex items-center text-center px-2 py-2">Resources</a>
    <a href="/about" class="flex items-center text-center px-2 py-2">About</a>
  </nav>
</header>

<div class="px-4 sm:px-8">
  <slot />
</div>

<footer class="w-full">

</footer>