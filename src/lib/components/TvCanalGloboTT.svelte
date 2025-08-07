<script>
  import { onMount, onDestroy } from 'svelte';
  import Papa from 'papaparse';

  export let sheetsUrl = ""; // CSV com videoId
  export let autoPlay = true;
  export let startMuted = false;
  export let skipDFP = true;
  export let controls = true;

  let videos = [];
  let currentIndex = 0; // Index do vídeo atual
  let nextIndex = 1;    // Index do próximo vídeo a ser pré-carregado

  let playerInstanceA; // Instância do player para o slot A
  let playerElementA;  // Elemento DOM para o slot A

  let playerInstanceB; // Instância do player para o slot B
  let playerElementB;  // Elemento DOM para o slot B

  let activePlayerSlot = 'A'; // Qual slot está ativo ('A' ou 'B')

  let audioUnlocked = false;
  let updateIntervalId;

  // Variáveis para detecção de swipe
  let startY = 0;
  let endY = 0;
  let isSwiping = false;
  const SWIPE_THRESHOLD = 50; // Mínimo de pixels para considerar um swipe válido

  // Elemento para o qual os listeners de touch/mouse serão anexados
  let swipeAreaElement;


  // Busca os IDs dos vídeos do CSV
  async function fetchVideos() {
    return new Promise((resolve, reject) => {
      Papa.parse(sheetsUrl, {
        download: true,
        header: true,
        complete: res => resolve(res.data.filter(v => v.videoId)),
        error: reject
      });
    });
  }

  // Função para liberar o áudio após interação do usuário
  function liberarAudio() {
    audioUnlocked = true;
    const currentInstance = activePlayerSlot === 'A' ? playerInstanceA : playerInstanceB;
    if (currentInstance) {
      try {
        currentInstance.unmute && currentInstance.unmute();
        currentInstance.play && currentInstance.play();
      } catch (e) {
        console.error("Erro ao tentar liberar áudio:", e);
      }
    }
  }

  function createAndLoadPlayer(videoIdToPlay, targetElement, isPreloading = false) {
    if (typeof window === 'undefined' || !window.WM || !window.WM.Player) {
      console.warn("WM.Player não está disponível ou ambiente não é de navegador.");
      return null;
    }

    let instanceToDestroy = null;
    if (targetElement === playerElementA) {
        instanceToDestroy = playerInstanceA;
    } else if (targetElement === playerElementB) {
        instanceToDestroy = playerInstanceB;
    }

    if (instanceToDestroy && instanceToDestroy.destroy) {
      instanceToDestroy.destroy();
    }

    const config = {
      source: Number(videoIdToPlay),
      autoPlay: autoPlay && !isPreloading,
      startMuted: !audioUnlocked || isPreloading,
      skipDFP: skipDFP,
      controls: controls,
      width: '100%',
      height: '100vh'
    };

    const newInstance = new window.WM.Player(config);
    newInstance.attachTo(targetElement);

    if (targetElement === playerElementA) {
        playerInstanceA = newInstance;
    } else if (targetElement === playerElementB) {
        playerInstanceB = newInstance;
    }

    // Listener 'ended' apenas para o player ativo
    newInstance.on('ended', () => {
        if (targetElement === (activePlayerSlot === 'A' ? playerElementA : playerElementB)) {
            startTransition('next'); // Inicia a transição para o próximo vídeo
        }
    });

    setTimeout(() => {
      try {
        if (!isPreloading && audioUnlocked) {
          newInstance.unmute && newInstance.unmute();
          newInstance.play && newInstance.play();
        }
      } catch (e) {
        console.error("Erro ao tentar reproduzir vídeo:", e);
      }
    }, 80);

    return newInstance;
  }

  // Função principal para iniciar a transição
  async function startTransition(direction = 'next') {
    if (videos.length < 2) {
        // Não há vídeos suficientes para transição animada
        nextVideoSimple(direction);
        return;
    }

    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    const nextIdx = (currentIndex + 1) % videos.length;

    let targetVideoId;
    let newCurrentIndex;

    if (direction === 'next') {
        targetVideoId = videos[nextIdx].videoId;
        newCurrentIndex = nextIdx;
    } else { // 'prev'
        targetVideoId = videos[prevIndex].videoId;
        newCurrentIndex = prevIndex;
    }

    const currentSlotElement = activePlayerSlot === 'A' ? playerElementA : playerElementB;
    const nextSlotElement = activePlayerSlot === 'A' ? playerElementB : playerElementA;

    // Remove classes de animação anteriores se houver
    currentSlotElement.classList.remove('slide-out', 'slide-in-prev');
    nextSlotElement.classList.remove('slide-out', 'slide-in-prev');

    // Posiciona o próximo slot para a direção correta antes da animação
    if (direction === 'next') {
        nextSlotElement.style.transform = 'translateY(100%)'; // Inicia de baixo
        currentSlotElement.classList.add('slide-out'); // Sai para cima
        nextSlotElement.classList.add('slide-in'); // Entra de baixo
    } else { // 'prev'
        nextSlotElement.style.transform = 'translateY(-100%)'; // Inicia de cima
        currentSlotElement.classList.add('slide-out-prev'); // Sai para baixo
        nextSlotElement.classList.add('slide-in-prev'); // Entra de cima
    }

    // Carrega o próximo vídeo no slot "oculto"
    createAndLoadPlayer(targetVideoId, nextSlotElement, true);

    // Espera a duração da transição CSS
    await new Promise(resolve => setTimeout(resolve, 500)); // Ajuste para a duração do seu CSS transition

    // Atualiza o índice e o slot ativo
    currentIndex = newCurrentIndex;
    activePlayerSlot = activePlayerSlot === 'A' ? 'B' : 'A';

    // Remove as classes de animação e reseta posições para o próximo ciclo
    currentSlotElement.classList.remove('slide-out', 'slide-out-prev');
    nextSlotElement.classList.remove('slide-in', 'slide-in-prev');

    // Assegura que o slot que não está ativo esteja na posição de pré-carregamento (fora da tela)
    if (activePlayerSlot === 'A') {
        playerElementB.style.transform = 'translateY(100%)';
    } else {
        playerElementA.style.transform = 'translateY(100%)';
    }


    // Garante que o player que acabou de "entrar" esteja tocando e desmutado (se aplicável)
    const newCurrentPlayerInstance = activePlayerSlot === 'A' ? playerInstanceA : playerInstanceB;
    if (newCurrentPlayerInstance) {
        if (audioUnlocked) {
            newCurrentPlayerInstance.unmute && newCurrentPlayerInstance.unmute();
        }
        newCurrentPlayerInstance.play && newCurrentPlayerInstance.play();
    }

    // Pré-carrega o próximo vídeo no slot que saiu, pronto para o próximo swipe
    const videoToPreloadIndex = (currentIndex + 1) % videos.length;
    const videoToPreloadId = videos[videoToPreloadIndex].videoId;
    const targetElementForPreload = activePlayerSlot === 'A' ? playerElementB : playerElementA;
    createAndLoadPlayer(videoToPreloadId, targetElementForPreload, true);
  }

  // Função simples para avançar vídeo sem animação (fallback ou para menos de 2 vídeos)
  function nextVideoSimple(direction = 'next') {
    if (videos.length === 0) return;

    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % videos.length;
    } else { // 'prev'
      currentIndex = (currentIndex - 1 + videos.length) % videos.length; // + videos.length para lidar com negativos
    }

    const currentVideoId = videos[currentIndex].videoId;
    const currentSlotElement = activePlayerSlot === 'A' ? playerElementA : playerElementB;
    createAndLoadPlayer(currentVideoId, currentSlotElement); // Recarrega o player atual sem transição

    // Se tiver mais de um vídeo, pré-carrega o próximo
    if (videos.length > 1) {
        const nextVideoId = videos[(currentIndex + 1) % videos.length].videoId;
        const nextSlotElement = activePlayerSlot === 'A' ? playerElementB : playerElementA;
        createAndLoadPlayer(nextVideoId, nextSlotElement, true);
    }
  }

  async function startAutoUpdate(intervalMinutes = 5) {
    if (updateIntervalId) {
      clearInterval(updateIntervalId);
    }

    updateIntervalId = setInterval(async () => {
      console.log("Verificando atualizações na lista de vídeos...");
      try {
        const newVideos = await fetchVideos();

        if (JSON.stringify(newVideos) !== JSON.stringify(videos)) {
          console.log("Lista de vídeos atualizada! Recarregando player se necessário...");
          videos = newVideos;
          // Reinicia a playlist e a transição do primeiro vídeo
          currentIndex = 0;
          activePlayerSlot = 'A';
          if (videos.length > 0) {
            createAndLoadPlayer(videos[currentIndex].videoId, playerElementA);
            if (videos.length > 1) {
              createAndLoadPlayer(videos[(currentIndex + 1) % videos.length].videoId, playerElementB, true);
            }
          } else {
            console.warn("Nenhum vídeo encontrado após a atualização.");
          }
        } else {
          console.log("Lista de vídeos não sofreu alterações.");
        }
      } catch (error) {
        console.error("Erro ao buscar vídeos na atualização:", error);
      }
    }, intervalMinutes * 60 * 1000);
  }

  // --- Funções de Swipe ---
  function handleTouchStart(event) {
    isSwiping = true;
    startY = event.touches ? event.touches[0].clientY : event.clientY;
  }

  function handleTouchMove(event) {
    if (!isSwiping) return;
    endY = event.touches ? event.touches[0].clientY : event.clientY;

    // ESSA LINHA É A CHAVE! Evita o scroll nativo da página.
    // Use com cautela: se houver outro conteúdo rolável na página, ele será afetado.
    event.preventDefault(); 
  }
  function handleTouchEnd() {
    if (!isSwiping) return;
    isSwiping = false;

    const deltaY = endY - startY;

    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      if (deltaY < 0) { // Swipe para cima (próximo vídeo)
        startTransition('next');
      } else { // Swipe para baixo (vídeo anterior)
        startTransition('prev');
      }
    }
    // Reseta as posições para o próximo swipe
    startY = 0;
    endY = 0;
  }

  onMount(async () => {
    videos = await fetchVideos();

    if (videos.length === 0) {
      console.warn("Nenhum vídeo encontrado na URL do Sheets.");
      return;
    }

    // Anexa os listeners de swipe ao elemento principal
    swipeAreaElement.addEventListener('touchstart', handleTouchStart);
    swipeAreaElement.addEventListener('touchmove', handleTouchMove);
    swipeAreaElement.addEventListener('touchend', handleTouchEnd);
    swipeAreaElement.addEventListener('mousedown', handleTouchStart);
    swipeAreaElement.addEventListener('mousemove', handleTouchMove);
    swipeAreaElement.addEventListener('mouseup', handleTouchEnd);
    swipeAreaElement.addEventListener('mouseleave', handleTouchEnd); // Para mouse fora da área

    if (!window.WM) {
      const script = document.createElement('script');
      script.src = 'https://s3.glbimg.com/v1/AUTH_e1b09a2d222b4900a437a46914be81e5/api/stable/web/api.min.js';
      script.async = true;
      script.onload = () => {
        window.WM.playerAvailable.then(() => {
          createAndLoadPlayer(videos[currentIndex].videoId, playerElementA);
          if (videos.length > 1) {
            nextIndex = (currentIndex + 1) % videos.length;
            createAndLoadPlayer(videos[nextIndex].videoId, playerElementB, true);
          }
          startAutoUpdate(5);
        });
      };
      document.body.appendChild(script);
    } else {
      window.WM.playerAvailable.then(() => {
        createAndLoadPlayer(videos[currentIndex].videoId, playerElementA);
        if (videos.length > 1) {
          nextIndex = (currentIndex + 1) % videos.length;
          createAndLoadPlayer(videos[nextIndex].videoId, playerElementB, true);
        }
        startAutoUpdate(5);
      });
    }
  });

  onDestroy(() => {
    if (playerInstanceA?.destroy) {
      playerInstanceA.destroy();
    }
    if (playerInstanceB?.destroy) {
      playerInstanceB.destroy();
    }
    if (updateIntervalId) {
      clearInterval(updateIntervalId);
    }
    // Remove os listeners de swipe ao destruir o componente
    if (swipeAreaElement) {
        swipeAreaElement.removeEventListener('touchstart', handleTouchStart);
        swipeAreaElement.removeEventListener('touchmove', handleTouchMove);
        swipeAreaElement.removeEventListener('touchend', handleTouchEnd);
        swipeAreaElement.removeEventListener('mousedown', handleTouchStart);
        swipeAreaElement.removeEventListener('mousemove', handleTouchMove);
        swipeAreaElement.removeEventListener('mouseup', handleTouchEnd);
        swipeAreaElement.removeEventListener('mouseleave', handleTouchEnd);
    }
  });
