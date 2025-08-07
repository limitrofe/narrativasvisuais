<script>
  import { onMount } from "svelte";
  export let srcDesk = '';
  export let srcMob = '';
  export let alt = '';
  export let xDesk = "0px";
  export let yDesk = "0px";
  export let xMob = "0px";
  export let yMob = "0px";
  export let widthDesk = "300px";
  export let heightDesk = "auto";
  export let widthMob = "120px";
  export let heightMob = "auto";
  export let zIndex = 1; // se quiser controlar a ordem

  let isMobile = false;
  let left, top, width, height;

  function updateResponsiveValues() {
    isMobile = window.matchMedia("(max-width: 900px)").matches;
    left = isMobile ? xMob : xDesk;
    top = isMobile ? yMob : yDesk;
    width = isMobile ? widthMob : widthDesk;
    height = isMobile ? heightMob : heightDesk;
  }

  onMount(() => {
    updateResponsiveValues();
    window.addEventListener("resize", updateResponsiveValues);
    return () => window.removeEventListener("resize", updateResponsiveValues);
  });
</script>

<div
  class="imagem-decorativa"
  style="
    position: absolute;
    left: {left};
    top: {top};
    width: {width};
    height: {height};
    z-index: {zIndex};
    pointer-events: none;
    user-select: none;
  "
>
  <picture>
    <source srcset={srcMob} media="(max-width: 900px)" />
    <source srcset={srcDesk} media="(min-width: 901px)" />
    <img src={srcDesk} alt={alt} style="width: 100%; height: 100%; display: block; object-fit: contain;" draggable="false" />
  </picture>
</div>

<style>
  .imagem-decorativa {
    /* não define width nem height fixos aqui, só no style inline */
    display: block;
  }
</style>
