<script>
  import { onMount } from "svelte";
  export let nomePersonagem = "Candinho";
  export let nomeAtor = "Sergio Gizé";
  export let descricao = "Candinho continua o mesmo homem ingênuo, simples, caipira, cheio de positividade e amor pela vida.";
  export let foto = "/img/personagens/candinho.jpg";
  export let corPersonagem = "#84552c";
  export let corAtor = "#22384b";
  export let corDescricao = "#232323";
  export let bg = "transparent";
  export let rotate = -4;
  export let alturaImgDesk = "320px";
  export let alturaImgMob = "180px";
  export let maxWidth = "1000px";
  export let xDesk = "0px";
  export let yDesk = "0px";
  export let xMob = "0px";
  export let yMob = "0px";
  export let larguraDescDesk = "36rem";
  export let larguraDescMob = "90vw";

  // Layout: "foto-esquerda", "foto-direita", "foto-cima", "foto-baixo"
  export let layout = "foto-esquerda";

  // NOVO: Alinhamento do texto
  export let alignNome = "left"; // "left", "center", "right"
  export let alignAtor = "left"; // "left", "center", "right"
  export let alignDesc = "left"; // "left", "center", "right"

  let isMobile = false;
  let left, top, larguraDesc;

  function updateResponsiveValues() {
    isMobile = window.matchMedia("(max-width: 900px)").matches;
    left = isMobile ? xMob : xDesk;
    top = isMobile ? yMob : yDesk;
    larguraDesc = isMobile ? larguraDescMob : larguraDescDesk;
  }

  onMount(() => {
    updateResponsiveValues();
    window.addEventListener("resize", updateResponsiveValues);
    return () => window.removeEventListener("resize", updateResponsiveValues);
  });
</script>

<div
  class="personagem-card {layout}"
  style="
    background:{bg};
    max-width:{maxWidth};
    position:absolute;
    left:{left};
    top:{top};
  "
