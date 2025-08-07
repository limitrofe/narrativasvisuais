<script>
  export let texto = "Título padrão";

  // Largura geral
  export let largura = "60%";

  // Título: cores, peso, tamanho e line-height
  export let cor = "var(--cor-preta)";
  export let peso = "700";
  export let tamanhoDesktop = "2.5rem";
  export let tamanhoMobile = "1.75rem";
  export let lineHeightDesktop = "1.3";
  export let lineHeightMobile = "1.2";

  // Linha fina (subtítulo)
  export let linhaFina = "";
  export let corLinhaFina = "var(--cor-preta)";
  export let pesoLinhaFina = "400";
  export let tamanhoLinhaFinaDesktop = "1.25rem";
  export let tamanhoLinhaFinaMobile = "1rem";
  export let lineHeightLinhaFinaDesktop = "1.3";
  export let lineHeightLinhaFinaMobile = "1.2";
  export let margemLinhaFina = "0.75rem";

  // Linha decorativa (gráfica)
  export let exibirLinha = true;
  export let larguraLinha = "60px";
  export let alturaLinha = "4px";
  export let corLinha = "var(--cor-vermelha)";
  export let margemLinha = "0.75rem";

  // Alinhamento
  export let alinhamento = "left"; // opções: left | center | right
  export let vertical = "top";     // opções: top | center | bottom

  // Novo: Cor de fundo
  export let fundo = "transparent";
</script>

<div
  class="story-titulo"
  style="
    background-color: {fundo};
    --largura-desktop: {largura};
    --tamanho-desktop: {tamanhoDesktop};
    --tamanho-mobile: {tamanhoMobile};
    --lh-desktop: {lineHeightDesktop};
    --lh-mobile: {lineHeightMobile};
    --tamanho-linha-fina-desktop: {tamanhoLinhaFinaDesktop};
    --tamanho-linha-fina-mobile: {tamanhoLinhaFinaMobile};
    --lh-linha-fina-desktop: {lineHeightLinhaFinaDesktop};
    --lh-linha-fina-mobile: {lineHeightLinhaFinaMobile};

    text-align: {alinhamento};
    justify-content: {vertical === 'top' ? 'flex-start' : vertical === 'center' ? 'center' : 'flex-end'};
    align-items: {alinhamento === 'left' ? 'flex-start' : alinhamento === 'center' ? 'center' : 'flex-end'};
  "
>
  {#if exibirLinha}
    <div
      class="linha"
      style="
        width: {larguraLinha};
        height: {alturaLinha};
        background-color: {corLinha};
        margin-bottom: {margemLinha};
      "
    ></div>
  {/if}

  <div
    class="texto"
    style="color: {cor}; font-weight: {peso};"
  >
    {texto}
  </div>

  {#if linhaFina}
    <div
      class="linha-fina"
      style="
        color: {corLinhaFina};
        font-weight: {pesoLinhaFina};
        margin-top: {margemLinhaFina};
      "
    >
      {linhaFina}
    </div>
  {/if}
</div>

<style>
  .story-titulo {
    margin: 4rem auto 2rem auto;
    display: flex;
    flex-direction: column;
    width: 90%;
    text-wrap: balance;
  }

  @media (min-width: 768px) {
    .story-titulo {
      width: var(--largura-desktop);
    }
  }

  .story-titulo .texto {
    font-family: var(--fonte-primaria);
    font-size: var(--tamanho-mobile);
    line-height: var(--lh-mobile);
    text-wrap: balance;
  }

  @media (min-width: 768px) {
    .story-titulo .texto {
      font-size: var(--tamanho-desktop);
      line-height: var(--lh-desktop);
    }
  }

  .story-titulo .linha-fina {
    font-family: var(--fonte-primaria);
    font-size: var(--tamanho-linha-fina-mobile);
    line-height: var(--lh-linha-fina-mobile);
    text-wrap: balance;
  }

  @media (min-width: 768px) {
    .story-titulo .linha-fina {
      font-size: var(--tamanho-linha-fina-desktop);
      line-height: var(--lh-linha-fina-desktop);
    }
  }
</style>
