<script>
  export let imagens = [];

  let ativa = null;
  let clicada = null;
  let isMobile = false;

  if (typeof window !== 'undefined') {
    isMobile = window.innerWidth <= 768;
  }

  function ativar(index) {
    ativa = index;
  }

  function desativar() {
    ativa = null;
  }

  function clicar(index) {
    if (!isMobile) return; // no desktop, ignora o clique
    clicada = index === clicada ? null : index;
  }
</script>

<style>
  .galeria {
    display: flex;
    overflow: hidden;
    height: auto;
    position: relative;
  }

  .galeria.expandida {
    overflow: visible;
  }

  .imagem {
    flex: 1;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    z-index: 1;
  }

  .imagem img {
    width: 100%;
    height: auto;
    object-fit: cover;
    pointer-events: none;
  }

  .imagem.ativa {
    flex: 3;
    z-index: 2;
  }

  .imagem.comprimida {
    flex: 0.5;
    filter: brightness(0.7);
  }

  .imagem.expandida {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 90vw;
    height: auto;
    z-index: 10;
    transition: all 0.3s ease;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  }

  .imagem.expandida img {
    object-fit: contain;
  }
</style>

<div class="galeria {clicada !== null ? 'expandida' : ''}">
  {#each imagens as img, index}
    <div
      class="imagem 
        {clicada === index ? 'expandida' : 
         ativa === index ? 'ativa' : 
         ativa !== null ? 'comprimida' : ''}"
      on:mouseenter={() => !isMobile && ativar(index)}
      on:mouseleave={() => !isMobile && desativar()}
      on:touchstart={() => ativar(index)}
      on:touchend={() => { clicar(index); desativar(); }}
      on:click={() => clicar(index)}
    >
      <img src={img} alt="Imagem" />
    </div>
  {/each}
</div>
