<script>
  export let imagens = [];
  export let bg = '#efecdb';

  const classesPossiveis = [
    'slower', 'slower1', 'slower2', 'slower-down',
    'faster', 'faster1', 'fastest', 'vertical', 'last', ''
  ];

  function getRandomClasse() {
    return classesPossiveis[Math.floor(Math.random() * classesPossiveis.length)];
  }

  let isMobile = false;
  const alturaMax = 300;
  const sobreposicao = 0.1;
  const sobreposicaoPx = alturaMax * sobreposicao;

  if (typeof window !== 'undefined') {
    isMobile = window.innerWidth < 768;
  }

  let metadados = imagens.map(() => ({
    z: Math.floor(Math.random() * 1000)
  }));

  let alturaWrapper = '100vh';
  $: if (isMobile && imagens.length) {
    const alturaTotal = imagens.length * (alturaMax - sobreposicaoPx) + sobreposicaoPx;
    alturaWrapper = `${alturaTotal}px`;
  }
</script>

<section
  class="parallax-section"
  style="background-color: {bg}; height: {isMobile ? 'auto' : '100vh'}; overflow-y: {isMobile ? 'auto' : 'hidden'};"
>
  {#if !isMobile}
    <!-- DESKTOP COM SCROLL ROTACIONADO E CLASSES RANDOM -->
    <div class="external">
      <div class="horizontal-scroll-wrapper">
        {#each imagens as src}
          <div class="img-wrapper {getRandomClasse()}">
            <img src={src} alt="imagem" loading="lazy" />
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <!-- MOBILE COM EMPILHAMENTO SOBREPOSTO -->
    <div class="stacked-wrapper" style="height: {alturaWrapper};">
      {#each imagens as src, i}
        <div
          class="img-stacked"
          style="top: {i * (alturaMax - sobreposicaoPx)}px; z-index: {metadados[i].z};"
          on:mouseenter={() => metadados[i].z = 9999}
          on:mouseleave={() => metadados[i].z = Math.floor(Math.random() * 1000)}
          on:touchstart={() => metadados[i].z = 9999}
          on:touchend={() => metadados[i].z = Math.floor(Math.random() * 1000)}
        >
          <img src={src} alt="imagem" loading="lazy" />
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
  .parallax-section {
    width: 100vw;
    position: relative;
    background-color: var(--bg, #efecdb);
  }

  /* DESKTOP ROTACIONADO */
  .external {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .horizontal-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vh;
    height: 100vw;
    transform: rotate(-90deg) translate3d(0, -100vh, 0);
    transform-origin: right top;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-bottom: 10rem;
    scrollbar-width: none;
  }

  .horizontal-scroll-wrapper::-webkit-scrollbar {
    display: none;
  }

  .img-wrapper {
    transform: rotate(90deg) translateZ(.1px) scale(0.9) translateY(-3vh);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
    transform-origin: 50% 50%;
    transition: 1s;
    padding: 1vh;
    background: inherit;
  }

  .img-wrapper:hover {
    min-height: 65vh;
    scale: 1.5;
    z-index: 99999999;
  }

  .slower        { transform: rotate(90deg) translateZ(-.2px) scale(1.1) translateY(-10vh); }
  .slower1       { transform: rotate(90deg) translateZ(-.25px) scale(1.05) translateY(8vh); }
  .slower2       { transform: rotate(90deg) translateZ(-.3px) scale(1.3) translateY(2vh); }
  .slower-down   { transform: rotate(90deg) translateZ(-.2px) scale(1.1) translateY(16vh); }
  .faster        { transform: rotate(90deg) translateZ(.15px) scale(0.8) translateY(14vh); }
  .faster1       { transform: rotate(90deg) translateZ(.05px) scale(0.8) translateY(10vh); }
  .fastest       { transform: rotate(90deg) translateZ(.22px) scale(0.7) translateX(-10vh) translateY(-15vh); }
  .vertical      { transform: rotate(90deg) translateZ(-.15px) scale(1.15); }
  .last          { transform: rotate(90deg) translateZ(-.2px) scale(1.1) translateX(25vh) translateY(-8vh); }

  .img-wrapper img {
    max-width: 45vh;
    max-height: 50vh;
    transition: .5s;
    vertical-align: top;
    filter: saturate(40%) sepia(30%) hue-rotate(5deg);
    object-fit: cover;
  }

  .img-wrapper img:hover {
    filter: none;
  }

  /* MOBILE STACKED COM SOBREPOSIÇÃO + INTERAÇÃO */
  .stacked-wrapper {
    position: relative;
    width: 100vw;
  }

  .img-stacked {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    transition: z-index 0.3s ease;
  }

  .img-stacked img {
    width: auto;
    max-width: 250px;
    height: auto;
    max-height: 300px;
    object-fit: cover;
    filter: saturate(40%) sepia(30%) hue-rotate(5deg);
    transition: transform 0.3s ease, filter 0.3s ease;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .img-stacked img:hover {
    filter: none;
    transform: scale(1.02);
  }
</style>
