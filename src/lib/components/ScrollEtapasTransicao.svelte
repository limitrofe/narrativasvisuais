<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  export let grupos = [];

  let container;
  let imagemAtual = grupos[0]?.imagem;
  let imagemEl;

  function preloadImagens() {
    grupos.forEach(grupo => {
      const img = new Image();
      img.src = grupo.imagem;
    });
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    preloadImagens();

    let indexGlobal = 0;
    const totalBlocos = grupos.reduce((acc, g) => acc + g.textos.length, 0);
    const ultimoId = `#bloco-${totalBlocos - 1}`;

    // Aparecer quando entrar na área
    ScrollTrigger.create({
      trigger: "#scroll-transicao",
      start: "top top",
      end: "bottom bottom",
      onEnter: () => {
        imagemEl.style.backgroundImage = `url(${imagemAtual})`;
        gsap.set(imagemEl, { display: 'block' });
        gsap.to(imagemEl, { opacity: 1, duration: 0.3 });
      },
      onLeave: () => {
        gsap.to(imagemEl, { opacity: 0, duration: 0.3 });
      },
      onEnterBack: () => {
        imagemEl.style.backgroundImage = `url(${imagemAtual})`;
        gsap.set(imagemEl, { display: 'block' });
        gsap.to(imagemEl, { opacity: 1, duration: 0.3 });
      },
      onLeaveBack: () => {
        gsap.to(imagemEl, { opacity: 0, duration: 0.3 });
      }
    });

    // Troca de imagens ao chegar em blocos
    grupos.forEach((grupo, grupoIndex) => {
      grupo.textos.forEach((_, blocoIndex) => {
        const indexTotal = indexGlobal;
        ScrollTrigger.create({
          trigger: `#bloco-${indexTotal}`,
          start: "top center",
          end: "bottom center",
          scrub: true,
          onEnter: () => {
            const novaImagem = grupos.find((_, gIndex) => {
              const totalAnterior = grupos.slice(0, gIndex).reduce((acc, g) => acc + g.textos.length, 0);
              return indexTotal >= totalAnterior && indexTotal < totalAnterior + grupos[gIndex].textos.length;
            })?.imagem;

            if (novaImagem && novaImagem !== imagemAtual) {
              imagemAtual = novaImagem;
              imagemEl.style.backgroundImage = `url(${imagemAtual})`;
              gsap.fromTo(imagemEl, { opacity: 0 }, { opacity: 1, duration: 0.4 });
            }
          }
        });
        indexGlobal++;
      });
    });

    // Quando o último bloco termina
    ScrollTrigger.create({
      trigger: ultimoId,
      start: "center center",
      end: "bottom top",
      onLeave: () => {
        gsap.to(imagemEl, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => gsap.set(imagemEl, { display: 'none' })
        });
      }
    });
  });
</script>

<div class="transicao-container" id="scroll-transicao" bind:this={container}>
  <div class="imagem-transicao" bind:this={imagemEl}></div>

  <div class="scroll-blocos">
    {#each grupos as grupo, grupoIndex}
      {#each grupo.textos as texto, blocoIndex}
        <section
          class="bloco"
          id={"bloco-" + (grupos.slice(0, grupoIndex).reduce((acc, g) => acc + g.textos.length, 0) + blocoIndex)}
        >
          <div class="texto-box">{@html texto}</div>
        </section>
      {/each}
    {/each}
    <section class="bloco-fantasma"></section>
  </div>
</div>

<style>
  .transicao-container {
    position: relative;
    width: 100vw;
    height: auto;
    overflow: visible;
  }

  .imagem-transicao {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-position: center;
    opacity: 0;
    z-index: 1;
    display: none;
    pointer-events: none;
  }

  .scroll-blocos {
    position: relative;
    z-index: 10;
  }

  .bloco {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .texto-box {
    max-width: 60%;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 2rem;
    border-radius: 8px;
    font-size: 1.8rem;
    text-align: center;
    transition: transform 0.3s ease-out;
  }

  .bloco-fantasma {
    height: 60vh;
    background: transparent;
  }

  @media (max-width: 768px) {
    .texto-box {
      max-width: 90%;
      font-size: 1.2rem;
    }
  }
</style>
