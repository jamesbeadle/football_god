<!-- src/routes/site/betting.svelte -->
<script>
    import Layout from "../Layout.svelte";

    export let title = "Betting Unavailable";
    export let message = "Betting is currently unavailable in your region.";
  </script>
  
<Layout>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
      <p class="text-gray-600">{message}</p>
    </div>
  </div>
</Layout>