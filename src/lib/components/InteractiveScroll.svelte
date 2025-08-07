<script>
  import { onMount, onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';

  // --- PROPRIEDADES DO PALCO ---
  export let bgImageDesk = '';
  export let bgImageMob = '';
  /** Altura total da área de rolagem. Ex: '400vh' */
  export let scrollHeight = '300vh';

  // --- STORES PARA REATIVIDADE GLOBAL (DENTRO DESTE CONTEXTO) ---
  // Usamos 'stores' para que os componentes filhos possam se inscrever a eles ($)
  const scrollY = writable(0);
  const isMobile = writable(false);

  // --- LÓGICA DE DETECÇÃO DE SCROLL E RESIZE ---
  const mobileBreakpoint = 768;

  const handleScroll = () => scrollY.set(window.scrollY);
  const handleResize = () => {
    isMobile.set(window.innerWidth < mobileBreakpoint);
  };

  onMount(() => {
    // Roda a primeira vez para definir o estado inicial
    handleResize(); 
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
  });

  onDestroy(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
  });

  // --- MÁGICA DO CONTEXTO ---
  // Fornece os stores scrollY e isMobile para qualquer filho que pedir.
  setContext('interactive-scroll', { scrollY, isMobile });
</script>

<section class="scroll-wrapper" style="height: {scrollHeight};">
  <div class="sticky-container">
    
    <img 
      class="background-image"
      src={$isMobile ? bgImageMob : bgImageDesk}
      alt="Fundo da cena interativa"
    />

    <slot></slot>

  </div>
</section>

<style>
  .scroll-wrapper {
    position: relative;

  }
  .sticky-container {
    position: sticky;
    top: 50px;
    height: 100vh;
    width: 100%;
    overflow: hidden;
        max-width: 1920px;  /* 👈 Define uma largura máxima. O conteúdo nunca passará disso. */
    width: 100%;         /* 👈 Garante que em telas menores (mas >900px) não cole nas bordas. */
    margin-left: auto;  /* 👈 Centraliza o container na horizontal. */
    margin-right: auto; /* 👈 Centraliza o container na horizontal. */

  }
  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }
</style>