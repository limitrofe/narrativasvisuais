<script>
  import { onMount, onDestroy } from 'svelte';
  import Papa from 'papaparse';
  import GloboPlayer from './GloboPlayer.svelte'; // ✅ Importa o componente GloboPlayer (nome corrigido)

  export let sheetsUrl = ""; // URL do CSV com os videoIds
  export let autoPlay = true; // Se os vídeos devem começar a tocar automaticamente
  export let startMuted = false; // Se os vídeos devem começar mutados (será controlado por audioUnlocked)
  export let skipDFP = false; // Se deve pular anúncios DFP
  export let controls = true; // Se os controles do player devem ser exibidos
  export let thumbsBaseUrl = "/thumbs"; // URL base para as imagens de thumbnail

  let videos = []; // Array que armazenará os objetos de vídeo (com videoId)
  let currentIndex = 0; // Índice do vídeo atualmente visível/ativo
  let currentVideoId = ''; // O ID do vídeo da Globo que está sendo passado para o GloboPlayer
  let audioUnlocked = false; // Flag para controlar se o áudio foi liberado pelo usuário
  let updateIntervalId; // ID para o setInterval da atualização automática do CSV

  // Variáveis para detecção de swipe (toque/arraste)
  let touchStartY = 0; // Posição Y inicial do toque/clique
  let isSwiping = false; // Flag para indicar que um gesto de arrastar está em progresso
  let isAnimatingTransition = false; // Flag para evitar que múltiplos swipes acionem várias transições ao mesmo tempo
  const SWIPE_THRESHOLD = 50; // Mínimo de pixels de deslocamento para considerar um swipe válido

  let carouselContainer; // Referência ao elemento HTML principal do carrossel para anexar listeners de eventos

  // Função para buscar os IDs dos vídeos de um CSV remoto
  async function fetchVideos() {
    console.log("ReelsPlayer: Iniciando busca de vídeos do CSV...");
    try {
        const response = await fetch(sheetsUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ao buscar CSV.`);
        }
        const csvText = await response.text();
        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true, // Assume que a primeira linha do CSV é o cabeçalho
                complete: res => {
                    // Filtra linhas que não têm 'videoId' ou que têm 'videoId' vazio
                    const fetchedVideos = res.data.filter(v => v.videoId && v.videoId.trim() !== ''); 
                    console.log("ReelsPlayer: Vídeos encontrados no CSV:", fetchedVideos);
                    if (fetchedVideos.length === 0) {
                        console.warn("ReelsPlayer: Nenhum vídeo válido encontrado no CSV após filtragem.");
                    }
                    resolve(fetchedVideos);
                },
                error: err => {
                    console.error("ReelsPlayer: Erro ao parsear CSV com PapaParse:", err);
                    reject(err);
                }
            });
        });
    } catch (error) {
        console.error("ReelsPlayer: Erro ao buscar o arquivo CSV:", error);
        return []; // Retorna um array vazio em caso de erro para evitar quebrar o app
    }
  }

  // Função para liberar o áudio do player após uma interação do usuário (clique no botão)
  function liberarAudio() {
    audioUnlocked = true;
    console.log("ReelsPlayer: Áudio desbloqueado pelo usuário.");
    // Quando `audioUnlocked` se torna true, a prop `startMuted` passada para o `GloboPlayer` será `false`.
    // O `GloboPlayer` então tentará desmutar e reproduzir o vídeo ativo.
  }

  // Função principal para mudar o vídeo e controlar a animação de transição
  async function changeVideo(direction) {
    // Impede múltiplas transições simultâneas ou se não houver vídeos
    if (isAnimatingTransition || videos.length === 0) {
        console.log("ReelsPlayer: Bloqueando changeVideo. isAnimatingTransition:", isAnimatingTransition, "videos.length:", videos.length);
        return;
    }

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % videos.length; // Loop para o próximo vídeo
    } else { // 'prev' (vídeo anterior)
      newIndex = (currentIndex - 1 + videos.length) % videos.length; // Loop para o vídeo anterior
      // O `+ videos.length` garante que o resultado do `%` seja sempre positivo, mesmo se `currentIndex - 1` for -1
    }

    // Se só há um vídeo e a tentativa é mudar para o mesmo vídeo, e não é um loop forçado, não faz nada
    if (videos.length === 1 && newIndex === currentIndex && direction !== 'force_loop') {
        console.log("ReelsPlayer: Apenas um vídeo, não há para onde ir (exceto loop forçado).");
        return;
    }
    
    // Especial para quando há apenas um vídeo e ele termina, ou o usuário tenta ir para o próximo/anterior
    // Isso forçará o `GloboPlayer` a ser recriado e o vídeo a reiniciar.
    if (videos.length === 1 && newIndex === currentIndex && direction === 'next') { // Assumimos que 'ended' chama 'next'
        console.log("ReelsPlayer: Apenas um vídeo, looping para o mesmo. Forçando recriação do Player.");
        isAnimatingTransition = true; // Bloqueia swipes durante este "ciclo"
        currentVideoId = ''; // Zera o ID para forçar a remoção do PlayerGlobo
        await new Promise(r => setTimeout(r, 10)); // Pequeno delay
        currentIndex = newIndex; // Atualiza o índice para o mesmo (0)
        // currentVideoId será reativado pelo bloco $: abaixo, recriando o GloboPlayer
        isAnimatingTransition = false;
        return;
    }

    isAnimatingTransition = true; // Bloqueia novos swipes durante a animação
    console.log(`ReelsPlayer: Iniciando transição para ${direction}. Novo índice: ${newIndex}`);

    // Reativa a transição CSS no container do carrossel. Isso faz com que o `transform`
    // do `currentIndex` seja animado para a nova posição.
    if (carouselContainer) {
        carouselContainer.style.transition = 'transform 0.5s ease-in-out';
    }
    
    // Atualiza o `currentIndex`. Isso faz com que o estilo `transform` no HTML (`style="transform: translateY(-{currentIndex * 100}vh);"`)
    // seja aplicado, movendo o carrossel de thumbnails.
    currentIndex = newIndex;

    // Aguarda a duração da transição CSS antes de permitir novos swipes
    await new Promise(resolve => setTimeout(resolve, 500)); // Deve corresponder à duração no CSS

    isAnimatingTransition = false; // Libera novos swipes
    console.log("ReelsPlayer: Transição concluída. isAnimatingTransition:", isAnimatingTransition);

    // O `currentVideoId` é atualizado reativamente pelo bloco `$:`, o que, por sua vez,
    // faz com que o Svelte recrie o componente `GloboPlayer` com o novo `videoId` devido ao `key={currentVideoId}`.
  }

  // Função chamada quando o evento 'ended' é recebido do GloboPlayer
  function handleVideoEnded() {
    console.log("ReelsPlayer: Evento 'ended' recebido do GloboPlayer. Chamando changeVideo('next').");
    changeVideo('next');
  }

  // --- Funções para Detecção de Swipe (Toque/Arrastar no Mobile e Mouse) ---
  function handleTouchStart(event) {
    if (isAnimatingTransition || videos.length === 0) return;
    isSwiping = true;
    // Captura a posição Y inicial do toque (para mobile) ou clique (para mouse)
    touchStartY = event.touches ? event.touches[0].clientY : event.clientY;
    console.log("ReelsPlayer: Touch/Mouse start. StartY:", touchStartY);
    // Remove qualquer transição CSS para permitir que o carrossel seja arrastado diretamente com o dedo
    if (carouselContainer) {
      carouselContainer.style.transition = 'none';
    }
  }

  function handleTouchMove(event) {
    // Só prossegue se um swipe estiver ativo e não houver transição animada em progresso
    if (!isSwiping || isAnimatingTransition || videos.length === 0) return;
    // Captura a posição Y atual do toque/clique
    const currentY = event.touches ? event.touches[0].clientY : event.clientY;
    const deltaY = currentY - touchStartY; // Calcula a distância vertical arrastada

    // Aplica o `transform` diretamente para o efeito de "arrastar o vídeo junto com o dedo"
    // `(-currentIndex * 100)` é a posição base do slide atual.
    // `(deltaY / window.innerHeight * 100)` converte o deslocamento em pixels para `vh` (viewport height).
    if (carouselContainer) {
      carouselContainer.style.transform = `translateY(${-currentIndex * 100 + (deltaY / window.innerHeight * 100)}vh)`;
    }
    
    // ✅ CRUCIAL: Impede o comportamento de rolagem nativa do navegador.
    // Isso garante que o arrastar do dedo seja interpretado como swipe do player, não como scroll da página.
    event.preventDefault(); 
  }

  function handleTouchEnd(event) {
    if (!isSwiping || isAnimatingTransition || videos.length === 0) return;
    isSwiping = false;

    // Captura a posição Y final do toque/clique
    const currentY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
    const deltaY = currentY - touchStartY; // Calcula o deslocamento total do swipe

    // Reativa a transição CSS no container do carrossel para o "snap" final
    if (carouselContainer) {
      carouselContainer.style.transition = 'transform 0.5s ease-in-out';
    }

    // Verifica se o deslocamento foi suficiente para ser considerado um swipe válido
    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      if (deltaY < 0) { // Swipe para cima (deltaY negativo) -> Próximo vídeo
        console.log("ReelsPlayer: Swipe para cima detectado. Chamando changeVideo('next').");
        changeVideo('next');
      } else { // Swipe para baixo (deltaY positivo) -> Vídeo anterior
        console.log("ReelsPlayer: Swipe para baixo detectado. Chamando changeVideo('prev').");
        changeVideo('prev');
      }
    } else {
      // Se o swipe foi muito curto, retorna o carrossel para a posição do vídeo atual
      console.log("ReelsPlayer: Swipe muito curto, retornando à posição original.");
      if (carouselContainer) {
        carouselContainer.style.transform = `translateY(-${currentIndex * 100}vh)`;
      }
    }
    // Reseta a posição inicial para o próximo swipe
    touchStartY = 0;
  }

  // --- Funções para Detecção de Scroll do Mouse (Wheel) ---
  function handleWheel(event) {
    // ✅ CRUCIAL: Impede o comportamento de rolagem nativa do navegador.
    event.preventDefault(); 
    if (isAnimatingTransition || videos.length === 0) return;

    // `event.deltaY` é positivo para scroll para baixo, negativo para scroll para cima.
    // Usamos SWIPE_THRESHOLD também para a roda do mouse, para evitar transições acidentais com scrolls muito pequenos.
    if (event.deltaY > SWIPE_THRESHOLD) { // Scroll para baixo (próximo vídeo)
      console.log("ReelsPlayer: Scroll para baixo detectado. Chamando changeVideo('next').");
      changeVideo('next');
    } else if (event.deltaY < -SWIPE_THRESHOLD) { // Scroll para cima (vídeo anterior)
      console.log("ReelsPlayer: Scroll para cima detectado. Chamando changeVideo('prev').");
      changeVideo('prev');
    }
  }

  // Função para verificar e atualizar a lista de vídeos do CSV automaticamente
  async function startAutoUpdate(intervalMinutes = 5) {
    if (updateIntervalId) {
      clearInterval(updateIntervalId); // Limpa qualquer intervalo anterior para evitar duplicidade
    }

    updateIntervalId = setInterval(async () => {
      console.log("ReelsPlayer: Verificando atualizações na lista de vídeos...");
      try {
        const newVideos = await fetchVideos(); // Busca a lista atualizada do CSV

        // Compara a nova lista com a lista atual para ver se houve mudanças
        if (JSON.stringify(newVideos) !== JSON.stringify(videos)) {
          console.log("ReelsPlayer: Lista de vídeos atualizada! Recarregando player se necessário...");
          videos = newVideos; // Atualiza a lista de vídeos
          // Reinicia a playlist para o primeiro vídeo após a atualização da lista
          currentIndex = 0; 
          // O `currentVideoId` será atualizado reativamente pelo bloco `$:`,
          // o que fará o `GloboPlayer` recarregar o primeiro vídeo da nova lista.
        } else {
          console.log("ReelsPlayer: Lista de vídeos não sofreu alterações.");
        }
      } catch (error) {
        console.error("ReelsPlayer: Erro ao buscar vídeos na atualização automática:", error);
      }
    }, intervalMinutes * 60 * 1000); // Converte minutos para milissegundos
  }

  // Hook de ciclo de vida do Svelte: chamado quando o componente é montado no DOM.
  onMount(async () => {
    videos = await fetchVideos(); // Busca a lista inicial de vídeos ao montar

    if (videos.length === 0) {
      console.warn("ReelsPlayer: Nenhum vídeo encontrado na URL do Sheets. Não é possível iniciar o player.");
      return;
    }

    // Define o índice inicial para 0 (o primeiro vídeo da lista)
    currentIndex = 0; 
    // O `currentVideoId` será atualizado reativamente pelo bloco `$:`, que então
    // passará para o `GloboPlayer`.

    // Anexa os listeners de eventos de swipe (touch e mouse) e wheel (scroll do mouse)
    // ao container principal do carrossel.
    if (carouselContainer) { // Garante que o elemento HTML já esteja disponível
        carouselContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
        carouselContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        carouselContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
        carouselContainer.addEventListener('mousedown', handleTouchStart, { passive: false });
        carouselContainer.addEventListener('mousemove', handleTouchMove, { passive: false });
        carouselContainer.addEventListener('mouseup', handleTouchEnd, { passive: false });
        carouselContainer.addEventListener('mouseleave', handleTouchEnd, { passive: false }); // Para mouse arrastar e soltar fora da área
        carouselContainer.addEventListener('wheel', handleWheel, { passive: false });
        console.log("ReelsPlayer: Listeners de swipe/wheel anexados.");
    } else {
        console.error("ReelsPlayer: carouselContainer não disponível no onMount para anexar listeners.");
    }
    
    // Carrega o script da API do player da Globo.
    // É uma boa prática carregar este script uma única vez no ponto de entrada da sua aplicação
    // (ex: `+page.svelte`), mas deixei aqui por autoconveniência do componente.
    if (!window.WM) {
      console.log("ReelsPlayer: Iniciando carregamento do script WM.Player API...");
      const script = document.createElement('script');
      script.src = 'https://s3.glbimg.com/v1/AUTH_e1b09a2d222b4900a437a46914be81e5/api/stable/web/api.min.js';
      script.async = true;
      script.onload = () => {
        window.WM.playerAvailable.then(() => {
          console.log("ReelsPlayer: Globo Player API script carregado e pronto.");
          startAutoUpdate(5); // Inicia a atualização automática da lista de vídeos
        }).catch(e => console.error("ReelsPlayer: Erro ao inicializar Globo Player API após load:", e));
      };
      script.onerror = (e) => console.error("ReelsPlayer: Falha ao carregar script do Player Globo API!", e);
      document.body.appendChild(script);
    } else {
      console.log("ReelsPlayer: Globo Player API já carregado e pronto.");
      startAutoUpdate(5); // Inicia a atualização automática da lista de vídeos
    }
  });

  // Hook de ciclo de vida do Svelte: chamado quando o componente é removido do DOM.
  onDestroy(() => {
    console.log("ReelsPlayer: Componente desmontado. Limpando intervalos e listeners.");
    if (updateIntervalId) {
      clearInterval(updateIntervalId); // Limpa o intervalo de atualização
    }
    // Remove todos os listeners de eventos para evitar vazamentos de memória
    if (carouselContainer) {
        carouselContainer.removeEventListener('touchstart', handleTouchStart);
        carouselContainer.removeEventListener('touchmove', handleTouchMove);
        carouselContainer.removeEventListener('touchend', handleTouchEnd);
        carouselContainer.removeEventListener('mousedown', handleTouchStart);
        carouselContainer.removeEventListener('mousemove', handleTouchMove);
        carouselContainer.removeEventListener('mouseup', handleTouchEnd);
        carouselContainer.removeEventListener('mouseleave', handleTouchEnd);
        carouselContainer.removeEventListener('wheel', handleWheel);
    }
  });

  // ✅ Bloco reativo Svelte: Sempre que `videos.length`, `currentIndex`, ou `videos[currentIndex]` mudar,
  // esta linha será executada para atualizar o `currentVideoId`.
  // Isso é o que faz o `GloboPlayer` ser recriado com o novo vídeo.
  $: if (videos.length > 0 && currentIndex !== undefined && videos[currentIndex]?.videoId) {
    currentVideoId = videos[currentIndex].videoId;
    console.log(`ReelsPlayer: currentVideoId atualizado reativamente para ${currentVideoId} (índice ${currentIndex}).`);
  } else if (videos.length === 0) {
    currentVideoId = ''; // Zera o videoId se não houver vídeos
    console.log("ReelsPlayer: currentVideoId zerado - sem vídeos para exibir.");
  }
</script>

{#if !audioUnlocked}
  <button on:click={liberarAudio} style="position:fixed;z-index:999;top:2rem;left:2rem;padding:1rem 2rem;font-size:1.2rem; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Ativar som da transmissão</button>
{/if}

<div class="video-carousel-wrapper" bind:this={carouselContainer}>
  <div class="video-carousel" style="transform: translateY(-{currentIndex * 100}vh);">
    {#each videos as videoData, index (videoData.videoId)} <div class="video-slide">
        <img src="{thumbsBaseUrl}/{videoData.videoId}.jpg" alt="Thumbnail do vídeo {videoData.videoId}" class="video-thumbnail"/>
      </div>
    {/each}
  </div>

  <div class="player-overlay">
    {#if currentVideoId}
      <GloboPlayer
        key={currentVideoId} videoId={currentVideoId}
        autoPlay={autoPlay}
        startMuted={!audioUnlocked} skipDFP={skipDFP}
        controls={controls}
        on:ended={handleVideoEnded} />
    {:else}
      <p class="loading-message">Carregando vídeos...</p>
    {/if}
  </div>
</div>

<style>
  /* Garante que o body não tenha scroll */
  :global(body) {
    overflow: hidden;
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
  }

  /* Contêiner principal que gerencia o overflow e as dimensões */
  .video-carousel-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden; /* Corta as slides que estão fora da tela */
    background: #000;
    cursor: grab; /* Indica arrastabilidade */
  }

  .video-carousel-wrapper:active {
      cursor: grabbing;
  }

  /* O contêiner de todas as slides, que será animado.
     Ele se move verticalmente para mostrar o slide correto. */
  .video-carousel {
    display: flex;
    flex-direction: column;
    height: 100%; /* Ocupa 100% da altura do wrapper */
    /* A transição é controlada via JS (handleTouchEnd, changeVideo) para o "snap" */
    transition: transform 0.5s ease-in-out; /* Duração padrão para o snap */
    will-change: transform; /* Otimização de performance para animações */
  }

  /* Cada slide individual dentro do carrossel (contém a thumbnail) */
  .video-slide {
    flex-shrink: 0; /* Impede que os itens encolham */
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #232323; /* Fundo para se a thumb não cobrir tudo */
  }

  .video-thumbnail {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; /* Garante que a imagem caiba dentro do slide */
    filter: brightness(50%); /* Escurece a thumbnail para o player se destacar */
    display: block; /* Remove espaço extra abaixo da imagem */
  }

  /* Camada de overlay para o player da Globo. Fica fixa no centro da tela. */
  .player-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto; /* Permite interação com o player (controles, mute, etc.) */
    z-index: 10; /* Garante que esteja acima das thumbnails de fundo */
  }

  .loading-message {
      color: white;
      font-size: 1.5rem;
      text-align: center;
      padding: 20px;
  }
</style>