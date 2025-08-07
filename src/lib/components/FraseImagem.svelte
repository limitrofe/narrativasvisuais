<script>
  export let texto = "Não há nada de tão bão que não possa meiorá!";
  export let autor = "Candinho";
  export let fotoDesk = "";
  export let fotoMob = "";
  export let videoDesk = "";
  export let videoMob = "";
  export let corBg = "#ffe664";
  export let corFoto = "transparent";
  export let corTexto = "#22384b";
</script>

<div class="frase-bg" style="background:{corBg}">
  <div class="frase-container">
    <div class="frase-midia">
<picture>
  <source srcset={fotoDesk} media="(min-width: 901px)" />
  <source srcset={fotoMob} media="(max-width: 900px)" />
  <img
    src={fotoMob}
    alt=""
    draggable="false"
    style="background:{corFoto};"
  />
</picture>
      {#if videoDesk || videoMob}
        <video
          class="frase-video"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          poster={fotoDesk || fotoMob}
          src={videoDesk || videoMob}
        ></video>
      {/if}
    </div>
    <div class="frase-textos">
      <div class="frase-citacao" style="color:{corTexto}">
        <span class="aspas">”</span>
      </div>
      <div class="frase-citacao" style="color:{corTexto}">
        <div class="texto">{texto}</div>
      </div>
      <div class="frase-autor">{autor}</div>
    </div>
  </div>
</div>

<style>
  .frase-bg {
    width: 100%;
    padding: 1.5vw 2vw;
    background: var(--cor-bg, #ffe664);
  }
  .frase-container {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    gap: 2vw;
  }
  .frase-midia {
    background: transparent;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50vw;
    max-width: 70%;
    min-width: 300px;
    border-radius: 0;
    overflow: hidden;
    position: relative;
    height: 70vh;
    max-height: 100vh;
  }
  .frase-midia picture,
  .frase-midia img,
  .frase-midia video {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    display: block;
  }
  .frase-midia img {
    z-index: 1;
    height: 70vh;
    width: auto;
    left: 50%;
    transform: translateX(-50%);
    background: var(--cor-foto, #ffe664);
    position: absolute;
    top: 0;
  }
  .frase-midia video {
    z-index: 2;
    pointer-events: none;
    background: #ffe664;
    height: 100vh;
    width: auto;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    top: 0;
  }
  .frase-textos {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    min-width: 0;
    height: 100%;
    padding-bottom: 2vw;
  }
  .frase-citacao {
    font-family: "din-condensed", Arial, sans-serif;
    font-size: 3vw;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 0.5vw;
    display: flex;
    align-items: flex-end;
    gap: 0.5vw;
    word-break: break-word;
    width: 60%;
  }
  .frase-citacao .aspas {
    font-size: 6vw;
    line-height: 0;
    font-family: inherit;
    margin-right: 0.5vw;
    display: inline-block;
    vertical-align: bottom;
  }
  .frase-autor {
    font-size: 2vw;
    font-family: "din-condensed", Arial, sans-serif;
    font-weight: 400;
    margin-top: 0.5vw;
    color: #111;
  }
  /* MOBILE */
  @media (max-width: 900px) {
    .frase-container {
      flex-direction: row;
      align-items: center;
      gap: 4vw;
    }
    .frase-midia {
      aspect-ratio: 9 / 12;
      width: 50vw;
      min-width: 0;
      max-width: 50vw;
      height: auto;
      max-height: none;
    }
    .frase-midia img,
    .frase-midia video {
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
      transform: none;
      position: absolute;
    }
    .frase-textos {
      padding-bottom: 0;
      justify-content: center;
    }
    .frase-citacao {
      font-size: 1.5rem;
      margin-bottom: 0rem;
      width: 100%;
    }
    .frase-citacao .aspas {
      font-size: 5rem;
      margin-right: 0.5vw;
    }
    .frase-autor {
      font-size: 1rem;
      margin-top: 0rem;
    }
  }
</style>
