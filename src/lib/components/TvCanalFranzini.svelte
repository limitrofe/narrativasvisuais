<script>
  import { onMount, onDestroy } from 'svelte';
  import Papa from 'papaparse';

  // Props
  export let sheetsUrl = "";
  export let textColumnHeader = 'textoCartela';
  export let autoPlay = true;
  export let startMuted = false;
  export let skipDFP = true;
  export let controls = true;

  // --- ESTADOS DO COMPONENTE ---
  let videos = [];
  let textos = [];
  
  // Controla a caixa de texto no topo do vídeo
  let mostrandoCaixaTopo = false;

  let currentVideoIndex = 0;
  let currentTextIndex = 0;
  
  let playerInstance;
  let playerElement;
  let audioUnlocked = false;
  let progressoAtual = 0;

  let mostrandoCartela = false;
  let cartelaClass = '';
  let cartelaLinhas = [];

  // Função para buscar dados da planilha Google Sheets
  async function fetchData() {
    return new Promise((resolve, reject) => {
      Papa.parse(sheetsUrl, {
        download: true,
        header: true,
        complete: res => {
          const novosVideos = [];
          const novosTextos = [];

          res.data.forEach(row => {
            if (row.videoId && row.videoId.trim() !== '') {
              novosVideos.push(row);
            }
            if (row[textColumnHeader] && row[textColumnHeader].trim() !== '') {
              novosTextos.push(row[textColumnHeader]);
            }
          });
          
          resolve({ videos: novosVideos, textos: novosTextos });
        },
        error: reject
      });
    });
  }

  // Função para liberar o áudio com interação do usuário
  function liberarAudio() {
    audioUnlocked = true;
    if (playerInstance) {
      playerInstance.unmute?.();
      playerInstance.play?.();
    }
  }

  // Avança para o próximo vídeo e reinicia a lista se necessário
  async function advanceAndPlayNext() {
    mostrandoCartela = false;
    
    if (videos.length === 0) return;

    // Usando o operador de módulo (%) para garantir o loop infinito
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    
    // Se o loop recomeçou (index voltou a 0), busca os dados novamente
    if (currentVideoIndex === 0) {
        console.log("Reiniciando a lista de vídeos. Buscando dados atualizados...");
        const data = await fetchData();
        videos = data.videos;
        textos = data.textos;
        if (textos.length === 0) {
            console.warn("Nenhum texto encontrado na planilha após recarregar.");
        }
    }

    createAndLoadPlayer(videos[currentVideoIndex]?.videoId);
  }

  // Cria e configura a instância do player de vídeo
  function createAndLoadPlayer(videoIdToPlay) {
    if (typeof window === 'undefined' || !window.WM?.Player || !videoIdToPlay) return;

    if (playerInstance) playerInstance.destroy();

    // Mostra a caixa de texto "Vídeos em alta" por 5 segundos
    mostrandoCaixaTopo = true;
    setTimeout(() => {
      mostrandoCaixaTopo = false;
    }, 5000);

    playerInstance = new window.WM.Player({
      source: Number(videoIdToPlay),
      autoPlay: autoPlay,
      startMuted: !audioUnlocked,
      skipDFP: skipDFP,
      controls: controls,
      width: '100%',
      height: '100vh'
    });
    
    playerInstance.attachTo(playerElement);
    progressoAtual = 0;
    
    // Atualiza a barra de progresso do "story"
    playerInstance.on('timeupdate', ({ currentTime, duration }) => {
      if (duration > 0) progressoAtual = Math.min(1, currentTime / duration);
    });

    // --- LÓGICA CORRIGIDA E GARANTIDA ---
    // É executada quando o vídeo atual termina
    playerInstance.on('ended', () => {
      progressoAtual = 1;

      // Se existem textos na planilha, mostra a cartela intercalada
      if (textos.length > 0) {
        const textoAtual = textos[currentTextIndex];
        cartelaLinhas = textoAtual.split('\n');
        currentTextIndex = (currentTextIndex + 1) % textos.length;
        
        mostrandoCartela = true;
        setTimeout(() => cartelaClass = 'cartela-destaque fade-in', 10);

        // Após 5 segundos, esconde a cartela e chama o próximo vídeo
        setTimeout(() => {
          cartelaClass = 'cartela-destaque fade-out';
          setTimeout(advanceAndPlayNext, 500); // 500ms para a animação de fade-out
        }, 5000);

      } else {
        // Se não há textos, simplesmente avança para o próximo vídeo
        advanceAndPlayNext();
      }
    });
  }

  // Função executada quando o componente é montado na tela
  onMount(async () => {
    try {
      const data = await fetchData();
      videos = data.videos;
      textos = data.textos;

      if (videos.length === 0) {
        console.error("Nenhum vídeo com 'videoId' válido encontrado na planilha.");
        return;
      }

      // Carrega o script da API do player da Globo se ainda não estiver carregado
      if (!window.WM) {
        const script = document.createElement('script');
        script.src = 'https://s3.glbimg.com/v1/AUTH_e1b09a2d222b4900a437a46914be81e5/api/stable/web/api.min.js';
        script.async = true;
        script.onload = () => {
          window.WM.playerAvailable.then(() => createAndLoadPlayer(videos[currentVideoIndex]?.videoId));
        };
        document.body.appendChild(script);
      } else {
        window.WM.playerAvailable.then(() => createAndLoadPlayer(videos[currentVideoIndex]?.videoId));
      }
    } catch (error) {
      console.error("Falha ao buscar ou processar dados da planilha:", error);
    }
  });

  // Função para limpar a instância do player ao destruir o componente
  onDestroy(() => {
    if (playerInstance) playerInstance.destroy();
  });
