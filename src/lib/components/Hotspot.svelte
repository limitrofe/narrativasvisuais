<script>
  import { getContext } from 'svelte';

  /** Em qual pixel de scroll este hotspot deve aparecer */
  export let triggerPoint = 0;

  /** Por quantos pixels de scroll ele ficará visível */
  export let duration = 500;

  /**
   * Objeto de posição para Desktop.
   * Ex: { top: 50, left: 50, width: 30, height: 40 (opcional) }
   */
  export let desktop = {};

  /**
   * Objeto de posição para Mobile.
   * Ex: { top: 50, left: 10, width: 80, height: 25 (opcional) }
   */
  export let mobile = {};

  // Pega as informações de scroll e de tamanho da tela que o pai (InteractiveScroll) está fornecendo
  const { scrollY, isMobile } = getContext('interactive-scroll');

  // Lógica de posição atualizada
  $: position = $isMobile ? mobile : desktop;

  // Lógica de visibilidade
  $: isVisible = $scrollY > triggerPoint && $scrollY < (triggerPoint + duration);
</script>

<div
  class="hotspot"
  style="
    top: {position.top ? position.top + '%' : 'auto'};
    bottom: {position.bottom ? position.bottom + '%' : 'auto'};
    left: {position.left ? position.left + '%' : 'auto'};
    width: {position.width ? position.width + '%' : 'auto'};
    height: {position.height ? position.height + '%' : 'auto'};
    transform: {position.bottom ? 'translateX(-50%)' : 'translate(-50%, -50%)'};
    opacity: {isVisible ? 1 : 0};
  "
>
  <slot></slot>
</div>

<style>
  .hotspot {
    position: absolute;
    z-index: 10;
    transition: opacity 0.6s ease-in-out;
    pointer-events: auto;
    overflow: hidden; /* Garante que o conteúdo não transborde */
  }

  .hotspot[style*="opacity: 0;"] {
      pointer-events: none;
  }
</style>