</script>

{#if !audioUnlocked}
  <button on:click={liberarAudio} style="position:fixed;z-index:999;top:2rem;left:2rem;padding:1rem 2rem;font-size:1.2rem; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Ativar som da transmissão</button>
{/if}

<div class="video-carousel" bind:this={swipeAreaElement}>
  <div class="player-slot" bind:this={playerElementA} class:video-slot-active={activePlayerSlot === 'A'} class:video-slot-next={activePlayerSlot === 'B'}></div>
  <div class="player-slot" bind:this={playerElementB} class:video-slot-active={activePlayerSlot === 'B'} class:video-slot-next={activePlayerSlot === 'A'}></div>
</div>

---

<style>
  /* Contêiner principal para os slots de vídeo */
  .video-carousel {
    position: fixed; /* Ocupa a tela toda */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden; /* CRUCIAL para esconder o vídeo que está fora da tela */
    background: #232323; /* Cor de fundo */
    cursor: grab; /* Indica que é arrastável */
  }

  .video-carousel:active {
      cursor: grabbing;
  }

  /* Estilo base para cada slot de vídeo */
  .player-slot {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease-in-out; /* Duração e tipo da animação */
    background: #232323; /* Fundo do slot */
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: transform; /* Otimização para animação */
  }

  /* O slot que está ativo (visível na tela) */
  .player-slot.video-slot-active {
    transform: translateY(0);
    z-index: 2; /* Garante que esteja acima do outro durante a transição */
  }

  /* O slot que está esperando para ser o próximo (abaixo da tela) */
  .player-slot.video-slot-next {
    transform: translateY(100%); /* Começa 100% da altura da tela abaixo */
    z-index: 1;
  }

  /* CLASSES DE TRANSIÇÃO (adicionadas/removidas via JavaScript) */

  /* Quando o slot ativo precisa sair para cima (swipe para NEXT) */
  .player-slot.slide-out {
    transform: translateY(-100%); /* Move 100% da altura para cima */
  }

  /* Quando o slot "next" precisa entrar vindo de baixo (swipe para NEXT) */
  .player-slot.slide-in {
    transform: translateY(0); /* Move para a posição central (0) */
  }

  /* NOVAS CLASSES: Quando o slot ativo precisa sair para baixo (swipe para PREV) */
  .player-slot.slide-out-prev {
      transform: translateY(100%); /* Move 100% da altura para baixo */
  }

  /* NOVAS CLASSES: Quando o slot "next" precisa entrar vindo de cima (swipe para PREV) */
  .player-slot.slide-in-prev {
      transform: translateY(0); /* Move para a posição central (0) */
  }

  /* Estilos para o player da Globo dentro dos slots */
  /* ':global' é necessário porque o player injeta seu próprio HTML/iframe */
  .player-slot :global(.clappr-player[data-player]),
  .player-slot :global(iframe),
  .player-slot :global(video) {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    object-fit: contain; /* Garante que o vídeo caiba sem cortar */
    background: #232323;
  }
</style>