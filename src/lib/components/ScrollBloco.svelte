<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  export let texto = "Bloco animado com scroll";
  export let animacao = "fade";
  export let trigger = null;
  export let delay = 0;
  export let x = 0;
  export let y = 60;
  export let palavraPorPalavra = false;
  export let largura = "60%"; // largura desktop

  let bloco;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    const alvo = trigger ? document.querySelector(trigger) : bloco;

    if (palavraPorPalavra) {
      const palavras = bloco.querySelectorAll('span');
      gsap.from(palavras, {
        scrollTrigger: {
          trigger: alvo,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 20,
        stagger: 0.08,
        delay,
        duration: 0.6,
        ease: "power2.out"
      });
      return;
    }

    const animacoes = {
      fade: { opacity: 0, delay },
      fly: { x, y, opacity: 0, delay },
      scale: { scale: 0.8, opacity: 0, delay }
    };

    const props = animacoes[animacao] || animacoes.fade;

    gsap.from(bloco, {
      scrollTrigger: {
        trigger: alvo,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      ...props,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  function splitTexto(texto) {
    return texto.split(' ').map(p => `<span style="display:inline-block;">${p}&nbsp;</span>`).join('');
  }
</script>

<div
  bind:this={bloco}
  class="scroll-bloco"
  style="--largura-desktop: {largura}; text-align: left;"
>
  {@html palavraPorPalavra ? splitTexto(texto) : texto}
</div>

<style>
  .scroll-bloco {
    font-family: var(--fonte-primaria);
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--cor-preta);
    margin: 4rem auto;
    width: 90%; /* padrão mobile */
    max-width: 100%;
    text-wrap: balance;

  }

  @media (min-width: 768px) {
    .scroll-bloco {
      width: var(--largura-desktop);
      text-wrap: balance;

    }
  }
</style>
