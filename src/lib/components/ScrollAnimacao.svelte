<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  export let alturaDesktop = 5000;
  export let alturaMobile = 3000;
  export let animacoesDesktop = [];
  export let animacoesMobile = [];

  let container;
  let isMobile = false;

  onMount(() => {
    if (!gsap.core.globals().ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    isMobile = window.innerWidth < 768;
    const altura = isMobile ? alturaMobile : alturaDesktop;
    const animacoes = isMobile ? animacoesMobile : animacoesDesktop;

    animacoes.forEach(({ alvo, animacao, start }) => {
  const el = document.querySelector(alvo);
  if (!el) return;

  gsap.fromTo(
    el,
    animacao.from,
    {
      ...animacao.to,
      scrollTrigger: {
        trigger: el,
        start: start || 'top 80%', // usa o custom ou um fallback padrão
        toggleActions: 'play none none reverse',
        markers: false
      }
    }
  );
});
  });
</script>

<style>
  .scroll-container {
    position: relative;
    width: 100%;
  }
</style>

<div
  class="scroll-container"
  bind:this={container}
  style="height: {isMobile ? alturaMobile : alturaDesktop}px;"
>
  <slot />
</div>
