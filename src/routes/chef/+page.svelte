<script>
  // --- SEUS IMPORTS E COMPONENTES ORIGINAIS (MANTIDOS) ---
  import BotaoFlutuante from '$lib/components/BotaoFlutuante.svelte';
  import Ancora from '$lib/components/Ancora.svelte';
  import Parallax from '$lib/components/Parallax.svelte';
  import HorizontalReveal from '$lib/components/HorizontalReveal.svelte';
  import HeroHeader from '$lib/components/HeroHeader.svelte';
  import ImagemFull from '$lib/components/ImagemFull.svelte';
  import Section from '$lib/components/Section.svelte';
  import ScrollNotasSobreImagem from '$lib/components/ScrollNotasSobreImagem.svelte';
  import CaixaTexto from '$lib/components/CaixaTexto.svelte';
  import Titulo from '$lib/components/Titulo.svelte';
  import ImagemPro from '$lib/components/ImagemPro.svelte';
  import Snippet from '$lib/components/Snippet.svelte'; 
  import Andar from '$lib/components/Andar.svelte'; 
  import DinamicadoReality from '$lib/components/DinamicadoReality.svelte';
  import GaleriaCan from '$lib/components/GaleriaCan.svelte';
  import TextoLongo from '$lib/components/TextoLongo.svelte';
  import GloboPlayer from '$lib/components/GloboPlayer.svelte';
  import GaleriaPolaroid from '$lib/components/GaleriaPolaroid.svelte';
  import Creditos from '$lib/components/Creditos.svelte';
  import { browser } from '$app/environment'; 
  import InteractiveScroll from '$lib/components/InteractiveScroll.svelte';
  import Hotspot from '$lib/components/Hotspot.svelte';

  // --- [INÍCIO] CÓDIGO ADICIONADO PARA O MENU SLIDER ---
  import { onMount } from 'svelte';

  let scrollContainer; // Referência para o DIV que contém os links
  let showLeftButton = false; // Controla a visibilidade do botão esquerdo
  let showRightButton = false; // Controla a visibilidade do botão direito

  function scrollRight() {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  function scrollLeft() {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  function checkScroll() {
    if (!scrollContainer) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    showLeftButton = scrollLeft > 1;
    showRightButton = scrollLeft < scrollWidth - clientWidth - 1;
  }
  
  onMount(() => {
    setTimeout(checkScroll, 150);
    window.addEventListener('resize', checkScroll);
    return () => {
        window.removeEventListener('resize', checkScroll);
    }
  });
  // --- [FIM] CÓDIGO ADICIONADO PARA O MENU SLIDER ---


  // --- SEUS DADOS E FUNÇÕES ORIGINAIS (MANTIDOS) ---
  const exampleLayers=[
    {
      src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/bg_desk.jpg',
      alt: 'Céu distante',
      speedY: -0.05,
      speedX: 0.05,
      zIndex: 1,
      mobile: {
        src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/bg_mob.jpg',
        speedY: -0.08,
        speedX: -0.05,
      }
    },
    {
      src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/apresentadora.png',
      alt: 'Apresentadora',
      speedY: -0.2,
      zIndex: 2,
      initialScale: 0.8,
      mobile: {
        src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/apresentadora-mob.png',
        initialScale: 0.71,
        speedY: 0.15,
      }
    },
    {
      src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/logoCan.png',
      alt: 'Logo do Canal',
      speedY: 0,
      zIndex: 5,
      initialScale: 0.55,
      mobile: {
        src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/logoCan-mob.png',
        initialScale: 0.6,
        speedY: -0.05,
      }
    },
    {
      src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/logoTV.png',
      alt: 'Logo da TV',
      speedX: 0,
      speedY: 0,
      zIndex: 5,
      initialScale: 0.65
    }
  ];




  
  const myCharacters=[
    {
      id: 1,
      name: "Alex Atala",
      photoUrl: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/mentor2.jpg",
      description: `Considerado um dos chefs mais influentes e renomados do mundo, Alex Atala construiu uma carreira sólida ao apostar em uma gastronomia autoral. No Chef de Alto Nível, ele assume o papel de mentor com a mesma intensidade com que conduz sua cozinha: exigente, mas profundamente comprometido com o crescimento dos participantes.`
    },
    {
      id: 2,
      name: "Jefferson Rueda",
      photoUrl: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/mentor1.jpg",
      description: `Se define como cozinheiro, açougueiro, defensor da agricultura familiar e caipira raiz. No reality, Jefferson Rueda quer incentivar o melhor dos participantes: "Se depender de mim, vou fazer o que precisar para o melhor da minha equipe. O dia a dia de uma cozinha não é fácil. É muito difícil. É muito prazeroso, mas é exaustivo.`
    },
    {
      id: 3,
      name: "Renata Vanzetto",
      photoUrl: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/mentora3.jpg",
      description: `Representa uma nova geração de chefs: empreendedora, sensível e com uma visão plural da gastronomia. No Chef de Alto Nível, ela se destaca por sua entrega emocional e por ser firme como mentora.`
    }
  ];

  const meuTitulo="Conheça Nossos Mentores";

  function smoothScrollTo(id, event) {
    event.preventDefault(); 
    const element = document.getElementById(id); 
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      history.pushState(null, null, `#${id}`);
    }
  }
</script>

<nav class="menu-slider-container" class:show-left={showLeftButton} class:show-right={showRightButton}>
  
  {#if showLeftButton}
    <button class="scroll-btn left" on:click={scrollLeft} aria-label="Rolar menu para a esquerda">
      &lt;
    </button>
  {/if}

  <div class="menu-links-wrapper" bind:this={scrollContainer} on:scroll={checkScroll}>
    <a href="#header" on:click={(e) => smoothScrollTo('header', e)}>Início</a>
    <a href="#cenario" on:click={(e) => smoothScrollTo('cenario', e)}>Cozinhas</a>
    <a href="#dinamica" on:click={(e) => smoothScrollTo('dinamica', e)}>Dinâmica</a>
    <a href="#mentores" on:click={(e) => smoothScrollTo('mentores', e)}>Mentores + Participantes</a>
  </div>

  {#if showRightButton}
    <button class="scroll-btn right" on:click={scrollRight} aria-label="Rolar menu para a direita">
      &gt;
    </button>
  {/if}

</nav>
<style>

    .menu-slider-container {
      position: sticky;
      top: 0;
      width: 100%;
      background: rgba(255, 0, 38, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 999999999000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-links-wrapper {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem 1rem;
      overflow-x: auto;
      white-space: nowrap;
      scroll-behavior: smooth;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    .menu-links-wrapper::-webkit-scrollbar {
      display: none;
    }

    .menu-links-wrapper a {
      color: white;
      text-decoration: none;
      font-weight: bold;
      font-size: 1rem;
      transition: color 0.3s ease;
      flex-shrink: 0;
    }
    
    .menu-links-wrapper a:hover {
      color: #FFC700;
    }
    
    .scroll-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.4);
      color: white;
      border: none;
      cursor: pointer;
      z-index: 10;
      font-size: 1.5rem;
      font-weight: bold;
      height: 100%;
      width: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    }
    
    .scroll-btn:hover {
      background-color: rgba(0, 0, 0, 0.7);
    }

    .scroll-btn.left {
      left: 0;
    }
    
    .scroll-btn.right {
      right: 0;
    }

    .menu-slider-container::before,
    .menu-slider-container::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 60px;
      z-index: 5;
      pointer-events: none;
      transition: opacity 0.4s ease;
      opacity: 0;
    }

    .menu-slider-container::before {
      left: 0;
      background: linear-gradient(to right, rgba(255, 0, 38, 1), transparent);
    }

    .menu-slider-container::after {
      right: 0;
      background: linear-gradient(to left, rgba(255, 0, 38, 1), transparent);
    }

    .menu-slider-container.show-left::before {
      opacity: 1;
    }
    .menu-slider-container.show-right::after {
      opacity: 1;
    }
    /* ==================================
      [FIM] ESTILOS DO MENU SLIDER
      ==================================
    */


    /* ================================== */
    /* SEUS ESTILOS ORIGINAIS (MANTIDOS)  */
    /* ================================== */
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-th.woff2') format('woff2');
      font-weight: 100;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-th-lt.woff2') format('woff2');
      font-weight: 100;
      font-style: italic;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-lt.woff2') format('woff2');
      font-weight: 300;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-lt-lt.woff2') format('woff2');
      font-weight: 300;
      font-style: italic;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-rg.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
      font-weight: 400;
      font-style: italic;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
      font-weight: 700;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
      font-weight: 700;
      font-style: italic;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
      font-weight: 900;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
      font-weight: 900;
      font-style: italic;
    }
  
    :global(body) {
      margin: 0;
      font-family: 'Globotipo', sans-serif; 
      background-color: #0c0b1e;
      color: #fff;
    }

    .content-section {
      min-height: 50vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      text-align: center;
    }

    .texto-wrapper {
      margin: 0;
      padding: 0;
    }
    .trigger-snippet {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    :global(.sub-titulo) {
      font-size: 2.5rem;
      font-weight: bold;
      line-height: 1.2;
      display: block;
      margin: 0.5rem 0;
    }

    .intro,
    .outro {
      height: 70vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 2rem;
    }

    .grid-imagens {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: -2rem;
      width: 90%;
      max-width: 1200px;
      margin: 0.1rem auto;
      padding: -2rem;
    }

    .imagem-item, .imagem-item-largo {
      width: 100%;
      height: auto;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .imagem-item-largo {
      grid-column: span 2;
    }

    @media (max-width: 768px) {
      :global(.sub-titulo) {
        font-size: 1rem;
      }

      .grid-imagens {
        grid-template-columns: 1fr 1fr;
        gap: 0.1rem;
      }

      .imagem-item-largo {
        grid-column: span 1;
      }
    }

    :global(.hotspot-content) {
      background: #0c0b1e;
      padding: 0px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      position: relative;
    }
    :global(.hotspot-content-transparencia) {
      background: none;
      padding: 0px;
      border-radius: 0px;
      box-shadow: 0;
      position: relative;
      opacity: 1;
    }
    :global(.hotspot-content2) {
      background: transparent;
      padding: 0px;
      border-radius: 0px;
      position: relative;
    }
    :global(.hotspot-content img) {
      display: block;
      width: 100%;
      border-radius: 4px;
    }
    :global(.hotspot-content-transparencia img) {
      display: block;
      width: 100%;
      border-radius: 0px;
      opacity: 1;
    }
    :global(.hotspot-content2 img) {
      display: block;
      width: 100%;
      border-radius: 4px;
    }
    :global(.pin) {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%) rotate(180deg);
      width: 20px;
      height: 20px;
      background: white;
      clip-path: polygon(0 0, 100% 0, 50% 100%);
    }
 #cenario{
    scroll-margin-top: 100px;
  }
  #game{
    scroll-margin-top: 100px;
  }
  #mentores{
    scroll-margin-top: 100px;
  }
  #creditos{
    scroll-margin-top: 100px;
  }
