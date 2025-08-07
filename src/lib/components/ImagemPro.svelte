<script>
  // --- PROPRIEDADES DO COMPONENTE ---

  // Fontes da imagem
  export let srcDesk = '';
  export let srcMob = '';
  export let alt = 'Imagem descritiva'; // Importante para acessibilidade

  // Dimensionamento (valores padrão para cobrir 100% da largura)
  export let widthDesk = '100%';
  export let heightDesk = 'auto';
  export let widthMob = '100%';
  export let heightMob = 'auto';

  /**
   * Posição do foco da imagem dentro do container.
   * Aceita valores como: 'center', 'top', 'bottom', 'left', 'right',
   * ou combinações como 'top right', 'center bottom'.
   * Mapeia diretamente a propriedade CSS `object-position`.
   */
  export let objectPosition = 'center'; // Valor padrão

  // Conteúdo textual
  export let legenda = '';
  export let credito = '';

  // Controles de visibilidade para o texto
  export let showLegenda = true;
  export let showCredito = true;
</script>

<style>
  .container {
    /* --- ESTILOS DE DESKTOP (AGORA SÃO O PADRÃO) --- */
    /* Acessa diretamente a variável passada pelo 'style' do <figure> */
    width: var(--width-desk);
    height: var(--height-desk);

    /* O resto dos estilos permanece igual */
    margin: 1rem auto;
    line-height: 0;
    display: block; /* Garante o comportamento de bloco para o margin:auto */
  }

  .imagem-pro {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: var(--object-position);
    display: block;
  }

  .legenda-container {
    line-height: 1.4; /* Restaura a altura da linha para o texto */
    font-size: 0.9rem;
    color: #555;
    padding: 0.5rem 0.2rem 0;
  }

  .credito {
    font-style: italic;
    font-weight: bold;
    color: #333;
  }

  /* --- MEDIA QUERY PARA MOBILE (SOBRESCEVE O PADRÃO) --- */
  @media (max-width: 768px) {
    .container {
      /* Sobrescreve as variáveis com os valores de mobile */
      width: var(--width-mob);
      height: var(--height-mob);
    }
  }
</style>

<figure
  class="container"
  style="
    --width-desk: {widthDesk};
    --height-desk: {heightDesk};
    --width-mob: {widthMob};
    --height-mob: {heightMob};
  "
>
  <picture>
    {#if srcMob}
      <source srcset={srcMob} media="(max-width: 768px)" />
    {/if}
    <source srcset={srcDesk} media="(min-width: 769px)" />
    
    <img class="imagem-pro" src={srcDesk} {alt} style="--object-position: {objectPosition};" />
  </picture>

  {#if legenda && showLegenda}
    <figcaption class="legenda-container">
      {legenda}
      {#if credito && showCredito}
        <span class="credito"> ({credito})</span>
      {/if}
    </figcaption>
  {/if}
</figure>