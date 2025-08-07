<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  export let numero = "1";
  export let texto = "Texto exemplo.";
  export let alinhamento = "left"; // alinha o bloco (left | center | right)
  export let alinhamentoTexto = "right"; // alinha o conteúdo interno

  export let tamanhoNumeroDesk = '6rem';
  export let tamanhoNumeroMob = '6.7rem';
  export let tamanhoTextoDesk = '1.25rem';
  export let tamanhoTextoMob = '1rem';

  export let animacao = {
    desk: false,
    mob: false
  };

  let bloco;
  let conteudo;
  let isMobile = false;
  let fontNumero = tamanhoNumeroDesk;
  let fontTexto = tamanhoTextoDesk;

  onMount(() => {
    if (typeof window !== 'undefined') {
      isMobile = window.innerWidth < 768;
      fontNumero = isMobile ? tamanhoNumeroMob : tamanhoNumeroDesk;
      fontTexto = isMobile ? tamanhoTextoMob : tamanhoTextoDesk;

      const anim = isMobile ? animacao.mob : animacao.desk;

      if (anim) {
        gsap.registerPlugin(ScrollTrigger);

        const from = anim.from || { opacity: 0, y: 60 };
        const to = anim.to || { opacity: 1, y: 0, duration: 1, ease: 'power2.out' };
        const start = anim.start || 'top 85%';

        gsap.fromTo(conteudo, from, {
          ...to,
          scrollTrigger: {
            trigger: bloco,
            start,
            toggleActions: 'play none none reverse',
            markers: false
          }
        });
      }
    }
  });
</script>

<div class="bloco-numerado {alinhamento}" bind:this={bloco}>
  <div class="conteudo-animado" bind:this={conteudo}>
    <div
      class="numero"
      style="font-size: {fontNumero}; text-align: {alinhamentoTexto};"
    >{numero}</div>
    <div
      class="texto"
      style="font-size: {fontTexto}; text-align: {alinhamentoTexto};"
    >{texto}</div>
  </div>
</div>

<style>
  .bloco-numerado {
    position: relative;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    overflow-y: visible;
    box-sizing: border-box;
    margin: 2rem 0;
    padding-left: 16px;
    padding-right: 20%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .bloco-numerado.left {
    justify-content: flex-start;
  }

  .bloco-numerado.center {
    justify-content: center;
  }

  .bloco-numerado.right {
    justify-content: flex-end;
  }

  .conteudo-animado {
    width: 100%;
    max-width: 60vw;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    will-change: transform;
  }

  .numero {
    width: 30%;
    font-family: var(--fonte-primaria);
    font-weight: 700;
    line-height: 1;
    color: var(--cor-preta);
    flex-shrink: 0;
  }

  .texto {
    width: 60%;
    font-family: var(--fonte-primaria);
    line-height: 1.6;
    color: var(--cor-preta);
    margin: 0;
  }

  @media (max-width: 768px) {
    .conteudo-animado {
    flex-direction: column;
    align-items: flex-start;
    max-width: 90vw;
    gap: 0.5rem;
  }

  .numero {
    width: 100%;
    margin-right: 0;
  }

  .texto {
    width: 100%;
  }
}


</style>
