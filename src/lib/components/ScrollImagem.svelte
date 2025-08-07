<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  export let srcDesk = "";
  export let srcMob = "";
  export let alt = "";
  export let legenda = "";
  export let credito = "";
  export let animacao = "fade";
  export let delay = 0;
  export let x = 0;
  export let y = 60;
  export let trigger = null;
  export let largura = "60%";

  let container;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    const alvo = trigger ? document.querySelector(trigger) : container;

    const animacoes = {
      fade: { opacity: 0, delay },
      fly: { x, y, opacity: 0, delay },
      scale: { scale: 0.9, opacity: 0, delay }
    };

    const props = animacoes[animacao] || animacoes.fade;

    gsap.from(container, {
      scrollTrigger: {
        trigger: alvo,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      ...props,
      duration: 0.8,
      ease: "power2.out"
    });
  });
</script>

<div
  class="scroll-imagem"
  bind:this={container}
  style="--largura-desktop: {largura};"
>
  <picture>
    {#if srcMob}
      <source media="(max-width: 768px)" srcset={srcMob} />
    {/if}
    <img src={srcDesk} alt={alt} loading="lazy" />
  </picture>

  {#if legenda || credito}
    <div class="descricao">
      {#if legenda}
        <div class="legenda">{legenda}</div>
      {/if}
      {#if credito}
        <div class="credito">{credito}</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .scroll-imagem {
    text-align: center;
    width: 100%;
    margin: 3rem auto;
  }

  @media (min-width: 768px) {
    .scroll-imagem {
      width: var(--largura-desktop);
    }
  }

  picture img {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }

  .descricao {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.5rem;
    padding-left: 20px;
    padding-right: 20px;
    text-align: left;
  }

  .descricao .legenda {
    margin-bottom: 0.2rem;
  }

  .descricao .credito {
    font-size: 0.75rem;
    color: #999;
  }
</style>