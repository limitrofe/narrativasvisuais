<script>
  import { fade } from 'svelte/transition';

  export let texto = ""; // texto em HTML
  export let largura = "60%"; // largura no desktop
  export let larguraMob = "90%"; // NOVO: largura mobile
  export let alinhamento = "left"; // left | center | right
  export let animar = false;
  export let tamanhoFonte = "1.2rem";
  export let entrelinha = "1.7";
  export let fundo = "transparent";
  export let cor = "var(--cor-preta)";

  // --- NOVAS PROPS DE ESPAÇAMENTO ---
  export let marginTopMob = "3rem";
  export let marginBottomMob = "3rem";
  export let paddingMob = "0"; // Pode ser "1rem", "1rem 2rem", etc.

  export let marginTopDesk = "3rem";
  export let marginBottomDesk = "3rem";
  export let paddingDesk = "0"; // Pode ser "1rem", "1rem 2rem", etc.
  // --- FIM DAS NOVAS PROPS ---
</script>

<style>
  .texto-longo {
    font-family: var(--fonte-primaria);
    color: var(--cor-preta);
    white-space: pre-line;
    text-wrap: balance;
    font-size: var(--tamanho-fonte, 1.2rem);
    line-height: var(--entrelinha, 1.7);
    width: var(--largura-mobile, 90%); /* <-- aqui! */

    margin-left: auto;
    margin-right: auto;
    margin-top: var(--margin-top-mob);
    margin-bottom: var(--margin-bottom-mob);
    padding: var(--padding-mob);
  }

  @media (min-width: 768px) {
    .texto-longo {
      width: var(--largura-desktop, 60%); /* <-- aqui! */
      margin-top: var(--margin-top-desk);
      margin-bottom: var(--margin-bottom-desk);
      padding: var(--padding-desk);
    }
  }

  .texto-longo :global(p) {
    margin-bottom: 0rem;
    text-wrap: balance;
  }
  .texto-longo :global(b),
  .texto-longo :global(strong) {
    font-weight: bold;
  }
  .texto-longo :global(i),
  .texto-longo :global(em) {
    font-style: italic;
  }
  .texto-longo :global(u) {
    text-decoration: underline;
  }
  .texto-longo :global(a) {
    color: var(--cor-link, blue);
    text-decoration: underline;
  }
</style>

{#if animar}
  <div
    class="texto-longo"
    style="
      --largura-desktop: {largura};
      --largura-mobile: {larguraMob};
      --tamanho-fonte: {tamanhoFonte};
      --entrelinha: {entrelinha};
      text-align: {alinhamento};
      background-color: {fundo};
      color: {cor};
      --margin-top-mob: {marginTopMob};
      --margin-bottom-mob: {marginBottomMob};
      --padding-mob: {paddingMob};
      --margin-top-desk: {marginTopDesk};
      --margin-bottom-desk: {marginBottomDesk};
      --padding-desk: {paddingDesk};
    "
    in:fade={{ duration: 500 }}
  >
    {@html texto}
  </div>
{:else}
  <div
    class="texto-longo"
    style="
      --largura-desktop: {largura};
      --largura-mobile: {larguraMob};
      --tamanho-fonte: {tamanhoFonte};
      --entrelinha: {entrelinha};
      text-align: {alinhamento};
      background-color: {fundo};
      color: {cor};
      --margin-top-mob: {marginTopMob};
      --margin-bottom-mob: {marginBottomMob};
      --padding-mob: {paddingMob};
      --margin-top-desk: {marginTopDesk};
      --margin-bottom-desk: {marginBottomDesk};
      --padding-desk: {paddingDesk};
    "
  >
    {@html texto}
  </div>
{/if}
