<script>
  import { onMount, onDestroy } from 'svelte';
  import Papa from 'papaparse';

  export let sheetsUrl = "";
  export let autoPlay = true;
  export let startMuted = false;
  export let skipDFP = true;
  export let controls = true;

  let videos = [];
  let current = 0;
  let playerInstance;
  let playerElement;
  let audioUnlocked = false;
  let progressoAtual = 0;

  async function fetchVideos() {
    return new Promise((resolve, reject) => {
      Papa.parse(sheetsUrl, {
        download: true,
        header: true,
        complete: res => {
          const novos = res.data.filter(v => v.videoId);
          resolve(novos);
        },
        error: reject
      });
    });
  }

  function liberarAudio() {
    audioUnlocked = true;
    if (playerInstance) {
      try {
        playerInstance.unmute && playerInstance.unmute();
        playerInstance.play && playerInstance.play();
      } catch (e) {}
    }
  }

  function createAndLoadPlayer(videoIdToPlay) {
    if (typeof window === 'undefined' || !window.WM || !window.WM.Player) return;
    if (playerInstance && playerInstance.destroy) playerInstance.destroy();

    const config = {
      source: Number(videoIdToPlay),
      autoPlay: autoPlay,
      startMuted: !audioUnlocked,
      skipDFP: skipDFP,
      controls: controls,
      width: '100%',
      height: '100vh'
    };

    playerInstance = new window.WM.Player(config);
    playerInstance.attachTo(playerElement);

    progressoAtual = 0;

    playerInstance.on('timeupdate', ({ currentTime, duration }) => {
      if (duration > 0) {
        progressoAtual = Math.max(0, Math.min(1, currentTime / duration));
      }
    });

    playerInstance.on('ended', async () => {
      progressoAtual = 1;

      const isLast = current >= videos.length - 1;

      if (isLast) {
        const novosVideos = await fetchVideos();
        videos = novosVideos;
        current = 0;
      } else {
        current += 1;
      }

      createAndLoadPlayer(videos[current].videoId);
    });

    setTimeout(() => {
      try {
        if (audioUnlocked) {
          playerInstance.unmute && playerInstance.unmute();
        }
        playerInstance.play && playerInstance.play();
      } catch (e) {}
    }, 80);
  }

  onMount(async () => {
    const initialVideos = await fetchVideos();
    videos = initialVideos;
    if (videos.length === 0) return;

    if (!window.WM) {
      const script = document.createElement('script');
      script.src = 'https://s3.glbimg.com/v1/AUTH_e1b09a2d222b4900a437a46914be81e5/api/stable/web/api.min.js';
      script.async = true;
      script.onload = () => {
        window.WM.playerAvailable.then(() => {
          createAndLoadPlayer(videos[current].videoId);
        });
      };
      document.body.appendChild(script);
    } else {
      window.WM.playerAvailable.then(() => {
        createAndLoadPlayer(videos[current].videoId);
      });
    }
  });

  onDestroy(() => {
    if (playerInstance?.destroy) playerInstance.destroy();
  });
</script>

