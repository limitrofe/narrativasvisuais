<script>
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores'; // NOVO: Para ler a URL de forma reativa no SvelteKit

  export let title = '';
  export let characters = [];
  export let id = ''; // NOVO: A prop que receberá o id da âncora

  let mainContainerEl;
  let scrollProgress = 0;
  
  let activeStep = -1;
  const totalSteps = characters.length * 2;
  
  const deadZoneStart = 0.0; 
  const deadZoneEnd = 0.95;

  let isIntroAnimating = false;
  let hasIntroPlayed = false;

  // NOVO: Flag para controlar o modo "mostrar tudo"
  let showAll = false;

  // NOVO: Verifica a URL reativamente. Se o hash da URL for igual ao id do componente, ativa o modo "mostrar tudo".
  $: {
    if ($page.url.hash === `#${id}`) {
      showAll = true;
    }
  }

  // NOVO: Se showAll for ativado, força o activeStep para o valor máximo, revelando todos os elementos.
  $: {
    if (showAll) {
      activeStep = totalSteps;
    }
  }

  function handleScroll() {
    // ALTERADO: O scroll é desativado se o modo "mostrar tudo" estiver ativo.
    if (!mainContainerEl || isIntroAnimating || showAll) return;

    if (!hasIntroPlayed) {
      hasIntroPlayed = true;
    }
    
    const rect = mainContainerEl.getBoundingClientRect();
    const scrollableDistance = rect.height - window.innerHeight;
    const progress = rect.top > 0 ? 0 : -rect.top / scrollableDistance;
    scrollProgress = Math.max(0, Math.min(1, progress));
  }
  
  $: {
    // ALTERADO: A lógica de scroll só funciona se showAll for falso.
    if (hasIntroPlayed && !showAll) {
      if (scrollProgress >= deadZoneEnd) {
        activeStep = totalSteps - 1; 
      } else {
        const animationProgress = (scrollProgress - deadZoneStart) / (deadZoneEnd - deadZoneStart);
        activeStep = Math.max(1, Math.floor(animationProgress * totalSteps));
      }
    }
  }

  $: activeMobileCardIndex = Math.floor(activeStep / 2);
  $: isTextStep = activeStep % 2 === 1;

  onMount(() => {
    // Checa a URL uma vez no carregamento inicial da página
    if (window.location.hash === `#${id}`) {
      showAll = true;
      return; // Se for para mostrar tudo, não precisa do observer.
    }

    const options = {
      root: null,
      threshold: 0.2
    };

    // A animação de entrada só é configurada se não for o caso de "mostrar tudo".
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isIntroAnimating = true;
          activeStep = 0;
          setTimeout(() => {
            activeStep = 1;
            isIntroAnimating = false;
          }, 800);
          observer.unobserve(mainContainerEl);
        }
      });
    }, options);

    observer.observe(mainContainerEl);

    return () => {
      observer.disconnect();
    };
  });
</script>


<svelte:window on:scroll={handleScroll} />

