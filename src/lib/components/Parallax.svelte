<script>
  import { onMount } from 'svelte';

  export let layers = [];
  export let breakpoint = 768;

  let containerElement;
  let scrollProgress = 0;
  let windowWidth = 0;

  function handleScroll() {
    if (!containerElement) return;
    const rect = containerElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
    scrollProgress = Math.max(0, Math.min(1, progress));
  }

  // ==================================================================
  // A SOLUÇÃO ESTÁ AQUI
  // ==================================================================
  onMount(() => {
    // 1. Garante que a largura inicial da janela seja capturada.
    windowWidth = window.innerWidth;
    
    // 2. Chama a função de scroll uma vez para calcular a posição inicial correta.
    // Isso sincroniza o estado do componente com sua posição real na página,
    // eliminando o "pulo".
    handleScroll();
  });
  // ==================================================================

  $: isMobile = windowWidth < breakpoint;

  $: effectiveLayers = layers.map(layer => {
    if (isMobile && layer.mobile) {
      const { mobile, ...baseLayer } = layer;
      return { ...baseLayer, ...mobile };
    }
    return layer;
  });

  $: layerStyles = effectiveLayers.map(layer => {
    const progressCentered = scrollProgress - 0.5;
    const transformX = progressCentered * (layer.speedX || 0) * 100;
    const transformY = progressCentered * (layer.speedY || 0) * 100;
    const transformZ = progressCentered * (layer.speedZ || 0) * 100;
    const scale = (layer.initialScale || 1) + scrollProgress * (layer.speedScale || 0);

    return `
      z-index: ${layer.zIndex || 0};
      transform:
        translateX(${transformX}vw)
        translateY(${transformY}vh)
        translateZ(${transformZ}px)
        scale(${scale});
      will-change: transform;
    `;
  });
</script>

<svelte:window on:scroll={handleScroll} on:resize={handleScroll} bind:innerWidth={windowWidth} />

<div class="parallax-container" bind:this={containerElement}>
  <div class="layers-wrapper">
    {#each effectiveLayers as layer, i (layer.src)}
      <div class="parallax-layer" style={layerStyles[i]}>
        <img src={layer.src} alt={layer.alt || 'Camada de parallax'} />
      </div>
    {/each}
  </div>
</div>

<style>
  /* Seus estilos permanecem exatamente os mesmos */
  .parallax-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 16 / 9;
    perspective: 1000px;
  }

  .layers-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .parallax-layer {
    position: absolute;
    top: -25%;
    left: -25%;
    width: 150%;
    height: 150%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .parallax-layer img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    .parallax-container {
      aspect-ratio: unset;
      height: 100vh;
    }
  }
</style>