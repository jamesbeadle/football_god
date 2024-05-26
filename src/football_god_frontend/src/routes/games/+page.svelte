<!-- src/routes/site/minigames.svelte -->
<script>
    import Layout from "../Layout.svelte";
  
    const games = [
      {
        title: "Euro 2024",
        description: "Predict your way through Euro 2024 to win $FPL.",
        imageUrl: "/FPLCoin.png",
        link: "/euro2024"
      }
    ];
  </script>
  
  <Layout>
    <div class="min-h-screen flex flex-col p-4">
      <h1 class="text-3xl font-bold my-6">Our Games</h1>
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {#each games as game}
          <a href={game.link} class="bg-OPENFPLPURPLE rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
            <img src={game.imageUrl} alt={game.title} class="w-full h-48 object-cover">
            <div class="p-4">
              <h2 class="text-xl font-bold mb-2">{game.title}</h2>
              <p class="">{game.description}</p>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </Layout>
  