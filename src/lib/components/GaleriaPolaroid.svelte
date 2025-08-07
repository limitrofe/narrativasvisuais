<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  // Props para receber o conteúdo de cada seção
  export let titulo = "";
  export let texto = "";
  export let images = [];

  let container; // O container principal que ficará "sticky"

  onMount(() => {
    // É crucial registrar o plugin
    gsap.registerPlugin(ScrollTrigger);

    // --- SELEÇÃO DOS ELEMENTOS ---
    // Seleciona os elementos que vamos animar dentro deste componente
    const tituloWrapperEl = container.querySelector('.titulo-wrapper');
    const polaroidWrappers = container.querySelectorAll('.polaroid-wrapper');

    // --- ESTADO INICIAL (ANTES DA ANIMAÇÃO) ---
    // Deixamos o texto invisível e um pouco para baixo
    gsap.set(tituloWrapperEl, { opacity: 0, y: 50 });
    // Deixamos TODAS as polaroids invisíveis e mais para baixo ainda
    gsap.set(polaroidWrappers, { opacity: 0, y: 150 });


    // --- CRIAÇÃO DA TIMELINE DE ANIMAÇÃO ---
    // Esta timeline controla a sequência de animações DENTRO desta seção,
    // enquanto ela estiver "grudada" na tela.
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        scrub: 1, // Suaviza a animação com o scroll
        start: 'top top', // Inicia quando o topo do container gruda no topo da tela
        end: '+=2500', // A animação dura o equivalente a 2500px de scroll
      },
    });

    // --- CONSTRUÇÃO DA SEQUÊNCIA DE ANIMAÇÃO ---
    // Adicionamos as animações à timeline na ordem exata que queremos.
    timeline
      // 1. ANIMAÇÃO DO TEXTO: O texto sobe e aparece.
      .to(tituloWrapperEl, {
        opacity: 1,
        y: 0,
        duration: 2, // Duração relativa dentro do scroll
      })

      // 2. ANIMAÇÃO DAS FOTOS (UMA POR VEZ): As fotos sobem e aparecem.
      .to(polaroidWrappers, {
        opacity: 1,
        y: 0,
        rotation: () => Math.random() * 10 - 5, // Dá uma rotação aleatória para cada foto
        // A MÁGICA ESTÁ AQUI: `stagger: 1` cria um intervalo entre a animação
        // de cada foto, garantindo que elas venham uma de cada vez.
        stagger: 1,
        duration: 1.5, // Duração de cada foto individualmente
      }, ">-1") // O "-=1" faz essa animação começar um pouco antes da anterior terminar, para fluidez.

      // 3. FIM DA ANIMAÇÃO: Deixa um tempo com tudo na tela.
      // Adicionamos um tempo "vazio" no final para que o conteúdo não
      // desapareça bruscamente ao final do scroll.
      .to({}, { duration: 2 });


    // --- LIMPEZA ---
    // Garante que a animação seja destruída quando o componente sair da tela
    return () => {
      timeline.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  });
</script>

<div class="polaroid-secao-container" bind:this={container}>
  <div class="conteudo-wrapper">
    <div class="titulo-wrapper">
      <h2 class="titulo" svelte-html={titulo}></h2>
      <p class="texto" svelte-html={texto}></p>
    </div>

    <div class="polaroid-stack">
      {#each images as image}
        <div class="polaroid-wrapper">
          <div class="polaroid-frame">
            <img src={image.src} alt={image.alt} />
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  /* O container de cada seção. Ficará sticky. */
  .polaroid-secao-container {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  /* Um wrapper para o conteúdo, para facilitar o layout */
  .conteudo-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5vw;
    padding: 2rem;
  }

  /* --- Área do Texto --- */
  .titulo-wrapper {
    flex: 1;
    color: #fff;
    max-width: 50ch;
  }
  .titulo {
    font-size: 2rem;
    line-height: 1.1;
    margin: 0;
  }
  .titulo :global(.sub-titulo) {
    font-size: 3.5rem;
    font-weight: bold;
    display: block;
    line-height: 1;
    margin: 0.5rem 0;
  }
  .texto {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-top: 1rem;
    opacity: 0.9;
  }

  /* --- Área das Fotos --- */
  .polaroid-stack {
    flex: 1;
    position: relative;
    height: 50vh; /* Altura da área das fotos */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .polaroid-wrapper {
    position: absolute;
    width: 100%;
    max-width: 400px;
  }

  .polaroid-frame {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 15px 15px 70px 15px;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.4);
  }

  .polaroid-frame img {
    width: 100%;
    height: auto;
    display: block;
  }
  
  /* --- Layout Mobile --- */
  @media (max-width: 800px) {
    .conteudo-wrapper {
      flex-direction: column;
      gap: 1rem;
      justify-content: flex-start;
      padding-top: 10vh;
    }
    .titulo-wrapper {
      text-align: center;
    }
    .polaroid-stack {
      height: 60vh;
    }
  }
</style>