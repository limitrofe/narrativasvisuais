<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  export let snippet1Src = "";
  export let snippet2Src = "";
  export let snippet3Src = "";
  export let wrapperId = "";

  let imagemAtual = snippet1Src;
  let isVisible = false;
  
  let visibilityObserver;
  let triggerObserver;

  onMount(() => {
    const wrapperElement = document.getElementById(wrapperId);
    if (!wrapperElement) {
      console.error(`Snippet Error: Elemento com id #${wrapperId} não foi encontrado.`);
      return;
    }

    // --- Observador 1: Controla a VISIBILIDADE GERAL do snippet ---
    // Este observador garante que o snippet só exista quando a seção <cozinhas> estiver na tela.
    visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, {
      // O threshold 0 significa que ele se torna visível assim que o primeiro pixel da seção wrapper entra
      // e invisível assim que o último pixel sai.
      threshold: 0 
    });

    visibilityObserver.observe(wrapperElement);

    // --- Observador 2: Controla a TROCA DE IMAGEM (AQUI ESTÁ A MÁGICA) ---
    const secoesDeTexto = document.querySelectorAll('.trigger-snippet');
    if (secoesDeTexto.length === 0) return;

    triggerObserver = new IntersectionObserver((entries) => {
      // Vamos iterar sobre os 'entries' para encontrar o que está ativo
      entries.forEach(entry => {
        // Apenas agimos sobre o elemento que está cruzando nossa "linha de ativação"
        if (entry.isIntersecting) {
          const snippetIndex = entry.target.dataset.snippet;
          if (snippetIndex === '1') imagemAtual = snippet1Src;
          else if (snippetIndex === '2') imagemAtual = snippet2Src;
          else if (snippetIndex === '3') imagemAtual = snippet3Src;
        }
      });
    }, {
      // O threshold diz QUANTO do elemento precisa estar na zona para disparar. 0.5 é um bom valor.
      threshold: 0.5,
      // rootMargin é a chave! Ele encolhe o 'viewport' do observador.
      // '-40% 0px -40% 0px' significa:
      // - A zona de ativação começa a 40% do topo da tela.
      // - A zona de ativação termina a 40% da base da tela.
      // Isso cria uma "faixa de ativação" horizontal no centro da tela com 20% da altura total.
      // Um elemento só estará 'isIntersecting' quando seu centro passar por essa faixa.
      rootMargin: '100% 0px 0px 0px'
    });

    secoesDeTexto.forEach(section => {
      triggerObserver.observe(section);
    });
  });

  onDestroy(() => {
    if (visibilityObserver) visibilityObserver.disconnect();
    if (triggerObserver) triggerObserver.disconnect();
  });
</script>

<style>
  .snippet-container {
    position: fixed;
    bottom: 0px;
    right: 50px;
    width: 200px;
    z-index: 1000;
    rotate: -3deg;
  }

  .snippet-image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
  }

  @media (max-width: 900px) {
    .snippet-container {
      display: none;
    }
  }
</style>

{#if isVisible}
  <div class="snippet-container" transition:fade={{ duration: 200 }}>
    {#key imagemAtual}
      <img 
        class="snippet-image" 
        src={imagemAtual} 
        alt="Ilustração da seção atual"
        in:fade={{ duration: 300 }}
      />
    {/key}
  </div>
{/if}