<script>
  import { gsap } from 'gsap';
  import { onMount } from 'svelte';

  export let secoes = [
    { id: 'trailer', label: 'Trailer' },
    { id: 'sinopse', label: 'Sinopse' },
    { id: 'trama', label: 'Trama' },
    { id: 'nucleos', label: 'Núcleos' },
    { id: 'curiosidades', label: 'Curiosidades' },
    { id: 'creditos', label: 'Créditos' }
  ];
  export let imagemTopo = "";
  export let imagemBgMenuDesk = "";
  export let imagemBgMenuMob = "";

  let menuAberto = false;
  let menuRef;
  let linksRef;
  let bgMenu = "";

  function atualizarBgMenu() {
    if (window.innerWidth < 768 && imagemBgMenuMob) {
      bgMenu = `url('${imagemBgMenuMob}')`;
    } else if (imagemBgMenuDesk) {
      bgMenu = `url('${imagemBgMenuDesk}')`;
    } else {
      bgMenu = "";
    }
  }

  onMount(() => {
    atualizarBgMenu();
    window.addEventListener('resize', atualizarBgMenu);
    return () => window.removeEventListener('resize', atualizarBgMenu);
  });

  function toggleMenu() {
    menuAberto = !menuAberto;

    if (menuAberto) {
      gsap.to(menuRef, {
        y: 0,
        opacity: 1,
        display: 'flex',
        duration: 0.4,
        ease: 'power2.out'
      });
      gsap.fromTo(
        linksRef.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.out'
        }
      );
      document.body.style.overflow = 'hidden';
    } else {
      fecharMenu();
    }
  }

  function fecharMenu() {
    menuAberto = false;
    gsap.to(menuRef, {
      y: '100%',
      opacity: 0,
      display: 'none',
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        document.body.style.overflow = '';
      }
    });
  }
</script>

<nav class="menu-fixo-wrapper">
  <div class="menu-bar">
    <button class="hamburguer" on:click={toggleMenu} aria-label="Abrir menu">
      <img
        src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/menu.svg"
        alt="Abrir menu"
        class="icone-menu"
        draggable="false"
      />
    </button>
    {#if imagemTopo}
      <img src={imagemTopo} alt="Logo" class="logo-barra" />
    {/if}
  </div>

  <div
    class="menu-expandido"
    bind:this={menuRef}
    style="transform: translateY(100%); opacity: 0; display: none; background-image: {bgMenu};"
  >
    <button class="fechar" on:click={fecharMenu} aria-label="Fechar menu">
      <img
        src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/fechar.svg"
        alt="Fechar menu"
        class="icone-fechar"
        draggable="false"
      />
    </button>
    {#if imagemTopo}
      <img src={imagemTopo} alt="Logo Grande" class="logo-grande" />
    {/if}
    <div class="links-container" bind:this={linksRef}>
      {#each secoes as secao}
        <a href={`#${secao.id}`} on:click={fecharMenu}>
          {secao.label}
        </a>
      {/each}
    </div>
  </div>
</nav>

<style>
  html {
    scroll-behavior: smooth;
  }

  .menu-fixo-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    z-index: 2147483647;
    pointer-events: none;
  }

  .menu-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #cd670d;
    padding: 0.75rem 1rem;
    pointer-events: auto;
    opacity: 0.9;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 10;
  }

  .hamburguer,
  .fechar {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 11;
  }

  .icone-menu,
  .icone-fechar {
    height: 32px;
    width: 32px;
    object-fit: contain;
    display: block;
    user-select: none;
    pointer-events: none;
  }

  .logo-barra {
    height: 36px;
    max-width: 180px;
  }

  @media (min-width: 768px) {
    .menu-bar {
      justify-content: center;
    }
    .hamburguer {
      position: absolute;
      left: 1.5rem;
    }
    .logo-barra {
      height: 48px;
    }
    .icone-menu,
    .icone-fechar {
      height: 32px;
      width: 32px;
    }
  }

  .menu-expandido {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #cd670d;
    color: white;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    transform: translateY(100%);
    opacity: 0;
    z-index: 9999;
    padding-top: 2rem;
    box-sizing: border-box;
    pointer-events: auto;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .fechar {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 12;
  }

  .logo-grande {
    max-width: 280px;
    margin-bottom: 1rem;
    margin-top: 3rem;
    margin-left:50px;
  }

  .links-container {
    flex: 1 1 0;
    min-height: 0;
    width: 100%;
    max-width: 480px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    scrollbar-width: none;
  }
  .links-container::-webkit-scrollbar {
    display: none;
  }

  .menu-expandido a {
    color: #fff;
    font-size: 3rem;
    margin: 0.5rem 0;
    text-decoration: none;
    display: block;
    text-align: center;
  }

  .menu-expandido a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .logo-grande {
      max-width: 200px;
      margin-bottom: 1rem;
          margin-top: 1rem;

    }
    .links-container {
      max-width: 98vw;
    }
    .icone-menu,
    .icone-fechar {
      height: 28px;
      width: 28px;
    }
    
  .menu-expandido a {
    color: #fff;
    font-size: 2rem;
    margin: 0.5rem 0;
    text-decoration: none;
    display: block;
    text-align: center;
  }

  }
</style>
