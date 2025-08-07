<script>
  import { onMount } from "svelte";
  let apiUrl = "https://recomendacao.globo.com/v3/globocom/ab/GSHOW-FEED-SMART-user?responseFormat=legacyPublishing&page=1&perPage=10&glb_uid=Y9rMUeon6WBFiuwyUWmm5iWmplo7UNuRWGfYGg_MuNM=&hsid=7ce379b0-c6e8-44bd-9d1f-8eab5f56dd0c";
  let items = [];
  let loading = true;
  let error = "";

  onMount(async () => {
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Erro ao carregar feed");
      items = await res.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  // Helper para pegar imagem wide (desktop) e vertical (mobile)
  function getImg(sizes) {
    // Preferência para desktop wide e mobile vertical
    return {
      wide: sizes?.L?.url || sizes?.M?.url || "",
      vertical: sizes?.VXL?.url || sizes?.VL?.url || sizes?.VM?.url || ""
    }
  }
</script>

<style>
  .rotativa-container {
    overflow-x: auto;
    display: flex;
    gap: 2rem;
    padding: 1rem 0;
    scrollbar-width: thin;
  }
  .rotativa-card {
    background: #fff;
    border-radius: 20px;
    min-width: 320px;
    max-width: 370px;
    box-shadow: 0 3px 24px -10px #0002;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }
  .rotativa-card img {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    display: block;
    background: #eee;
  }
  .rotativa-info {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .rotativa-title {
    font-weight: 700;
    font-size: 1.18rem;
    color: #1a2227;
    line-height: 1.18;
    margin: 0 0 0.5rem 0;
  }
  .rotativa-summary {
    color: #666;
    font-size: 0.97rem;
    line-height: 1.22;
  }
  .rotativa-section {
    color: #c4170c;
    font-size: 0.84rem;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 1px;
    margin-top: 0.7rem;
  }
  .rotativa-link {
    color: #fff;
    background: #c4170c;
    border-radius: 16px;
    padding: 0.5rem 1.1rem;
    font-size: 1rem;
    font-weight: 700;
    align-self: flex-start;
    margin-top: 1rem;
    text-decoration: none;
    transition: background 0.18s;
  }
  .rotativa-link:hover { background: #a80f0b; }
  @media (max-width: 600px) {
    .rotativa-container { gap: 1rem; }
    .rotativa-card { min-width: 90vw; max-width: 94vw; }
    .rotativa-card img { aspect-ratio: 16/9; }
  }
</style>

{#if loading}
  <div>Carregando...</div>
{:else if error}
  <div>Erro: {error}</div>
{:else}
  <div class="rotativa-container">
    {#each items as item}
      <div class="rotativa-card">
        <a href={item.content.url} target="_blank" rel="noopener">
          <picture>
            <source srcset={getImg(item.content.image.sizes).vertical} media="(max-width: 700px)">
            <img src={getImg(item.content.image.sizes).wide} alt={item.content.title || ""} loading="lazy">
          </picture>
        </a>
        <div class="rotativa-info">
          {#if item.content.section}
            <div class="rotativa-section">{item.content.section}</div>
          {/if}
          <div class="rotativa-title">{item.content.title}</div>
          <div class="rotativa-summary">{item.content.summary}</div>
          <a class="rotativa-link" href={item.content.url} target="_blank" rel="noopener">Ler mais</a>
        </div>
      </div>
    {/each}
  </div>
{/if}
