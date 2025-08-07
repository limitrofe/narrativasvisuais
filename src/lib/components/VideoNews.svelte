<script>
  import { onMount, onDestroy } from 'svelte';

  export let videoId;
  export let videoUrl = ''; // Mantido para detecção inicial se a URL direta for conhecida
  export let autoPlay = true;
  export let startMuted = true;
  export let skipDFP = false;
  export let ga4 = null;
  export let full = false;
  export let noticiasUrl = '/noticias.json';

  let playerElement;
  let playerInstance;
  let noticias = [];
  let tickerOffset = 0;
  let tickerInterval;
  
  // Variáveis reativas para a proporção do vídeo ATUALMENTE carregado no player
  // Default 16/9 para iniciar como horizontal.
  let currentVideoIsVertical = false;
  let currentVideoAspectRatio = 16/9; 

  // Classe dinâmica para o player-content, baseada na proporção
  $: playerContainerClass = currentVideoIsVertical ? 'is-vertical' : 'is-horizontal';

  let proportionReady = false; 
  let playerObserver; 

  // Função para detectar proporção via URL direta do vídeo (fallback/alternativa)
  function checkVideoAspect(src) {
    return new Promise((resolve, reject) => {
      if (!src || (!src.endsWith('.mp4') && !src.includes('.m3u8') && !src.includes('.webm') && !src.includes('.ogg'))) {
        console.warn('checkVideoAspect: URL não parece ser de vídeo direta ou está vazia. Pulando detecção.', src);
        return reject(new Error('URL inválida ou não direta para detecção.'));
      }

      const v = document.createElement('video');
      v.src = src;
      v.crossOrigin = "anonymous"; 
      v.muted = true;
      v.playsInline = true;
      v.preload = "metadata";

      let timeout = setTimeout(() => {
        console.warn('checkVideoAspect: Timeout ao carregar metadata da URL:', src);
        v.removeEventListener('loadedmetadata', onLoadedMetadata);
        v.removeEventListener('error', onError);
        reject(new Error('Timeout ao carregar metadata.'));
      }, 10000); 

      const onLoadedMetadata = () => {
        clearTimeout(timeout);
        console.log(`checkVideoAspect SUCESSO: ${v.videoWidth}x${v.videoHeight} para ${src}`);
        v.removeEventListener('loadedmetadata', onLoadedMetadata);
        v.removeEventListener('error', onError);
        resolve({ width: v.videoWidth, height: v.videoHeight });
      };
      
      const onError = (e) => {
        clearTimeout(timeout);
        console.error('checkVideoAspect: Erro ao carregar vídeo para checar aspecto:', src, e);
        v.removeEventListener('loadedmetadata', onLoadedMetadata);
        v.removeEventListener('error', onError);
        reject(e);
      };

      v.addEventListener('loadedmetadata', onLoadedMetadata);
      v.addEventListener('error', onError);
      v.load(); 
    });
  }

  function atualizarNoticias() {
    fetch(noticiasUrl)
      .then(res => res.json())
      .then(data => {
        noticias = data;
      })
      .catch(e => console.error('Erro ao carregar notícias', e));
  }

  function iniciarTicker() {
    tickerOffset = 0;
    tickerInterval = setInterval(() => {
      tickerOffset += 1;
    }, 30);
  }

  // Função para aplicar estilos forçados nos elementos internos do player
  // Reintroduzindo position:absolute e transform:none para garantir centralização e anular distorções
  function applyForcedPlayerStyles() {
    if (!playerElement) return;

    // Seletores mais abrangentes para elementos internos do player, incluindo Clappr/WM containers
    const elementsToStyle = playerElement.querySelectorAll(
      'video, iframe, canvas, .wm-player, .wm-video, .player-container, .video-container, [data-video-element], [class*="video"], [id*="player"]'
    );

    elementsToStyle.forEach(element => {
      element.style.setProperty('object-fit', 'contain', 'important');
      element.style.setProperty('width', '100%', 'important'); 
      element.style.setProperty('height', '100%', 'important');
      element.style.setProperty('max-width', '100%', 'important'); 
      element.style.setProperty('max-height', '100%', 'important');
      
      // Essas propriedades ajudam a centralizar o conteúdo do player dentro do seu wrapper flexível
      // E a anular possíveis transforms ou offsets que o player possa aplicar.
      element.style.setProperty('position', 'absolute', 'important'); 
      element.style.setProperty('inset', '0', 'important'); // top, right, bottom, left = 0
      element.style.setProperty('margin', 'auto', 'important'); 
      element.style.setProperty('transform', 'none', 'important'); // Tenta anular transforms
      element.style.setProperty('object-position', 'center', 'important'); 
    });
    console.log('applyForcedPlayerStyles: Tentativa de forçar estilos nos elementos internos do player.');
  }

  async function createPlayerWithProportion() {
    // Tenta detectar proporção via videoUrl se fornecida
    if (videoUrl) {
      try {
        const { width, height } = await checkVideoAspect(videoUrl);
        currentVideoAspectRatio = width / height;
        currentVideoIsVertical = height > width;
        console.log(`Vídeo inicial (via videoUrl prop) detectado: ${width}x${height}, aspectRatio: ${currentVideoAspectRatio}, isVertical: ${currentVideoIsVertical}`);
      } catch (error) {
        console.warn('Erro ao detectar proporção do vídeo inicial (via videoUrl prop):', error.message);
        // Fallback para proporção padrão se a detecção falhar
        currentVideoIsVertical = false; 
        currentVideoAspectRatio = 16/9; 
      }
    } else {
        console.log('Prop videoUrl não fornecida. A proporção será detectada via eventos do WM.Player.');
        // Inicia com proporção padrão
        currentVideoIsVertical = false; 
        currentVideoAspectRatio = 16/9;
    }

    proportionReady = true;
    // Pequeno atraso para garantir que o DOM seja renderizado com a classe inicial
    await new Promise(resolve => setTimeout(resolve, 50)); 

    if (!window.WM || !window.WM.Player) {
      console.error('WM.Player ainda não está disponível.');
      return;
    }

    const config = {
      videosIDs: videoId, 
      autoPlay,
      startMuted,
      skipDFP,
      width: '100%', // WM.Player sempre recebe 100% do seu container
      height: '100%',// WM.Player sempre recebe 100% do seu container
    };

    if (ga4) config.ga4 = ga4;

    playerInstance = new WM.Player(config);
    playerInstance.attachTo(playerElement);

    // --- NOVOS EVENTOS WM.Player ---
    if (window.WP3 && window.WP3.Events) {
        // Centralizar a lógica de atualização da proporção em uma única função
        const updateProportionFromEvent = (data, eventName) => {
            let newWidth = 0;
            let newHeight = 0;

            if (data && data.video && typeof data.video.width === 'number' && typeof data.video.height === 'number' && data.video.width > 0 && data.video.height > 0) {
                newWidth = data.video.width;
                newHeight = data.video.height;
            } else if (data && typeof data.width === 'number' && typeof data.height === 'number' && data.width > 0 && data.height > 0) {
                // Para eventos como CONTAINER_BITRATE que podem ter width/height direto no objeto data
                newWidth = data.width;
                newHeight = data.height;
            }

            if (newWidth > 0 && newHeight > 0) {
                // Atualiza APENAS se a proporção for realmente diferente
                const newAspectRatio = newWidth / newHeight;
                const newIsVertical = newHeight > newWidth;
                
                if (newAspectRatio.toFixed(4) !== currentVideoAspectRatio.toFixed(4) || newIsVertical !== currentVideoIsVertical) {
                    currentVideoAspectRatio = newAspectRatio;
                    currentVideoIsVertical = newIsVertical;
                    console.log(`Proporção ATUALIZADA via ${eventName}: ${newWidth}x${newHeight}, aspectRatio: ${currentVideoAspectRatio}, isVertical: ${currentVideoIsVertical}`);
                    // Pequeno atraso para o Svelte renderizar o CSS com a nova proporção
                    setTimeout(applyForcedPlayerStyles, 50); 
                    setTimeout(applyForcedPlayerStyles, 200); 
                } else {
                    console.log(`${eventName}: Proporção já definida ou não mudou significativamente. Reaplicando estilos.`);
                    setTimeout(applyForcedPlayerStyles, 50);
                }
            } else if (data && data.src && typeof data.src.url === 'string') { // Tenta usar a URL do src como fallback
                console.log(`${eventName}: URL do src encontrada, tentando checkVideoAspect.`);
                checkVideoAspect(data.src.url)
                    .then(result => {
                        const newAspectRatio = result.width / result.height;
                        const newIsVertical = result.height > result.width;
                        if (newAspectRatio.toFixed(4) !== currentVideoAspectRatio.toFixed(4) || newIsVertical !== currentVideoIsVertical) {
                            currentVideoAspectRatio = newAspectRatio;
                            currentVideoIsVertical = newIsVertical;
                            console.log(`Proporção ATUALIZADA via ${eventName} + checkVideoAspect: ${result.width}x${result.height}, aspectRatio: ${currentVideoAspectRatio}, isVertical: ${currentVideoIsVertical}`);
                            setTimeout(applyForcedPlayerStyles, 50); 
                            setTimeout(applyForcedPlayerStyles, 200); 
                        } else {
                            console.log(`${eventName} + checkVideoAspect: Proporção já definida. Reaplicando estilos.`);
                            setTimeout(applyForcedPlayerStyles, 50);
                        }
                    })
                    .catch(e => console.warn(`Erro em checkVideoAspect via ${eventName}:`, e.message));
            } else {
                console.warn(`${eventName} não forneceu dimensões ou URL válidas para atualização de proporção.`);
                // Ainda tenta aplicar estilos, mesmo que a proporção não tenha sido atualizada
                setTimeout(applyForcedPlayerStyles, 50);
            }
        };

        playerInstance.on(window.WP3.Events.WM_RESOURCE_SELECTED, (data) => updateProportionFromEvent(data, 'WM_RESOURCE_SELECTED'));
        playerInstance.on(window.WP3.Events.WM_RESOURCE_READY, (data) => updateProportionFromEvent(data, 'WM_RESOURCE_READY'));
        playerInstance.on(window.WP3.Events.WM_VIDEO_METADATA_LOADED, () => {
            console.log('WM Player: Evento WM_VIDEO_METADATA_LOADED disparado. Reaplicando estilos.');
            setTimeout(applyForcedPlayerStyles, 50); 
            setTimeout(applyForcedPlayerStyles, 200); 
        });

    } else {
        console.warn('window.WP3.Events não disponível. Eventos específicos do WM.Player não serão usados.');
    }

    // --- EVENTOS CLAPPR GENÉRICOS (Mantidos como fallback) ---
    playerInstance.on('ready', () => {
        console.log('WM Player: Evento "ready" (Clappr) disparado. Aplicando estilos iniciais.');
        applyForcedPlayerStyles();
        setTimeout(applyForcedPlayerStyles, 200); 
    });

    playerInstance.on('CONTAINER_BITRATE', (bitrate) => {
        console.log('WM Player: Evento "CONTAINER_BITRATE" (Clappr) disparado.', bitrate);
        updateProportionFromEvent(bitrate, 'CONTAINER_BITRATE');
    });

    playerInstance.on('loadedmetadata', async (data) => {
        console.log('WM Player: Evento "loadedmetadata" (Clappr) disparado.', data); 
        // Esta lógica de loadedmetadata como fallback só é acionada se a proporção não foi detectada ainda
        // ou se for a proporção padrão (16/9) e queremos tentar confirmar/ajustar
        if (!currentVideoAspectRatio || (currentVideoAspectRatio === 16/9 && !currentVideoIsVertical)) { 
             if (data && typeof data.url === 'string' && data.url.length > 0) { 
                console.log(`WM Player loadedmetadata: URL encontrada: ${data.url}. Tentando checar aspecto via URL.`);
                try {
                    const result = await checkVideoAspect(data.url);
                    const newAspectRatio = result.width / result.height;
                    const newIsVertical = result.height > result.width;
                    currentVideoAspectRatio = newAspectRatio;
                    currentVideoIsVertical = newIsVertical;
                    console.log(`Proporção ATUALIZADA via loadedmetadata+checkVideoAspect: ${result.width}x${result.height}, aspectRatio: ${currentVideoAspectRatio}, isVertical: ${currentVideoIsVertical}`);
                    setTimeout(applyForcedPlayerStyles, 50); 
                    setTimeout(applyForcedPlayerStyles, 200); 
                } catch (error) {
                    console.warn('Erro ao checar aspecto via URL do loadedmetadata:', error.message);
                }
            }
        }
        setTimeout(applyForcedPlayerStyles, 50); 
    });

    playerInstance.on('loadstart', () => {
        console.log('WM Player: Evento "loadstart" disparado.');
        applyForcedPlayerStyles();
    });
    playerInstance.on('canplay', () => {
        console.log('WM Player: Evento "canplay" disparado.');
        applyForcedPlayerStyles();
    });
    playerInstance.on('CORE_SCREEN_ORIENTATION_CHANGED', (screen) => {
        console.log('WM Player: CORE_SCREEN_ORIENTATION_CHANGED', screen.orientation);
        applyForcedPlayerStyles();
    });

    // MutationObserver: Observa mudanças no DOM do playerElement e aplica estilos
    const observerCallback = (mutations) => {
        let needsStyleApply = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Se algum nó foi adicionado, pode ser o player sendo montado ou atualizado
                needsStyleApply = true;
            } else if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'width' || mutation.attributeName === 'height' || mutation.attributeName === 'class' || mutation.attributeName === 'transform')) {
                // Se atributos de estilo/dimensão mudaram, pode ser o player se ajustando
                needsStyleApply = true;
            }
        });
        if (needsStyleApply) {
            // Pequeno atraso para o DOM se assentar
            setTimeout(applyForcedPlayerStyles, 50); 
        }
    };

    playerObserver = new MutationObserver(observerCallback);
    playerObserver.observe(playerElement, {
      childList: true, 
      subtree: true,   
      attributes: true, 
      attributeFilter: ['style', 'width', 'height', 'class', 'transform'] 
    });

    console.log('MutationObserver iniciado.');
  }

  onMount(() => {
    if (!videoId) {
      console.error('⚠️ É necessário informar o videoId!');
      return;
    }

    if (!window.WM) {
      const script = document.createElement('script');
      script.src = 'https://s3.glbimg.com/v1/AUTH_e1b09a2d222b4900a437a46914be81e5/api/stable/web/api.min.js';
      script.async = true;
      script.onload = () => {
        if (window.WM && window.WM.playerAvailable) {
          WM.playerAvailable.then(createPlayerWithProportion);
        } else {
          console.error('WM.playerAvailable não está disponível após carregar o script.');
        }
      };
      script.onerror = () => {
        console.error('Erro ao carregar o script do WM.Player.');
      };
      document.body.appendChild(script);
    } else {
      if (window.WM.playerAvailable) {
        WM.playerAvailable.then(createPlayerWithProportion);
      } else {
        console.error('WM.playerAvailable não está disponível, mesmo com WM global.');
      }
    }

    atualizarNoticias();
    iniciarTicker();
  });

  onDestroy(() => {
    if (playerInstance?.destroy) playerInstance.destroy();
    if (playerObserver) playerObserver.disconnect();
    clearInterval(tickerInterval);
  });