</style>
<BotaoFlutuante
  href="https://receitas.globo.com/receitas-da-tv/chef-de-alto-nivel/"
  backgroundColor="#FFC700"
  width="3.4375rem"   
  height="3.4375rem"  
  borderRadius="0.625rem" 
  ariaLabel="Tudo sobre Chef de Alto Nível"
>

  <img 
    src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/receitas.svg" 
    style="fill:#5A2864; width: 2rem; height: 2rem;" >
</BotaoFlutuante>

  <Ancora id="header" />

  <Parallax layers={exampleLayers} />



  <Ancora id="game" />


<Section
  fundo="#0c0b1e"
  padding="2rem 0"
  margin="0"
  largura="100vw"
  alturaDesktop="auto"
  alturaMobile="auto"
  id="intro"
  className="intro"
>

  <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
    <ImagemPro
      srcDesk="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/3cozinhas.svg"
      srcMob="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/3cozinhas.svg"
      alt="Ilustração das três cozinhas do reality"
      widthDesk="400px"
      heightDesk="auto"
      widthMob="250px"
      heightMob="auto"
      objectPosition="center"
      legenda=""
      showCredito={false}
    />
    <TextoLongo
      texto="No Chef de Alto Nível, novo reality culinário da Globo apresentado por Ana Maria Braga, a competição vai muito além dos pratos.<br><br>O palco da disputa é uma torre com três andares (porão, meio e topo) e, em cada um deles, uma cozinha com desafios únicos que podem facilitar ou dificultar (e muito) a vida dos competidores.<br><br>Cada cozinha possui ingredientes, utensílios e equipamentos bem particulares."
      cor="#fff"
      tamanhoDesk="1.2rem"
      tamanhoMob="1rem"
      espacamento="0.5rem"
      larguraDesk="60%"
      larguraMob="90%"
      alinhamento="left"
    />

  </div>