<div class="main-container" bind:this={mainContainerEl} style="--char-count: {characters.length};">
  <div class="sticky-container">
    
    {#if title}
      <div class="title-container">
        <h1>{title}</h1>
      </div>
    {/if}

    <div class="content-wrapper">
      <div class="desktop-layout">
        {#each characters as character, i (character.id)}
          <div class="character-column">
            <div class="image-wrapper" class:visible={activeStep >= i * 2}>
              <img src={character.photoUrl} alt="Foto de {character.name}" />
            </div>
            <div class="description-content" class:visible={activeStep >= (i * 2) + 1}>
              <h2>{character.name}</h2>
              <p>{@html character.description}</p>
            </div>
          </div>
        {/each}
      </div>

      <div class="mobile-layout">
        <div class="mobile-cards-container">
          {#each characters as character, i (character.id)}
            <div class="mobile-character-card" class:active={i === activeMobileCardIndex}>
              <div class="image-wrapper">
                <img src={character.photoUrl} alt="Foto de {character.name}" />
              </div>
              <div class="description-content" class:visible={isTextStep}>
                <h2>{character.name}</h2>
                <p>{@html character.description}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

  </div>
</div>

<style>
  /* --- ANIMAÇÕES DE GLITCH MAIS FORTES --- */
  @keyframes glitchLines {
    0% { transform: translateX(-5%); }
    10%, 100% { opacity: 0; transform: translateX(0); }
    20% { opacity: 1; transform: translateX(5%); }
    30% { transform: translateX(-10%); }
    40% { transform: translateX(10%); }
    50% { transform: translateX(-5%); }
    60% { transform: translateX(2%); }
    70% { transform: translateX(-8%); }
    80% { transform: translateX(8%); }
    90% { opacity: 1; transform: translateX(-2%); }
  }

  @keyframes glitchBlocks {
    0%, 100% {
      opacity: 0;
      clip-path: inset(50% 0 50% 0);
    }
    10% {
      opacity: 1;
      clip-path: inset(10% 0 70% 0);
    }
    30% {
      clip-path: inset(80% 0 5% 0);
    }
    50% {
      clip-path: inset(40% 0 40% 0);
    }
    70% {
      clip-path: inset(20% 0 20% 0);
    }
    90% {
      opacity: 1;
      clip-path: inset(5% 0 5% 0);
    }
  }

  /* --- ESTILOS GERAIS --- */
  .main-container {
    position: relative;
    height: calc(var(--char-count, 3) * 100vh); 
    background-color: #0c0b1e;
    font-family: 'Globotipo', sans-serif; 

  }

  .sticky-container {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
    padding-top: 0;

  }

  .title-container {
    flex-shrink: 0;
    text-align: center;
    color: #fff;
    font-family: 'Globotipo', sans-serif; 
        margin-top: 50px;

  }

  .title-container h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    font-family: 'Globotipo', sans-serif; 
  }
  
  .content-wrapper {
    flex: 1;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .desktop-layout, .mobile-layout {
    width: 100%;
    height: 100%;
  }

  .image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
  }

  .description-content h2 { font-size: 1.8rem; margin-bottom: 0.75rem;      font-family: 'Globotipo', sans-serif; }
  .description-content p { font-size: 1rem; line-height: 1.5; color: #ccc;      font-family: 'Globotipo', sans-serif; }
  
  /* --- LAYOUT DESKTOP --- */
  .desktop-layout {
    display: grid;
    grid-template-columns: repeat(var(--char-count, 3), 1fr);
    gap: 1.5rem;
    margin-top: 50px;
        max-width: 1440px;  /* 👈 Define uma largura máxima. O conteúdo nunca passará disso. */
    width: 90%;         /* 👈 Garante que em telas menores (mas >900px) não cole nas bordas. */
    margin-left: auto;  /* 👈 Centraliza o container na horizontal. */
    margin-right: auto; /* 👈 Centraliza o container na horizontal. */

  }
  
  .desktop-layout .image-wrapper {
    height: 45%;
    opacity: 0;
    transform: scale(0.15);
    filter: grayscale(1);
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                filter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                opacity 0.5s ease-out;
  }

  .desktop-layout .image-wrapper.visible {
    opacity: 1;
    transform: scale(1);
    filter: none;
  }
  
  .desktop-layout .description-content {
    height: 40%;
    padding: 1.5rem 1rem 0 1rem;
    color: #fff;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease-out 0.3s;
  }
  .desktop-layout .description-content.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* --- ESTILOS DO GLITCH (DESKTOP E MOBILE) --- */
  .desktop-layout .image-wrapper,
  .mobile-layout .image-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    
  }
  
  .desktop-layout .image-wrapper::before,
  .desktop-layout .image-wrapper::after,
  .mobile-layout .image-wrapper::before,
  .mobile-layout .image-wrapper::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    opacity: 0;
    pointer-events: none;
  }
  
  .desktop-layout .image-wrapper::before,
  .mobile-layout .image-wrapper::before {
    background: linear-gradient(90deg, rgba(0, 255, 255, 0.35), rgba(0, 255, 100, 0.2));
    background-size: 100% 3px;
  }

  .desktop-layout .image-wrapper::after,
  .mobile-layout .image-wrapper::after {
    background: linear-gradient(0deg, rgba(255, 0, 255, 0.2), rgba(255, 100, 0, 0.3));
    background-size: 4px 100%;
  }
  
  /* Ativação do glitch no DESKTOP */
  .desktop-layout .image-wrapper.visible::before {
    animation: glitchLines 0.8s ease-out forwards;
  }
  .desktop-layout .image-wrapper.visible::after {
    animation: glitchBlocks 0.8s ease-out forwards 0.1s;
  }

  .mobile-layout { display: none; }

  /* --- RESPONSIVIDADE --- */
  @media (max-width: 900px) {
     .desktop-layout .image-wrapper {
    height: 35%;
    opacity: 0;
    transform: scale(0.15);
    filter: grayscale(1);
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                filter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                opacity 0.5s ease-out;
  }

   
    .desktop-layout { display: none;    }
    .mobile-layout { display: block;     }
    
    .title-container h1 {
      font-size: 1.8rem;
       
    }

    .mobile-cards-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .mobile-character-card {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease-in-out;
    }
    .mobile-character-card.active {
      opacity: 1;
      pointer-events: auto;
    }

    .mobile-layout .image-wrapper {
      /* flex: 1;  */
      height: 200px;
      background-color: #1a1a1a;
    }

    .mobile-layout .description-content {
      flex-shrink: 0;
      height: auto; 
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 0 0.5rem;
      color: #fff;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.4s ease-out, transform 0.4s ease-out;
    }
    .mobile-layout .description-content.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .mobile-layout h2 { font-size: 1.5rem; }
    .mobile-layout p { font-size: 0.95rem; }

    /* Ativação do glitch no MOBILE */
    .mobile-character-card.active .image-wrapper::before {
      animation: glitchLines 0.8s ease-out forwards;
    }
    .mobile-character-card.active .image-wrapper::after {
      animation: glitchBlocks 0.8s ease-out forwards 0.1s;
    }
  }
</style>