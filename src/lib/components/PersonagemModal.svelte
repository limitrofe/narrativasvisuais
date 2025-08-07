<script>
  export let showModal = false;         // Controla a abertura
  export let onClose = () => {};        // Função para fechar (callback opcional)
  export let nomePersonagem = "Candinho";
  export let nomeAtor = "Sergio Gizé";
  export let descricao = "Candinho continua o mesmo homem ingênuo, simples, caipira, cheio de positividade e amor pela vida.";
  export let foto = "/img/personagens/candinho.jpg";
  export let corPersonagem = "#84552c";
  export let corAtor = "#22384b";
  export let corDescricao = "#232323";
  export let rotate = -4;
  export let larguraDesc = "36rem";
  export let leftModal = "50vw";        // Posição horizontal do modal na viewport
  export let topModal = "50vh";         // Posição vertical do modal na viewport

  function closeModal(e) {
    if (
      !e || 
      e.target.classList.contains('modal-bg') || 
      e.target.classList.contains('modal-close')
    ) {
      onClose();
    }
  }
</script>

{#if showModal}
  <div
    class="modal-bg"
    on:click={closeModal}
    style="
      position: fixed;
      left: 0; top: 0; right: 0; bottom: 0;
      display: flex; align-items: center; justify-content: center;
      background: rgba(20,20,20,0.76);
      z-index: 3000;
    "
  >
    <div
      class="modal-box"
      style="
        position: absolute;
        left: {leftModal};
        top: {topModal};
        transform: translate(-50%, -50%);
        max-width: {larguraDesc};
      "
      on:click|stopPropagation
    >
      <button class="modal-close" on:click={closeModal} aria-label="Fechar">×</button>
      <img class="modal-foto" src={foto} alt={"Foto de " + nomePersonagem} style="transform: rotate({rotate}deg);" draggable="false" />
      <div class="modal-info">
        <span class="personagem-nome" style="color:{corPersonagem};">{nomePersonagem}</span>
        <span class="personagem-ator" style="color:{corAtor};">{nomeAtor}</span>
        <p class="personagem-desc" style="color:{corDescricao};">{descricao}</p>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-box {
    background: #fff;
    border-radius: 1rem;
    padding: 2.6rem 1.8rem 1.4rem;
    box-shadow: 0 8px 40px -12px #0007;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: modalIn 0.22s cubic-bezier(.77,-0.01,.24,1.01);
  }
  .modal-close {
    background: none;
    border: none;
    font-size: 2.1rem;
    color: #888;
    position: absolute;
    right: 1.2rem;
    top: 0.7rem;
    cursor: pointer;
    z-index: 5;
    transition: color 0.2s;
  }
  .modal-close:hover, .modal-close:focus { color: #c4170c; }
  .modal-foto {
    width: 130px;
    max-width: 46vw;
    border-radius: 0.6rem;
    margin-bottom: 1.1rem;
    box-shadow: 0 2px 16px -4px #0001;
    border: 1.5px solid #ececec;
    background: #f5eee6;
  }
  .modal-info {
    text-align: center;
    max-width: 100%;
  }
  .personagem-nome {
    font-family: "din-condensed", Arial, sans-serif;
    font-weight: 700;
    font-size: 2.1rem;
    display: block;
    line-height: 1.04;
    margin-bottom: 0.2em;
    letter-spacing: 0.01em;
  }
  .personagem-ator {
    font-family: "din-condensed", Arial, sans-serif;
    font-weight: 600;
    font-size: 1.3rem;
    display: block;
    margin-bottom: 1.1rem;
    letter-spacing: 0.01em;
  }
  .personagem-desc {
    font-family: "din-condensed", Arial, sans-serif;
    font-weight: 300;
    font-size: 1.1rem;
    line-height: 1.22;
    margin: 0;
    word-break: break-word;
    letter-spacing: 0.01em;
  }
  @keyframes modalIn {
    0% { opacity: 0; transform: scale(.92);}
    100% { opacity: 1; transform: scale(1);}
  }
</style>
