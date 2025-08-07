<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  export let animacao = {
    desk: false,
    mob: false
  };

  export let start = 'top 85%';
  export let toggleActions = 'play none none reverse';

  export let alturaDesk = '100vh';
  export let alturaMob = '100vh';

  export let imagem = '';
  export let imagemMob = ''; // NOVO
  export let alt = '';
  export let larguraDesk = '60vw';
  export let larguraMob = '80vw';
  export let estiloExtra = '';

  let bloco;
  let elemento;
  let isMobile = false;
  let altura = alturaDesk;
  let larguraAtual = larguraDesk;
  let imagemAtual = imagem;

  onMount(() => {
    if (typeof window !== 'undefined') {
      isMobile = window.innerWidth < 768;
      altura = isMobile ? alturaMob : alturaDesk;
      larguraAtual = isMobile ? larguraMob : larguraDesk;
      imagemAtual = isMobile && imagemMob ? imagemMob : imagem;

      const anim = isMobile ? animacao.mob : animacao.desk;

      if (anim) {
        gsap.registerPlugin(ScrollTrigger);

        const from = anim.from || { opacity: 0, y: 100 };
        const to = anim.to || { opacity: 1, y: 0, duration: 1, ease: 'power2.out' };

        gsap.fromTo(
          elemento,
          from,
          {
            ...to,
            scrollTrigger: {
              trigger: bloco,
              start,
              toggleActions,
              markers: false
            }
          }
        );
      }
    }
  });
</script>

<style>
  .bloco-visual-animado {
    width: 100vw;
    position: relative;
    overflow: visible;
  }

  .animado {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    will-change: transform;
    z-index: 2;
  }
</style>

<div class="bloco-visual-animado" bind:this={bloco} style="height: auto;">
  <div class="animado" bind:this={elemento}>
    {#if imagemAtual}
      <img src={imagemAtual} alt={alt} style="width: {larguraAtual}; {estiloExtra}" />
    {/if}
  </div>

  <div style="height: {altura}; visibility: hidden;"></div>
</div>
