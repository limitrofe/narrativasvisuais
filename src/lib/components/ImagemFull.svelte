<script>
  export let srcDesk = '';
  export let srcMob = '';
  export let widthDesk = '100vw';
  export let heightDesk = 'auto';
  export let widthMob = '100vw';
  export let heightMob = 'auto';
  export let styleImg = '';
  // NOVA PROP PARA ALINHAMENTO: "start", "center" ou "end"
  export let align = 'center';
</script>

<style>
  
  .imagem-controlada {
    display: flex;
    justify-content: var(--alinhamento);
    align-items: center; /* vertical sempre centralizada, pode criar outra prop se quiser controlar */
    width: var(--width-desk);
    height: var(--height-desk);
    overflow: hidden;
    margin-left: auto;  /* NOVO: centraliza bloco horizontalmente */
    margin-right: auto; /* NOVO: centraliza bloco horizontalmente */
    padding: 0;
  }
  .imagem-controlada img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  @media (max-width: 768px) {
    .imagem-controlada {
      padding-top:0px;
      width: var(--width-mob);
      height: var(--height-mob);
    }
  }
  @media (max-width: 768px) {
  .imagem-controlada {
    align-items: flex-start;
  }
}
</style>

<div
  class="imagem-controlada"
  style="
    --width-desk: {widthDesk};
    --height-desk: {heightDesk};
    --width-mob: {widthMob};
    --height-mob: {heightMob};
    --alinhamento: {align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : 'center'};
  "
>
  <picture>
    <source srcset={srcMob} media="(max-width: 768px)" />
    <source srcset={srcDesk} media="(min-width: 769px)" />
    <img src={srcDesk} alt="" loading="lazy" style={styleImg} />
  </picture>
</div>
