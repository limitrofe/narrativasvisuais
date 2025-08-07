<script>
  export let texto = "Título de exemplo";
  export let cor = "#22384b";           // Cor do texto
  export let tamanhoDesk = "2.8rem";    // Tamanho desktop
  export let tamanhoMob = "1.6rem";     // Tamanho mobile
  export let espacamento = "2rem";      // Espaço lateral entre SVG e texto
  export let svgEsquerda = "/img/etamundomelhor/tit_esquerda.svg";
  export let svgDireita  = "/img/etamundomelhor/tit_direita.svg";
</script>

<div class="titulo-wrapper"
  style="
    --cor-titulo: {cor};
    --tamanho-desk: {tamanhoDesk};
    --tamanho-mob: {tamanhoMob};
    --espacamento: {espacamento};
  "
>
  {#if svgEsquerda && svgEsquerda !== 'none'}
    <img class="decor decor-esq" src={svgEsquerda} alt="" aria-hidden="true" draggable="false" />
  {/if}
  
  <h2>{@html texto}</h2>

  {#if svgDireita && svgDireita !== 'none'}
    <img class="decor decor-dir" src={svgDireita} alt="" aria-hidden="true" draggable="false" />
  {/if}
</div>

<style>
  .titulo-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: var(--espacamento, 2rem);
    background: transparent;
    margin-top: 3rem;
  }

  .titulo-wrapper h2 {
    color: var(--cor-titulo, #22384b);
    font-weight: 700;
    font-size: var(--tamanho-desk, 3rem);
    margin: 0;
    line-height: 1.1;
    letter-spacing: 0.05em;
    text-align: center;
    flex-shrink: 0;
  }

  .decor {
    height: 1.5rem;
    width: auto;
    user-select: none;
    flex-shrink: 0;
    display: block;
  }

  @media (max-width: 768px) {
    .titulo-wrapper h2 {
      font-size: var(--tamanho-mob, 1.6rem);
    }
    .decor {
      height: 1.3rem;
    }
  }
</style>