</script>

<style>
  /* Fundo preto (#232323) para toda a tela */
  .container-bg {
    position: fixed;
    left: 0; 
    top: 0;
    width: 100vw;
    height: 100vh;
    background: #232323; /* Cor de fundo desejada */
    display: flex;
    align-items: center; /* Centraliza o conteúdo (player-wrapper) verticalmente */
    justify-content: center; /* Centraliza o conteúdo (player-wrapper) horizontalmente */
    overflow: hidden; /* Garante que nada vaze do container principal */
    z-index: 1;
  }

  /* Este wrapper serve como um "palco" para o player.
     Ele ocupa 100% da viewport e centraliza o player-content dentro dele. */
  .player-wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center; /* Centraliza o player-content verticalmente */
    justify-content: center; /* Centraliza o player-content horizontalmente */
    background: #232323; /* Mantém o fundo preto */
    position: relative;
    overflow: hidden; /* Importante para garantir que o player-content não vaze se for maior que o wrapper por algum motivo */
  }

  /* O player-content é o container REAL do player e sua proporção é dinâmica.
     Ele se dimensiona para caber na tela, mantendo sua proporção. */
  .player-content {
    position: relative; /* Para que os elementos internos com absolute se posicionem corretamente */
    display: flex; /* Para centralizar o conteúdo real do player dentro dele, se necessário */
    align-items: center;
    justify-content: center;
    background: #232323; 
    flex-shrink: 0; 
    overflow: hidden; /* Recorta o que exceder os limites do player-content */
    transition: width 0.3s ease, height 0.3s ease; /* Transição suave nas mudanças de tamanho */
    
    /* A chave é usar max-width e max-height para fazer o elemento "crescer" o máximo possível
       dentro do player-wrapper (100vw/100vh) enquanto mantém sua aspect-ratio. */
    max-width: 100vw; 
    max-height: 100vh;
    width: auto;  /* Inicia com auto/auto para permitir que aspect-ratio funcione */
    height: auto; 
    
    /* Usa a variável CSS para definir a proporção, com um fallback (16/9 é o padrão de segurança) */
    aspect-ratio: var(--aspect-ratio-value, 16/9); 
  }

  /* Estilos específicos para quando o vídeo é HORIZONTAL */
  .player-content.is-horizontal {
    /* No modo horizontal, queremos que ele ocupe 100% da LARGURA DISPONÍVEL
       mas que sua altura não exceda 100% da altura da tela. */
    width: 100%; /* Ocupa 100% da largura do player-wrapper (100vw) */
    height: auto; /* Altura se ajusta para manter a proporção */
    /* A combinação de max-height: 100vh no .player-content base
       e a proporção garante que ele escala para caber. */
  }

  /* Estilos específicos para quando o vídeo é VERTICAL */
  .player-content.is-vertical {
    /* No modo vertical, queremos que ele ocupe 100% da ALTURA DISPONÍVEL
       mas que sua largura não exceda 100% da largura da tela. */
    height: 100%; /* Ocupa 100% da altura do player-wrapper (100vh) */
    width: auto; /* Largura se ajusta para manter a proporção */
    /* A combinação de max-width: 100vw no .player-content base
       e a proporção garante que ele escala para caber. */
  }

  /* As media queries agora são mais simples, apenas reforçando se necessário,
     mas a lógica principal de adaptação está no player-content */

  /* Media Query para Mobile (largura de tela < 768px) */
  @media (max-width: 767px) { 
    .player-content.is-horizontal {
      width: 100vw; /* Horizontal em mobile ocupa largura total */
      height: auto;
    }
    .player-content.is-vertical {
      width: 100vw; /* Vertical em mobile também ocupa largura total (para não ficar muito fino) */
      height: auto; /* Altura se ajusta à proporção vertical, pode ser muito alto */
      /* Opcional: Se quiser que vertical no mobile use a altura como guia, descomente e ajuste:
      height: 100vh;
      width: auto;
      max-width: calc(100vh * var(--aspect-ratio-value));
      */
    }
  }

  /* Estilos Agressivos para os elementos internos do player (video, iframe, canvas, etc.) */
  /* Estes devem garantir que o conteúdo do player preencha o .player-content e mantenha object-fit: contain */
  .player-content :global(video),
  .player-content :global(iframe),
  .player-content :global(canvas),
  .player-content :global(div[data-video]),
  .player-content :global(.video-container),
  .player-content :global(.player-container),
  .player-content :global(.wm-player),
  .player-content :global(.wm-video),
  .player-content :global(div[id*="player"]), 
  .player-content :global(div[class*="video"]) {
    object-fit: contain !important; /* Essencial para manter a proporção e evitar corte */
    width: 100% !important; 
    height: 100% !important; 
    max-width: 100% !important; 
    max-height: 100% !important; 
    position: absolute !important; /* Para centralizar os elementos internos dentro do player-content */
    inset: 0 !important; /* Shorthand for top:0; right:0; bottom:0; left:0; */
    margin: auto !important; /* Ajuda a centralizar o elemento absoluto */
    transform: none !important; /* Anula qualquer transformação de escala ou posição que o player possa aplicar */
    object-position: center !important; /* Garante que o vídeo seja centralizado dentro do seu container */
  }

  /* Ticker styles (mantidos) */
  .ticker {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
    backdrop-filter: blur(4px);
  }

  .ticker-inner {
    display: inline-block;
    white-space: nowrap;
    transform: translateX(calc(-1 * var(--offset, 0) * 1px));
    transition: transform 0.03s linear;
  }

  .ticker-item {
    display: inline-block;
    margin-right: 2rem;
    font-size: 1rem;
  }

  .ticker-item a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
  }

  .ticker-item a:hover {
    text-decoration: underline;
  }

  .loading {
    color: #fff;
    text-align: center;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    background: #232323; /* Fundo do loading também */
  }
</style>

<div class="container-bg">
  {#if proportionReady}
    <div class="player-wrapper">
      <div 
        bind:this={playerElement} 
        class="player-content {playerContainerClass}" 
        style="--aspect-ratio-value: {currentVideoAspectRatio};" 
      ></div>
    </div>
  {:else}
    <div class="loading">
      Carregando player...
    </div>
  {/if}

  {#if noticias.length > 0}
    <div class="ticker">
      <div
        class="ticker-inner"
        style="--offset: {tickerOffset}"
      >
        {#each noticias as n, i (i)}
          <div class="ticker-item">
            <a href={n.link} target="_blank" rel="noopener">{n.titulo}</a>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>