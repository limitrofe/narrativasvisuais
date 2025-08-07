<script>
  export let larguraDesk = "220vw";
  export let larguraMob = "300vw";
  export let alturaDesk = "100vh";
  export let alturaMob = "100vh";

  let isMobile = false;
  let largura, altura;

  function updateResponsiveValues() {
    isMobile = window.matchMedia("(max-width: 900px)").matches;
    largura = isMobile ? larguraMob : larguraDesk;
    altura = isMobile ? alturaMob : alturaDesk;
  }

  // Atualiza no mount e no resize
  import { onMount } from "svelte";
  onMount(() => {
    updateResponsiveValues();
    window.addEventListener("resize", updateResponsiveValues);
    return () => window.removeEventListener("resize", updateResponsiveValues);
  });
</script>

<div style="min-width: {largura}; height: {altura}; position: relative;">
  <slot />
</div>
