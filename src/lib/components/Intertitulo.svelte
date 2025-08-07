<script>
  export let texto = "Intertítulo";
  export let cor = "#22384b";
  export let tamanhoDesk = "2rem";
  export let tamanhoMob = "1.2rem";
  export let alinhamento = "center"; // 'center' | 'left' | 'right'
  export let peso = 700;
</script>

<h3
  class="intertitulo"
  style="
    --cor-inter: {cor};
    --tamanho-desk: {tamanhoDesk};
    --tamanho-mob: {tamanhoMob};
    --alinhamento: {alinhamento};
    --peso: {peso};
  "
>
  {texto}
</h3>

<style>
  .intertitulo {
    margin: 0;
    padding: 0;
    color: var(--cor-inter, #22384b);
    font-family: "din-condensed", Arial, sans-serif;
    font-size: var(--tamanho-desk, 2rem);
    font-weight: var(--peso, 700);
    text-align: var(--alinhamento, center);
    letter-spacing: 0.01em;
    line-height: 1.1;
    transition: font-size 0.3s, color 0.3s;
    width: 100%;
    box-sizing: border-box;
  }
  @media (max-width: 768px) {
    .intertitulo {
      font-size: var(--tamanho-mob, 1.2rem);
    }
  }
</style>
