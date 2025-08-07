<script>
  import GloboPlayer from './GloboPlayer.svelte';

  export let videoId;
  export let autoPlay = true;
  export let startMuted = false;
  export let skipDFP = true;
  export let ga4 = null;

  export let imagemSrc = '/mnt/data/d9ebd7bb-7745-49a6-8b4f-81426b12d75b.png';
  export let imagemAlt = 'Imagem lateral';
  // Caminho da moldura recebida
  const molduraSrc = '/img/etamundomelhor/nucleos/moldura-videos.png';
</script>

<div class="imagem-video-duplo">
  <div class="lado-esquerdo">
    <img src={imagemSrc} alt={imagemAlt} class="imagem-figura"/>
  </div>
  <div class="lado-direito">
    <div class="video-moldura-wrapper">
      <GloboPlayer
        {videoId}
        {autoPlay}
        {startMuted}
        {skipDFP}
        {ga4}
      />
      <img src={molduraSrc} alt="Moldura" class="moldura-sobreposta" draggable="false" />
    </div>
  </div>
</div>

<style>
.imagem-video-duplo {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  gap: 0vw;
  background: #ffe664;
  width: 100vw;
  /* min-height: 70vh; */
  padding: 0vw 0;
  box-sizing: border-box;
    
}

.lado-esquerdo {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  min-width: 320px;
  max-width: 480px;
}

.imagem-figura {
  width: 100%;
  height: auto;
  display: block;
  max-width: 480px;
}

/* Player + moldura */
.lado-direito {
  flex: 2 1 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 360px;
  max-width: 900px;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: visible; /* permite que a moldura passe um pouco do vídeo se for maior */
}

.video-moldura-wrapper {
  width: 80%;
  height: auto;
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 0px;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

/* Player ocupa tudo */
.video-moldura-wrapper :global(.clappr-player[data-player]),
.video-moldura-wrapper :global(iframe),
.video-moldura-wrapper :global(video) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block;
  background: #5b5b5b;
}

/* Moldura sobreposta */
.moldura-sobreposta {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* deixa o player clicável */
  z-index: 10;
  object-fit: fill; /* se quiser garantir o encaixe total */
  border-radius: 0px;
  user-select: none;
}

/* Responsivo mobile */
@media (max-width: 900px) {
  .imagem-video-duplo {
    flex-direction: column;
    align-items: center;
    gap: 0vw;
    padding: 0;
  }
  .lado-esquerdo,
  .lado-direito {
    max-width: 100vw;
    min-width: 0;
    width: 100%;
    justify-content: center;
    border-radius: 0px;
  }
  .imagem-figura {
    max-width: 360px;
    margin: 0 auto;
  }
  .lado-direito {
    max-width: 100vw;
    aspect-ratio: 16/9;
    margin: 0 auto;
  }
  .video-moldura-wrapper {
    border-radius: 0px;
  }
  .moldura-sobreposta {
    border-radius: 0px;
  }
}
</style>