</script>

{#if mostrandoCaixaTopo}
  <div class="caixa-topo-fixa">
    Vídeos em alta no g1
  </div>
{/if}

{#if mostrandoCartela}
  <div class={cartelaClass}>
    <div class="texto-animado">
      {#each cartelaLinhas as linha, i}
        <span class="palavra" style="transition-delay: {i * 150}ms;">
          {linha}
        </span>
      {/each}
    </div>
  </div>
{/if}

{#if videos.length > 1}
  <div class="indicador-videos-stories">
    {#each videos as _, i}
      <span class="traco-story">
        <span class="traco-fill"
          style="width: {i < currentVideoIndex 
                        ? '100%' 
                        : i === currentVideoIndex 
                          ? (progressoAtual * 100) + '%' 
                          : '0%'};">
        </span>
      </span>
    {/each}
  </div>
{/if}

{#if !audioUnlocked && videos.length > 0}
  <button on:click={liberarAudio} class="botao-ativar-som">
    Ativar som da transmissão
  </button>
{/if}

<div id="player-wrapper" class="player-globo" bind:this={playerElement}></div>


<style>
  /* --- CARREGANDO A FONTE GLOBOTIPO --- */
  @font-face {
    font-family: 'Globotipo';
    src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
    font-weight: 900;
    font-style: normal;
  }

  /* Caixa "Vídeos em alta" */
  .caixa-topo-fixa {
    position: fixed;
    top: 50px;
    right: 5%;
    background-color: white;
    color: #c4170c;
    border: 3px solid #c4170c;
    padding: 10px 25px;
    border-radius: 8px;
    font-family: 'Globotipo', Arial, Helvetica, sans-serif;
    font-weight: 900;
    font-size: 2.5rem;
    z-index: 25;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }
  
  /* Cartela Intercalada */
  .cartela-destaque {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/g1/g1tv/videosmaisvistos2.jpg');
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    z-index: 100;
    color: white;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }
  .cartela-destaque.fade-in { opacity: 1; }
  .cartela-destaque.fade-out { opacity: 0; }

  .texto-animado {
    font-family: 'Globotipo', Arial, Helvetica, sans-serif;
    text-align: left;
    padding: 15vh 8vw 0 7.5vw;
    font-size: 6rem;
    font-weight: 900;
    line-height: 1.1;
    text-transform: uppercase;
  }
  .palavra {
    display: block;
    opacity: 0;
    transform: translateY(50px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }
  .cartela-destaque.fade-in .palavra {
    opacity: 1;
    transform: translateY(0);
  }

  /* Indicadores de "Stories" */
  .indicador-videos-stories {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    gap: 5px;
    z-index: 20;
    padding: 16px 3vw;
    box-sizing: border-box;
    pointer-events: none;
  }
  .traco-story {
    flex: 1 1 0;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
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

  /* Botão de Ativar Som */
  .botao-ativar-som {
    position: fixed;
    z-index: 999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border: 2px solid white;
    border-radius: 8px;
    cursor: pointer;
    font-family: Arial, sans-serif;
  }
  
  /* Wrapper do Player */
  .player-globo {
    background: #232323;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
  }
  .player-globo :global(video),
  .player-globo :global(iframe) {
    object-fit: contain;
  }

  /* Media Query para Telas Menores */
  @media (max-width: 700px) {
    .texto-animado {
      font-size: 3.125rem;
      padding-left: 5vw;
      padding-right: 5vw;
    }
    .caixa-topo-fixa {
      font-size: 1.5rem;
      padding: 8px 15px;
      top: 35px;
    }
    .indicador-videos-stories {
      padding-top: 10px;
    }
  }
</style>