{#if videos.length > 1}
  <div class="indicador-videos-stories">
    {#each videos as _, i}
      <span class="traco-story">
        <span class="traco-fill"
          style="width: {i < current 
                        ? '100%' 
                        : i === current 
                          ? (progressoAtual * 100) + '%' 
                          : '0%'};">
        </span>
      </span>
    {/each}
  </div>
{/if}

{#if !audioUnlocked}
  <button on:click={liberarAudio} style="position:fixed;z-index:999;top:2rem;left:2rem;padding:1rem 2rem;font-size:1.2rem;">Ativar som da transmissão</button>
{/if}

<div id="player-wrapper" class="player-globo" bind:this={playerElement}></div>



<style>
.indicador-videos-stories {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 5px;
  z-index: 20;
  padding: 16px 3vw 0 3vw;
  pointer-events: none;
}
.traco-story {
  flex: 1 1 0;
  height: 6px;
  background: #fff2;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}
.traco-fill {
  display: block;
  height: 100%;
  background: #fff;
  border-radius: 3px;
  transition: width 0.15s linear;
  width: 0%;
}
@media (max-width: 700px) {
  .indicador-videos-stories {
    padding: 11px 2vw 0 2vw;
    height: 9px;
    gap: 3px;
  }
  .traco-story {
    height: 4px;
    border-radius: 2px;
  }
  .traco-fill {
    border-radius: 2px;
  }
}
/* --- 1. Estilos Base para o Wrapper do Player (#player-wrapper, .player-globo) --- */
/* O wrapper sempre ocupa a tela toda para atuar como fundo e centralizador. */
/* Ele não força o vídeo a 100vw, apenas define o "palco". */
#player-wrapper.player-globo,
#player-wrapper {
  background: #232323; /* Fundo escuro para as bordas do vídeo */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* O WRAPPER OCUPA A LARGURA TOTAL DA VIEWPORT */
  height: 100vh; /* O WRAPPER OCUPA A ALTURA TOTAL DA VIEWPORT */
  max-width: 100vw;
  max-height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex; /* Essencial para centralizar o vídeo interno */
  align-items: center;
  justify-content: center;
  z-index: 1; /* Nível padrão, ajuste se precisar sobrepor mais */
}

/* --- 2. Estilos para o Vídeo/Iframe dentro do Wrapper (APENAS object-fit e display) --- */
/* Estas são as propriedades que o VÍDEO/IFRAME injetado terá por padrão.
   AS DIMENSÕES SERÃO CONTROLADAS PELAS CLASSES DE PROPORÇÃO E MEDIA QUERIES. */
#player-wrapper video,
#player-wrapper iframe,
.player-globo video,
.player-globo iframe {
  object-fit: contain; /* CRUCIAL: Garante que o vídeo caiba sem cortar, adicionando barras */
  display: block; /* Remove espaços extras e permite margin: auto */
  background: #232323; /* Fundo do player em si */
  margin: auto; /* Centraliza o elemento dentro do flex container */
  pointer-events: all; /* Permite interações com o player */
  box-sizing: border-box;
  /* IMPORTANTE: NENHUMA DECLARAÇÃO DE WIDTH/HEIGHT AQUI! */
}

/* --- 3. ESTILOS PARA VÍDEOS HORIZONTAIS (via JS: .is-horizontal-video) --- */
/* Aplicado ao #player-wrapper quando o vídeo interno é horizontal (16:9, 4:3, etc.) */

/* Mobile (até 767px): Vídeo Horizontal deve preencher a LARGURA */
@media (max-width: 767px) {
  #player-wrapper.is-horizontal-video video,
  #player-wrapper.is-horizontal-video iframe {
    width: 100vw;  /* O vídeo ocupa a largura total da viewport */
    height: 100vh;  /* A altura se ajusta */
    max-width: 100vw;
    max-height: 100vh;
  }
}

/* Desktop (a partir de 768px): Vídeo Horizontal deve preencher a ALTURA */
@media (min-width: 768px) {
  #player-wrapper.is-horizontal-video video,
  #player-wrapper.is-horizontal-video iframe {
    width: 100vw;   /* A largura se ajusta */
    height: 100vh; /* O vídeo ocupa a altura total da viewport */
    max-width: 100vw;
    max-height: 100vh;
  }
}

/* --- 4. ESTILOS PARA VÍDEOS VERTICAIS (via JS: .is-vertical-video) --- */
/* Aplicado ao #player-wrapper quando o vídeo interno é vertical (9:16, etc.) */

/* Mobile (até 767px): VÍDEO VERTICAL DEVE PREENCHER A ALTURA (COM BARRAS LATERAIS) */
@media (max-width: 767px) {
  #player-wrapper.is-vertical-video video,
  #player-wrapper.is-vertical-video iframe {
    width: 100vw;   /* A largura se ajusta */
    height: 100vh; /* O vídeo ocupa a ALTURA TOTAL DA VIEWPORT */
    max-width: 100vw; /* Garante que a largura ajustada não ultrapasse a tela */
    max-height: 100vh;
  }
}

