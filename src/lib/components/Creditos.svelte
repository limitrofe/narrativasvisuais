<script>
  export let creditos = [];

  export let corFundo = "#232323";
  export let corTextoGeral = "#ffffff";
  export let corFuncao = "#ffffff";
  export let corNome = "#ffffff";

  // Desktop
  export let tamanhoFuncaoDesk = "1rem";
  export let tamanhoNomeDesk = "2rem";
  export let lineHeightFuncaoDesk = "1.2";
  export let lineHeightNomeDesk = "1.3";

  // Mobile
  export let tamanhoFuncaoMob = "0.9rem";
  export let tamanhoNomeMob = "1.3rem";
  export let lineHeightFuncaoMob = "1.15";
  export let lineHeightNomeMob = "1.2";

  export let alinhamento = "center";
  export let espacamentoItens = "3rem";
</script>

<section
  class="creditos"
  style="background-color: {corFundo}; color: {corTextoGeral};"
>
  <div class="container">
    {#each creditos as c}
      <div
        class="linha-credito"
        style="text-align: {alinhamento}; margin-bottom: {espacamentoItens};"
      >
        <p
          class="funcao"
          style="
            color: {corFuncao};
            --font-size-desk: {tamanhoFuncaoDesk};
            --font-size-mob: {tamanhoFuncaoMob};
            --line-height-desk: {lineHeightFuncaoDesk};
            --line-height-mob: {lineHeightFuncaoMob};
          "
        >
          {c.funcao}
        </p>
        <p
          class="nome"
          style="
            color: {corNome};
            --font-size-desk: {tamanhoNomeDesk};
            --font-size-mob: {tamanhoNomeMob};
            --line-height-desk: {lineHeightNomeDesk};
            --line-height-mob: {lineHeightNomeMob};
          "
        >
          {c.nome}
        </p>
      </div>
    {/each}
  </div>
</section>

<style>
  .creditos {
    padding: 5vh 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .linha-credito {
    /* spacing via style */
  }

  .funcao {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: var(--font-size-desk);
    line-height: var(--line-height-desk);
  }

  .nome {
    font-weight: 600;
    margin: 0.2rem 0 0;
    font-size: var(--font-size-desk);
    line-height: var(--line-height-desk);
  }

  @media (max-width: 768px) {
    .funcao,
    .nome {
      font-size: var(--font-size-mob) !important;
      line-height: var(--line-height-mob) !important;
    }
  }
</style>