</Section>

  <Ancora id="cenario" />

{#if browser}
  <InteractiveScroll
    bgImageDesk="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/predio.jpg"
    bgImageMob="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/predio-mob.jpg"
    scrollHeight="1200vh"
  >

  <Hotspot
      triggerPoint={1600}
      duration={2000}
      desktop={{ top: 73, left: 50, width: 100, height: 60}}
      mobile={{ top: 73, left: 50, width: 190 }}
    >
      <div class="hotspot-content-transparencia">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/mask_mob.png"  alt="Detalhe 2" />
        <div></div>
      </div>
    </Hotspot>
    <Hotspot
      triggerPoint={1600}
      duration={2000}
      desktop={{ top: 30, left: 22, width: 23 }}
      mobile={{ top: 53, left: 40, width: 80 }}
    >
      <div class="hotspot-content2">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/topo.png"  alt="Detalhe 1" />
        <div class=""></div> 
      </div>
    </Hotspot>

    <Hotspot
      triggerPoint={2000}
      duration={500}
      desktop={{ top: 40, left: 50, width: 40 }}
      mobile={{ top: 28, left: 60, width: 80 }}
    >
      <div class="hotspot-content">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/3andar01.jpg" alt="Detalhe 1" />
        <div class="pin"></div> 
      </div>
    </Hotspot>

    <Hotspot
      triggerPoint={2700}
      duration={500}
      desktop={{ top: 40, left: 60, width: 40 }}
      mobile={{ top: 28, left: 40, width: 80 }}
    >
      <div class="hotspot-content">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/3andar02.jpg" alt="Detalhe 2" />
        <div class="pin"></div>
      </div>
    </Hotspot>
    <Hotspot
      triggerPoint={3400}
      duration={500}
      desktop={{ top: 40, left: 55, width: 40 }}
      mobile={{ top: 28, left: 50, width: 80 }}
    >
      <div class="hotspot-content">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/3andar03.jpg" alt="Detalhe 2" />
        <div class="pin"></div>
      </div>
    </Hotspot>



   <Hotspot
      triggerPoint={3600}
      duration={2400}
      desktop={{ top: 0, left: 50, width: 100, height: 85}}
      mobile={{ top: 30, left: 50, width: 1000, height: 20}}
    >
      <div class="hotspot-content-transparencia">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/mask_mob.png"  alt="Detalhe 2" />
        <div></div>
      </div>
    </Hotspot>
   <Hotspot
      triggerPoint={3600}
      duration={2400}
      desktop={{ top: 84, left: 50, width: 100, height: 28}}
      mobile={{ top: 94, left: 50, width: 100, height: 65 }}
    >
      <div class="hotspot-content-transparencia">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/mask_mob.png"  alt="Detalhe 2" />
        <div></div>
      </div>
    </Hotspot>

    <Hotspot
      triggerPoint={3600}
      duration={2500}
      desktop={{ top: 55, left: 78, width: 23 }}
      mobile={{ top: 72, left: 60, width: 80 }}
    >
      <div class="hotspot-content2">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/meio.png"  alt="Detalhe 1" />
        <div class=""></div> 
      </div>
    </Hotspot>

    <Hotspot
      triggerPoint={4200}
      duration={500}
      desktop={{ top: 40, left: 35, width: 40 }}
      mobile={{ top: 45, left: 40, width: 80 }}
    >
      <div class="hotspot-content">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/2andar01.jpg" alt="Detalhe 1" />
        <div class="pin"></div> 
      </div>
    </Hotspot>

    <Hotspot
      triggerPoint={4700}
      duration={500}
      desktop={{ top: 40, left: 45, width: 40 }}
      mobile={{ top: 45, left: 50, width: 80 }}
    >
      <div class="hotspot-content">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/2andar02.jpg" alt="Detalhe 2" />
        <div class="pin"></div>
      </div>
    </Hotspot>
    <Hotspot
      triggerPoint={5400}
      duration={500}
      desktop={{ top: 40, left: 50, width: 40 }}
      mobile={{ top: 45, left: 60, width: 80 }}
    >
      <div class="hotspot-content">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/2andar03.jpg" alt="Detalhe 2" />
        <div class="pin"></div>
      </div>
    </Hotspot>
    <Hotspot
      triggerPoint={6100}
      duration={2500}
      desktop={{ top: 0, left: 50, width: 120, height: 135 }}
      mobile={{ top: 42, left: 50, width: 120 }}
    >
      <div class="hotspot-content-transparencia">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/mask_mob.png"  alt="Detalhe 2" />
        <div ></div>
      </div>
    </Hotspot>
    <Hotspot
      triggerPoint={6100}
      duration={2500}
      desktop={{ top: 80, left: 15, width: 23 }}
      mobile={{ top: 50, left: 40, width: 80 }}
    >
      <div class="hotspot-content2">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/porao.png"  alt="Detalhe 1" />
        <div class=""></div> 
      </div>
    </Hotspot>
    <Hotspot
      triggerPoint={6300}
      duration={500}
      desktop={{ top: 68, left: 39, width: 40 }}
      mobile={{ top: 75, left: 40, width: 80 }}
    >
      <div class="hotspot-content">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/1andar01.jpg" alt="Detalhe 1" />
        <div class="pin"></div> 
      </div>
    </Hotspot>

    <Hotspot
      triggerPoint={7000}
      duration={500}
      desktop={{ top: 65, left: 55, width: 40 }}
      mobile={{ top: 75, left: 50, width: 80 }}
    >
      <div class="hotspot-content">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/1andar02.jpg" alt="Detalhe 2" />
        <div class="pin"></div>
      </div>
    </Hotspot>
    <Hotspot
      triggerPoint={7700}
      duration={400}
      desktop={{ top: 65, left: 45, width: 40 }}
      mobile={{ top: 75, left: 40, width: 80 }}
    >
      <div class="hotspot-content">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/1andar03.jpg" alt="Detalhe 2" />
        <div class="pin"></div>
      </div>
    </Hotspot>
    <Hotspot
      triggerPoint={0}
      duration={10000}
      desktop={{ top: 10, left: 50, width: 35 }}
      mobile={{ top: 10, left: 50, width: 80 }}
    >
      <div class="hotspot-content-transparencia">
        <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/cenario.png" alt="Detalhe 2" />
        <div class=""></div>
      </div>
    </Hotspot>

    </InteractiveScroll>
{/if}

  <Ancora id="dinamica" />

<DinamicadoReality />

<Ancora id="mentores" />
<HorizontalReveal 
  id="mentores"  title="Conheça Nossos Mentores"
  characters={myCharacters}
/>

  <Ancora id="participantes" />

<Section fundo="#0c0b1e" padding="10rem 0">
<GaleriaCan />
</Section>



<Section
  id="creditos"
  className="section-destaque animar"
  fundo="#0c0b1e"
  largura="100vw"
  
  alturaDesktop="120vh"
  padding="0"
  margin="0"
>

<Titulo
  className="section-destaque animar"
  texto="CRÉDITOS"
  cor="#d1263d"
  tamanhoDesk="3.2rem"
  tamanhoMob="2rem"
  espacamento="1rem"
  svgEsquerda=""
  svgDireita=""
/>

<Creditos
  corFundo="#0c0b1e"
  corTextoGeral="#232323"
  corFuncao="#d1263d"
  corNome="#fff"
  tamanhoFuncaoDesk="1.3rem"
  tamanhoNomeDesk="2.2rem"
  lineHeightFuncaoDesk="1.1"
  lineHeightNomeDesk="1.2"
  tamanhoFuncaoMob="1rem"
  tamanhoNomeMob="1.5rem"
  lineHeightFuncaoMob="1.18"
  lineHeightNomeMob="1.19"
  alinhamento="left"
  espacamentoItens="2rem"
  creditos={[
    { funcao: "Conteúdo", nome: "Patricia Farias" },
    { funcao: "Design", nome: "Guilherme Gomes, Juan Silva, Gabs e Kayan Albertin" },
    { funcao: "Dev", nome: "Guilherme Gomes" },
    { funcao: "Analista de produtos", nome: "Lucas Pappacena" },
    { funcao: "Coordenação", nome: "Patricia Farias (produtos) e Guilherme Gomes (design e desenvolvimento)" },
    { funcao: "", nome: "" }
    
  ]}
/>
</Section>