>
  {#if layout === 'foto-esquerda'}
    <div class="personagem-img-frame" style="--altura-img: {alturaImgDesk}; --altura-img-mob: {alturaImgMob};">
      <img
        class="personagem-img"
        src={foto}
        alt={"Foto de " + nomePersonagem}
        draggable="false"
        style="transform: rotate({rotate}deg);"
      />
    </div>
    <div class="personagem-info" style="max-width:{larguraDesc};">
      <span class="personagem-nome" style="color:{corPersonagem}; text-align:{alignNome};">{nomePersonagem}</span>
      <span class="personagem-ator" style="color:{corAtor}; text-align:{alignAtor};">{nomeAtor}</span>
      <p class="personagem-desc" style="color:{corDescricao}; text-align:{alignDesc};">{descricao}</p>
    </div>
  {:else if layout === 'foto-direita'}
    <div class="personagem-info" style="max-width:{larguraDesc};">
      <span class="personagem-nome" style="color:{corPersonagem}; text-align:{alignNome};">{nomePersonagem}</span>
      <span class="personagem-ator" style="color:{corAtor}; text-align:{alignAtor};">{nomeAtor}</span>
      <p class="personagem-desc" style="color:{corDescricao}; text-align:{alignDesc};">{descricao}</p>
    </div>
    <div class="personagem-img-frame" style="--altura-img: {alturaImgDesk}; --altura-img-mob: {alturaImgMob};">
      <img
        class="personagem-img"
        src={foto}
        alt={"Foto de " + nomePersonagem}
        draggable="false"
        style="transform: rotate({rotate}deg);"
      />
    </div>
  {:else if layout === 'foto-cima'}
    <div class="personagem-img-frame" style="--altura-img: {alturaImgDesk}; --altura-img-mob: {alturaImgMob}; margin: 0 auto;">
      <img
        class="personagem-img"
        src={foto}
        alt={"Foto de " + nomePersonagem}
        draggable="false"
        style="transform: rotate({rotate}deg);"
      />
    </div>
    <div class="personagem-info" style="max-width:{larguraDesc}; margin: 0 auto;">
      <span class="personagem-nome" style="color:{corPersonagem}; text-align:{alignNome};">{nomePersonagem}</span>
      <span class="personagem-ator" style="color:{corAtor}; text-align:{alignAtor};">{nomeAtor}</span>
      <p class="personagem-desc" style="color:{corDescricao}; text-align:{alignDesc};">{descricao}</p>
    </div>
  {:else if layout === 'foto-baixo'}
    <div class="personagem-info" style="max-width:{larguraDesc}; margin: 0 auto;">
      <span class="personagem-nome" style="color:{corPersonagem}; text-align:{alignNome};">{nomePersonagem}</span>
      <span class="personagem-ator" style="color:{corAtor}; text-align:{alignAtor};">{nomeAtor}</span>
      <p class="personagem-desc" style="color:{corDescricao}; text-align:{alignDesc};">{descricao}</p>
    </div>
    <div class="personagem-img-frame" style="--altura-img: {alturaImgDesk}; --altura-img-mob: {alturaImgMob}; margin: 0 auto;">
      <img
        class="personagem-img"
        src={foto}
        alt={"Foto de " + nomePersonagem}
        draggable="false"
        style="transform: rotate({rotate}deg);"
      />
    </div>
  {/if}
</div>

<style>
  .personagem-card {
    box-sizing: border-box;
    border-radius: 0.3rem;
    overflow: visible;
    padding: 0;
    gap: 0vw;
    width: auto;
    background: var(--card-bg, transparent);
    display: flex;
    align-items: flex-start;
    position: relative;
  }
  .personagem-card.foto-esquerda,
  .personagem-card.foto-direita {
    flex-direction: row;
  }
  .personagem-card.foto-cima,
  .personagem-card.foto-baixo {
    flex-direction: column;
    align-items: center;
    /* Só centraliza container, não o texto dentro! */
  }
  .personagem-card.foto-direita > .personagem-img-frame {
    order: 2;
    margin-left: 2vw;
    margin-right: 0;
  }
  .personagem-card.foto-direita > .personagem-info {
    order: 1;
    margin-right: 2vw;
    margin-left: 0;
  }
  .personagem-card.foto-esquerda > .personagem-img-frame {
    order: 1;
    margin-right: 0;
    margin-left: 0;
  }
  .personagem-card.foto-esquerda > .personagem-info {
    order: 2;
    margin-left: 0;
    margin-right: 0;
  }
  .personagem-img-frame {
    background: url('/img/personagens/borda-papel.png') no-repeat center/cover;
    padding: 0vw;
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    min-width: 0;
    height: var(--altura-img, 320px);
    aspect-ratio: 0.85 / 1;
    max-width: 320px;
    border-radius: 0.1rem;
    flex-shrink: 0;
    transition: height 0.3s;
  }
  .personagem-img {
    height: 100%;
    width: auto;
    max-width: 220px;
    object-fit: cover;
    border-radius: 0.08rem;
    background: transparent;
    display: block;
  }
  .personagem-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-width: 0;
    padding: 0.5vw 0 0 0;
  }
  .personagem-nome {
    font-family: "din-condensed", Arial, sans-serif;
    font-weight: 700;
    font-size: 1.8rem;
    display: block;
    line-height: 1;
    margin-bottom: 0.1em;
    letter-spacing: 0.01em;
    /* text-align via style inline */
  }
  .personagem-ator {
    font-family: "din-condensed", Arial, sans-serif;
    font-weight: 600;
    font-size: 1.4rem;
    display: block;
    margin-bottom: 1.4rem;
    letter-spacing: 0.01em;
    /* text-align via style inline */
  }
  .personagem-desc {
    font-family: "din-condensed", Arial, sans-serif;
    font-weight: 300;
    font-size: 1.3rem;
    line-height: 1.13;
    margin: 0;
    word-break: break-word;
    letter-spacing: 0.01em;
    /* text-align via style inline */
  }
  @media (max-width: 900px) {
    .personagem-card {
      max-width: 100vw;
      padding: 1vw 1vw;
      gap: 1vw;
    }
    .personagem-img-frame {
      height: var(--altura-img-mob, 180px);
      aspect-ratio: 0.85 / 1;
      max-width: 120px;
      min-width: 0;
      padding: 0.5vw;
      transition: height 0.3s;
    }
    .personagem-img {
      max-width: 120px;
    }
    .personagem-info {
      padding: 0;
      max-width: none;
    }
    .personagem-nome { font-size: 1.3rem; }
    .personagem-ator { font-size: 1.1rem; }
    .personagem-desc { font-size: 1rem; }
  }
</style>
