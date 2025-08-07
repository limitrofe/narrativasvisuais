<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  export let topDesk = 0;
  export let leftDesk = 0;
  export let topMob = 0;
  export let leftMob = 0;
  export let fontSizeDesk = '1rem';
  export let fontSizeMob = '0.9rem';
  export let widthDesk = '200px';
  export let widthMob = '180px';
  export let alignDesk = 'left';
  export let alignMob = 'left';

  let visible = false;
  let el; // O elemento wrapper que será observado

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Se o elemento estiver intersectando a viewport, torna-o visível
        if (entry.isIntersecting) {
          visible = true;
          // Desconecta o observador depois que a animação é acionada uma vez
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.1 // Aciona quando 10% do elemento está visível
      }
    );

    // Inicia a observação no elemento wrapper
    if (el) {
      observer.observe(el);
    }
    
    // Limpeza: desconecta o observador quando o componente é destruído
    return () => {
      if(el) observer.unobserve(el);
    };
  });
</script>

<style>
  .wrapper {
    position: absolute;
    z-index: 2;
  }

  .caixa {
    background: #c4170c;
    color: white;
    padding: 1rem;
    border-radius: 10px;
    line-height: 1.3;
    width: 100%;
    height: 100%;
  }

  /* As variáveis CSS são aplicadas ao wrapper, que define a posição e o tamanho */
  @media (max-width: 768px) {
    .wrapper {
      font-size: var(--font-size-mob);
      width: var(--width-mob);
      text-align: var(--align-mob);
      top: var(--top-mob);
      left: var(--left-mob);
    }
  }

  @media (min-width: 769px) {
    .wrapper {
      font-size: var(--font-size-desk);
      width: var(--width-desk);
      text-align: var(--align-desk);
      top: var(--top-desk);
      left: var(--left-desk);
    }
  }
</style>

<div
  bind:this={el}
  class="wrapper"
  style="
    --top-desk: {topDesk}%;
    --left-desk: {leftDesk}%;
    --font-size-desk: {fontSizeDesk};
    --width-desk: {widthDesk};
    --align-desk: {alignDesk};
    --top-mob: {topMob}%;
    --left-mob: {leftMob}%;
    --font-size-mob: {fontSizeMob};
    --width-mob: {widthMob};
    --align-mob: {alignMob};
  "
>
  {#if visible}
    <div class="caixa" in:fly={{ y: 40, opacity: 0, duration: 500 }}>
      <slot />
    </div>
  {/if}
</div>