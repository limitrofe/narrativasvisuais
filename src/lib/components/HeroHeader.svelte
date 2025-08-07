<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  export let titulo = "";
  export let linhaFina = "";
  export let bgImageDesk = "";
  export let bgImageMob = "";
  export let videoDesk = "";
  export let videoMob = "";
  export let posterDesk = "";
  export let posterMob = "";
  export let autoplay = true;
  export let muted = true;
  export let loop = true;

  export let modo = "natural"; // "hero" = 100vh | "natural" = altura real

  export let posicaoVerticalDesk = "center";
  export let posicaoHorizontalDesk = "center";
  export let posicaoVerticalMob = "center";
  export let posicaoHorizontalMob = "center";

  export let alinhamentoTextoDesk = "center";
  export let alinhamentoTextoMob = "center";

  export let corTitulo = "white";
  export let corLinhaFina = "white";

  export let tamanhoTituloDesk = "3rem";
  export let tamanhoTituloMob = "2rem";
  export let tamanhoLinhaFinaDesk = "1.5rem";
  export let tamanhoLinhaFinaMob = "1.2rem";

  export let alturaLinhaTituloDesk = "1.2";
  export let alturaLinhaTituloMob = "1.3";
  export let alturaLinhaLinhaFinaDesk = "1.4";
  export let alturaLinhaLinhaFinaMob = "1.5";

  export let pesoTituloDesk = "700";
  export let pesoTituloMob = "700";
  export let pesoLinhaFinaDesk = "400";
  export let pesoLinhaFinaMob = "400";

  let textWrapper;
  let heroSection;

  function ajustarAltura() {
    if (modo !== "natural") return;

    requestAnimationFrame(() => {
      const bg = heroSection.querySelector('.bg-image, .bg-video');
      if (bg) {
        if (bg.videoHeight) {
          heroSection.style.height = `${bg.videoHeight * (heroSection.offsetWidth / bg.videoWidth)}px`;
        } else if (bg.naturalHeight) {
          heroSection.style.height = `${bg.naturalHeight * (heroSection.offsetWidth / bg.naturalWidth)}px`;
        }
      }
    });
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    ajustarAltura(); // Mede antes de animar

    gsap.from(textWrapper, {
      scrollTrigger: {
        trigger: textWrapper,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power2.out"
    });
  });
</script>

<section class="hero-header {modo}" bind:this={heroSection}>
  {#if videoDesk}
    <video
      class="bg-video"
      autoplay={autoplay}
      muted={muted}
      loop={loop}
      playsinline
      poster={posterDesk}
      preload="auto"
      onloadedmetadata={ajustarAltura}
    >
      <source src={videoDesk} media="(min-width: 769px)" type="video/mp4" />
      <source src={videoMob} media="(max-width: 768px)" type="video/mp4" />
    </video>
  {:else}
    <picture>
      {#if bgImageMob}
        <source srcset={bgImageMob} media="(max-width: 768px)" />
      {/if}
      <img
        class="bg-image"
        src={bgImageDesk}
        alt=""
        onload={ajustarAltura}      
        loading="eager"
        fetchpriority="high"
      />
    </picture>
  {/if}

  <div
    bind:this={textWrapper}
    class="text-wrapper pos-{posicaoVerticalDesk}-{posicaoHorizontalDesk} mob-pos-{posicaoVerticalMob}-{posicaoHorizontalMob}"
    style="
      --cor-titulo: {corTitulo};
      --cor-linha: {corLinhaFina};
      --size-titulo-desk: {tamanhoTituloDesk};
      --size-titulo-mob: {tamanhoTituloMob};
      --size-linha-desk: {tamanhoLinhaFinaDesk};
      --size-linha-mob: {tamanhoLinhaFinaMob};
      --lh-titulo-desk: {alturaLinhaTituloDesk};
      --lh-titulo-mob: {alturaLinhaTituloMob};
      --lh-linha-desk: {alturaLinhaLinhaFinaDesk};
      --lh-linha-mob: {alturaLinhaLinhaFinaMob};
      --peso-titulo-desk: {pesoTituloDesk};
      --peso-titulo-mob: {pesoTituloMob};
      --peso-linha-desk: {pesoLinhaFinaDesk};
      --peso-linha-mob: {pesoLinhaFinaMob};
      --alinhamento-desk: {alinhamentoTextoDesk};
      --alinhamento-mob: {alinhamentoTextoMob};
    "
  >
    {#if titulo}<h1>{titulo}</h1>{/if}
    {#if linhaFina}<p class="linha-fina">{linhaFina}</p>{/if}
  </div>
</section>

<style>
.hero-header {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.hero-header.hero {
  height: 100vh;
}

.hero-header.natural {
  height: auto;
  min-height: 60vh; /* evita travar antes do carregamento */
}

.bg-image,
.bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}

.text-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 1;
  padding: 0;
}

/* Posições Desktop */
.pos-top-left { justify-content: flex-start; align-items: flex-start; text-align: left; }
.pos-top-center { justify-content: flex-start; align-items: center; text-align: center; }
.pos-top-right { justify-content: flex-start; align-items: flex-end; text-align: right; }

.pos-center-left { justify-content: center; align-items: flex-start; text-align: left; }
.pos-center-center { justify-content: center; align-items: center; text-align: center; }
.pos-center-right { justify-content: center; align-items: flex-end; text-align: right; }

.pos-bottom-left { justify-content: flex-end; align-items: flex-start; text-align: left; }
.pos-bottom-center { justify-content: flex-end; align-items: center; text-align: center; }
.pos-bottom-right { justify-content: flex-end; align-items: flex-end; text-align: right; }

/* Posições Mobile */
@media (max-width: 768px) {
  .mob-pos-top-left { justify-content: flex-start; align-items: flex-start; text-align: left; }
  .mob-pos-top-center { justify-content: flex-start; align-items: center; text-align: center; }
  .mob-pos-top-right { justify-content: flex-start; align-items: flex-end; text-align: right; }

  .mob-pos-center-left { justify-content: center; align-items: flex-start; text-align: left; }
  .mob-pos-center-center { justify-content: center; align-items: center; text-align: center; }
  .mob-pos-center-right { justify-content: center; align-items: flex-end; text-align: right; }

  .mob-pos-bottom-left { justify-content: flex-end; align-items: flex-start; text-align: left; }
  .mob-pos-bottom-center { justify-content: flex-end; align-items: center; text-align: center; }
  .mob-pos-bottom-right { justify-content: flex-end; align-items: flex-end; text-align: right; }
}

/* Tipografia */
h1 {
  margin: 0;
  font-size: var(--size-titulo-desk);
  line-height: var(--lh-titulo-desk);
  color: var(--cor-titulo);
  font-weight: var(--peso-titulo-desk);
  text-align: var(--alinhamento-desk);
}

.linha-fina {
  margin-top: 0.5rem;
  font-size: var(--size-linha-desk);
  line-height: var(--lh-linha-desk);
  color: var(--cor-linha);
  font-weight: var(--peso-linha-desk);
  text-align: var(--alinhamento-desk);
}

/* Mobile */
@media (max-width: 768px) {
  h1 {
    font-size: var(--size-titulo-mob);
    line-height: var(--lh-titulo-mob);
    font-weight: var(--peso-titulo-mob);
    text-align: var(--alinhamento-mob);
  }

  .linha-fina {
    font-size: var(--size-linha-mob);
    line-height: var(--lh-linha-mob);
    font-weight: var(--peso-linha-mob);
    text-align: var(--alinhamento-mob);
  }
}
</style>
