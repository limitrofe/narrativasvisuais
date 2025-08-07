<script>
  import { gsap } from 'gsap';

  export let secoes = [];
  export let imagemTopo = ""; // Passe o caminho do logo

  let menuAberto = false;
  let menuRef;
  let linksRef;

  function toggleMenu() {
    menuAberto = !menuAberto;

    if (menuAberto) {
      gsap.to(menuRef, {
        duration: 0.4,
        y: 0,
        opacity: 1,
        display: 'flex',
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
    } else {
      fecharMenu();
    }
  }

  function fecharMenu() {
    menuAberto = false;
    gsap.to(menuRef, {
      duration: 0.3,
      y: '-100%',
      opacity: 0,
      display: 'none',
      ease: 'power2.in'
    });
  }
</script>

<nav class="menu-fixo-wrapper">
  <div class="menu-bar">
    <button class="hamburguer" on:click={toggleMenu} aria-label="Abrir menu">
      <img
        src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/img/hambuerguer.png"
        alt="Abrir menu"
        class="icone-menu"
        draggable="false"
      />
    </button>
    <img src={imagemTopo} alt="Logo" class="logo-barra" />
  </div>

  <div class="menu-expandido" bind:this={menuRef}>
    <button class="fechar" on:click={fecharMenu} aria-label="Fechar menu">
      <img
        src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/img/fechar.png"
        alt="Fechar menu"
        class="icone-fechar"
        draggable="false"
      />
    </button>
    <img src={imagemTopo} alt="Logo Grande" class="logo-grande" />
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
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2147483647;
  }

  .menu-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #232323;
    padding: 0.75rem 1rem;
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
  }

  .icone-menu,
  .icone-fechar {
    height: 32px;
    width: 32px;
    object-fit: contain;
    display: block;
    pointer-events: none;
    user-select: none;
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
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #232323;
    color: white;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    transform: translateY(-100%);
    opacity: 0;
    z-index: 9999;
    padding-top: 2rem;
    box-sizing: border-box;
  }

  .fechar {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 2;
  }

  .logo-grande {
    max-width: 350px;
    margin-bottom: 1rem;
    margin-top: 5rem;
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
    color: white;
    font-size: 1.5rem;
    margin: 0.5rem 0;
    text-decoration: none;
    font-family: 'Open Sans', sans-serif;
    display: block;
    text-align: center;
  }

  .menu-expandido a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .logo-grande {
      max-width: 280px;
      margin-bottom: 1rem;
    }
    .links-container {
      max-width: 98vw;
    }
    .icone-menu,
    .icone-fechar {
      height: 28px;
      width: 28px;
    }
  }
</style>