/* Desktop (a partir de 768px): VÍDEO VERTICAL DEVE PREENCHER A ALTURA */
@media (min-width: 768px) {
  #player-wrapper.is-vertical-video video,
  #player-wrapper.is-vertical-video iframe {
    width: 100vw;   /* A largura se ajusta */
    height: 100vh; /* O vídeo ocupa a ALTURA TOTAL DA VIEWPORT */
    max-width: 100vw; /* Garante que a largura ajustada não ultrapasse a tela */
    max-height: 100vh;
  }
}

/* --- 5. Estilos para o Contêiner do Clappr Player (se o player da Globo usa essa classe) --- */
/* Estas regras são mais específicas para o contêiner interno injetado pelo Clappr. */
/* O contêiner Clappr sempre preenche o nosso wrapper. */
.clappr-player[data-player] {
    width: 100vw;
    height: 100vh;
    display: flex; /* Centraliza o VÍDEO DENTRO DO CLAPPR */
    align-items: center;
    justify-content: center;
    /* SEM !important aqui, a menos que seja absolutamente necessário contra um estilo injetado */
}

/* E as regras para o vídeo/iframe DENTRO do Clappr - seguindo a lógica de proporção */

/* Clappr - Mobile (até 767px): Vídeo Horizontal */
@media (max-width: 767px) {
  #player-wrapper.is-horizontal-video .clappr-player[data-player] video,
  #player-wrapper.is-horizontal-video .clappr-player[data-player] iframe {
    width: 100vw; /* 100% da largura do contêiner Clappr */
    height: 100vh;
  }
  /* Clappr - Mobile (até 767px): Vídeo Vertical */
  #player-wrapper.is-vertical-video .clappr-player[data-player] video,
  #player-wrapper.is-vertical-video .clappr-player[data-player] iframe {
    width: 100vw;
    height: 100vh; /* 100% da altura do contêiner Clappr */
  }
}

/* Clappr - Desktop (a partir de 768px): Vídeo Horizontal */
@media (min-width: 768px) {
  #player-wrapper.is-horizontal-video .clappr-player[data-player] video,
  #player-wrapper.is-horizontal-video .clappr-player[data-player] iframe {
    width: 100vw;
    height: 100vh; /* 100% da altura do contêiner Clappr */
  }
  /* Clappr - Desktop (a partir de 768px): Vídeo Vertical */
  #player-wrapper.is-vertical-video .clappr-player[data-player] video,
  #player-wrapper.is-vertical-video .clappr-player[data-player] iframe {
    width: 100vw;
    height: 100vh; /* 100% da altura do contêiner Clappr */
  }

  #player-wrapper.player-globo.s-g8xK2fE8IO0z, #player-wrapper.s-g8xK2fE8IO0z {
    background: #232323;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    /* max-width: 100vw; */
    /* max-height: 100vh; */
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex
;
    align-items: center;
    justify-content: center;
    z-index: 1;
}
#player-wrapper, .player-globo, .clappr-player[data-player] {
    width: 100vw;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #232323 !important;
    display: flex !important
;
    align-items: center !important;
    justify-content: center !important;
    overflow: hidden !important;
    z-index: 1;
}
}

#wp3-player-4{
  width: 100%;
  height: 100vh;
}

.clappr-player#wp3-player-1 {
  width: 100%;
    height: 100vh;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transform: translate3d(0, 0, 0);
    position: relative;
    margin: 0;
    padding: 0;
    border: 0;
    font-style: normal;
    font-weight: normal;
    text-align: center;
    overflow: hidden;
    font-size: 100%;
    font-family: "lucida grande", tahoma, verdana, arial, sans-serif;
    text-shadow: none;
    box-sizing: border-box;
    display: block;
    max-width: none;
    box-sizing: inherit;
    float: none;
    -webkit-tap-highlight-color: transparent;
}
</style>