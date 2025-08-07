<script>
  import { onMount } from 'svelte';

  export let texto = "";
  export let imagem = "";
  export let alt = "";
  export let posicao = "left"; // "left" ou "right"
  export let corCard = "#fff";
  export let corVazado = "#ffe082";
  export let larguraCard = "480px";       // desktop
  export let larguraCardMob = "98vw";     // mobile
  export let alturaImg = "180px";         // desktop
  export let alturaImgMob = "100px";      // mobile
  export let radius = "18px";
  export let sombra = "0";
  export let padding = "1.3rem 2rem";
  export let fontSize = "1.23rem";
  export let fontWeight = "400";
  export let corTexto = "#22384b";
  export let imgTop = "-56px";
  export let imgLeft = posicao === "left" ? "-48px" : "auto";
  export let imgRight = posicao === "right" ? "-48px" : "auto";
  export let imgX = "0";
  export let imgTopMob = "-38px";
  export let imgXMob = "-50%";
  export let cardTop = "auto";
  export let cardLeft = "auto";
  export let cardTopMob = "auto";
  export let cardLeftMob = "auto";
  export let imagemNaFrente = false;

  onMount(() => {
    function updateVars() {
      document.querySelectorAll('.curiosidade-card').forEach(card => {
        card.style.setProperty('--card-top-mob', card.getAttribute('data-card-top-mob') || 'auto');
        card.style.setProperty('--card-left-mob', card.getAttribute('data-card-left-mob') || 'auto');
        card.style.setProperty('--largura-card-mob', card.getAttribute('data-largura-card-mob') || '98vw');
      });
      document.querySelectorAll('.curiosidade-img').forEach(img => {
        img.style.setProperty('--img-x-mob', img.getAttribute('data-img-x-mob') || '-50%');
        img.style.setProperty('--img-top-mob', img.getAttribute('data-img-top-mob') || '-38px');
        img.style.setProperty('--altura-img-mob', img.getAttribute('data-altura-img-mob') || '100px');
      });
    }
    updateVars();
    window.addEventListener('resize', updateVars);
    return () => window.removeEventListener('resize', updateVars);
  });
</script>

<div
  class="curiosidade-wrapper"
  style="
    max-width: {larguraCard};
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2.6rem;
    position: relative;
    display: flex;
    flex-direction: {posicao === 'left' ? 'row' : 'row-reverse'};
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    --largura-card-mob: {larguraCardMob};
  "
>
  <div
    class="curiosidade-card"
    style="
      background: {corCard};
      border-radius: {radius};
      z-index: 2;
      box-shadow: {sombra};
      padding: {padding};
      font-size: {fontSize};
      font-weight: {fontWeight};
      color: {corTexto};
      margin-{posicao === 'left' ? 'left' : 'right'}: 56px;
      min-height: 80px;
      width: 100%;
      max-width: {larguraCard};
      position: relative;
      overflow: visible;
      display: flex;
      align-items: center;
      top: {cardTop};
      left: {cardLeft};
      --card-top-mob: {cardTopMob};
      --card-left-mob: {cardLeftMob};
      --largura-card-mob: {larguraCardMob};
    "
    data-card-top-mob={cardTopMob}
    data-card-left-mob={cardLeftMob}
    data-largura-card-mob={larguraCardMob}
  >
    <!-- Fundo colorido -->
    <div
      class="curiosidade-bg"
      style="
        background: {corVazado};
        border-radius: {radius};
        box-shadow: {sombra};
        position: absolute;
        inset: 0 0 0 0;
        z-index: {imagemNaFrente ? 9 : 2};
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
      "
    ></div>
    <!-- Imagem -->
    {#if imagem}
      <img
        class="curiosidade-img"
        src={imagem}
        alt={alt}
        draggable="false"
        style="
          height: {alturaImg};
          width: auto;
          object-fit: contain;
          border-radius: 13px;
          box-shadow: 0;
          background: transparent;
          display: block;
          position: absolute;
          top: {imgTop};
          left: {imgLeft};
          right: {imgRight};
          z-index: {imagemNaFrente ? 10 : 1};
          overflow: visible;
          pointer-events: auto;
          transform: translateX({imgX});
          --img-x-mob: {imgXMob};
          --img-top-mob: {imgTopMob};
          --altura-img-mob: {alturaImgMob};
        "
        data-img-x-mob={imgXMob}
        data-img-top-mob={imgTopMob}
        data-altura-img-mob={alturaImgMob}
      />
    {/if}
    <!-- Texto -->
    <span
      class="curiosidade-texto"
      style="
        position: relative;
        z-index: {imagemNaFrente ? 11 : 3};
        width: 100%;
        word-break: break-word;
      "
    >{@html texto}</span>
  </div>
</div>

<style>
  .curiosidade-wrapper {
    overflow: visible !important;
  }
  .curiosidade-card {
    position: relative;
    overflow: visible !important;
    min-width: 0;
    word-break: break-word;
    width: 100%;
    max-width: var(--largura-card, 480px);
    top: var(--card-top, auto);
    left: var(--card-left, auto);
  }
  .curiosidade-bg {
    overflow: visible !important;
  }
  .curiosidade-img {
    overflow: visible !important;
    pointer-events: auto;
    background-color: transparent;
    transform: translateX(var(--img-x, 0));
    height: var(--altura-img, 180px);
  }
  .curiosidade-img:hover {
    box-shadow: 0 8px 24px -2px #0002;
    filter: brightness(1.1);
  }
  .curiosidade-texto {
    word-break: break-word;
  }

  @media (max-width: 900px) {
    .curiosidade-wrapper {
      max-width: var(--largura-card-mob, 98vw) !important;
      flex-direction: column !important;
      align-items: center;
    }
    .curiosidade-card {
      margin: 0 !important;
      font-size: 1rem;
      padding: 1.1rem 1rem;
      min-height: 72px;
      width: 100%;
      max-width: var(--largura-card-mob, 98vw) !important;
      top: var(--card-top-mob, auto) !important;
      left: var(--card-left-mob, auto) !important;
    }
    .curiosidade-img {
      top: var(--img-top-mob, -38px) !important;
      left: 50% !important;
      right: auto !important;
      height: var(--altura-img-mob, 100px) !important;
      transform: translateX(var(--img-x-mob, -50%)) !important;
    }
    .curiosidade-bg {
      border-radius: 12px;
    }
  }
</style>
