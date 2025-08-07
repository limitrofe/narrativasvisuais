<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  // Props obrigatórias e opcionais
  export let videoId; // O ID do vídeo individual a ser reproduzido
  export let autoPlay = true;
  export let startMuted = false; // Controlado pelo `!audioUnlocked` do ReelsPlayer
  export let skipDFP = true; // Se deve pular anúncios DFP
  export let ga4 = null; // Para integração com Google Analytics 4

  let playerElement; // Referência ao elemento HTML onde o player da Globo será anexado
  let playerInstance; // Instância do player da Globo (WM.Player)

  const dispatch = createEventDispatcher(); // Para enviar eventos para o componente pai (ReelsPlayer)

  function createPlayer() {
    // Verifica se o objeto global do player da Globo está disponível no navegador
    if (typeof window === 'undefined' || !window.WM || !window.WM.Player) {
      console.error('GloboPlayer: WM.Player API não está disponível ou ambiente não é de navegador.');
      return;
    }

    // ✅ CRUCIAL: Destrói qualquer instância anterior do player da Globo.
    // Isso evita vazamentos de memória e conflitos quando este componente é recriado
    // (o que acontece quando o `key` muda no `ReelsPlayer`).
    if (playerInstance && playerInstance.destroy) {
      console.log(`GloboPlayer: Destruindo instância anterior para videoId: ${videoId}`);
      playerInstance.destroy();
      playerInstance = null; // Limpa a referência
    }

    // Configuração do player da Globo (WM.Player)
    const config = {
      // ✅ ESSENCIAL: Usar 'source' para um único videoId.
      // O 'videoId' aqui é o número identificador do vídeo na plataforma da Globo.
      source: Number(videoId), 
      autoPlay: autoPlay,
      // `startMuted` é passado do `ReelsPlayer`, que o define com base no `audioUnlocked`.
      // Se `audioUnlocked` for true, `startMuted` será false, e o vídeo tentará tocar com som.
      startMuted: startMuted, 
      skipDFP: skipDFP,
      // O player vai ocupar 100% da largura e altura do seu elemento pai (`playerElement`).
      // As dimensões 100vw/100vh são gerenciadas pelo `ReelsPlayer` no `.player-overlay`.
      width: '100%', 
      height: '100%',
    };

    if (ga4) config.ga4 = ga4; // Adiciona configuração do GA4 se fornecida

    console.log(`GloboPlayer: Tentando criar nova instância para videoId: ${videoId} com config:`, config);
    // Cria a nova instância do player da Globo
    playerInstance = new window.WM.Player(config); 
    // Anexa o player ao elemento HTML no DOM
    playerInstance.attachTo(playerElement);

    // ✅ Listener para o evento 'ended' da API do player da Globo.
    // Isso é como o `GloboPlayer` notifica o `ReelsPlayer` que o vídeo atual terminou,
    // permitindo a transição automática para o próximo vídeo.
    playerInstance.on('ended', () => {
      console.log(`GloboPlayer: Evento 'ended' recebido para videoId: ${videoId}. Disparando para o componente pai.`);
      dispatch('ended'); // Dispara um evento customizado 'ended'
    });

    // Opcional: Adicionar mais listeners da API do player para depuração e controle de estado
    playerInstance.on('play', () => console.log(`GloboPlayer: Vídeo ${videoId} começou a tocar.`));
    playerInstance.on('pause', () => console.log(`GloboPlayer: Vídeo ${videoId} pausado.`));
    playerInstance.on('error', (err) => console.error(`GloboPlayer: Erro interno do player para videoId ${videoId}:`, err));
    playerInstance.on('ready', () => {
      console.log(`GloboPlayer: Player para videoId ${videoId} está pronto.`);
      // Tenta desmutar e dar play logo que o player da Globo estiver pronto.
      // Um pequeno atraso (100ms) é uma prática comum para garantir que o player
      // tenha inicializado completamente antes de tentar interagir com ele.
      setTimeout(() => {
        try {
          if (!startMuted) { // Se o vídeo NÃO deve começar mutado (porque audioUnlocked é true no ReelsPlayer)
            playerInstance.unmute && playerInstance.unmute();
            console.log(`GloboPlayer: Tentando desmutar vídeo ${videoId}.`);
          }
          if (autoPlay) { // Se o autoplay está habilitado
             playerInstance.play && playerInstance.play();
             console.log(`GloboPlayer: Tentando iniciar reprodução de ${videoId}.`);
          }
        } catch (e) {
          console.error(`GloboPlayer: Erro ao tentar reproduzir/desmutar vídeo ${videoId}:`, e);
        }
      }, 100); 
    });
  }

  // Hook de ciclo de vida do Svelte: chamado quando o componente é montado no DOM.
  onMount(() => {
    console.log(`GloboPlayer: Componente montado. videoId recebido: ${videoId}`);
    if (!videoId) {
      console.error('GloboPlayer: ⚠️ É necessário informar o videoId para criar o player!');
      return;
    }

    // Carrega o script da API da Globo (api.min.js) se ainda não estiver disponível.
    // Embora funcional aqui, a melhor prática para um único carregamento seria no `+page.svelte`.
    // Deixei aqui por ser mais autocontido para este componente.
    if (!window.WM) {
      console.log('GloboPlayer: Script WM.Player não carregado, anexando...');
      const script = document.createElement('script');
      script.src = 'https://s3.glbimg.com/v1/AUTH_e1b09a2d222b4900a437a46914be81e5/api/stable/web/api.min.js';
      script.async = true;
      script.onload = () => {
        console.log('GloboPlayer: Script WM.Player carregado. Aguardando playerAvailable...');
        // O `WM.playerAvailable` é uma Promise da API da Globo que resolve quando o player está pronto para uso.
        window.WM.playerAvailable.then(createPlayer).catch(e => console.error('GloboPlayer: Erro ao esperar playerAvailable após script load:', e));
      };
      script.onerror = (e) => console.error('GloboPlayer: Falha ao carregar script WM.Player!', e);
      document.body.appendChild(script);
    } else {
      console.log('GloboPlayer: WM.Player já disponível. Criando player...');
      window.WM.playerAvailable.then(createPlayer).catch(e => console.error('GloboPlayer: Erro ao esperar playerAvailable:', e));
    }
  });

  // Hook de ciclo de vida do Svelte: chamado quando o componente é removido do DOM.
  onDestroy(() => {
    console.log(`GloboPlayer: Componente para videoId ${videoId} desmontado.`);
    // ✅ Destrói a instância do player da Globo para liberar recursos.
    if (playerInstance?.destroy) {
      playerInstance.destroy();
      playerInstance = null; // Limpa a referência
    }
  });
</script>

<div class="player-wrapper" bind:this={playerElement}></div>

<style>
  /* O wrapper para o player da Globo */
  .player-wrapper {
    width: 100%;
    height: 100%;
    display: flex; /* Usado para centralizar o player visualmente */
    align-items: center;
    justify-content: center;
    background-color: black; /* Fundo padrão do player */
  }

  /* Estilos para o player da Globo injetado (iframe/video) dentro do wrapper */
  /* O `:global` é necessário porque o player da Globo injeta seu próprio HTML/CSS,
     e precisamos aplicar estilos a esses elementos externos ao escopo do Svelte. */
  .player-wrapper :global(.clappr-player[data-player]),
  .player-wrapper :global(iframe),
  .player-wrapper :global(video) {
    width: 100% !important; /* Força o player a ocupar 100% da largura do seu container */
    height: 100% !important; /* Força o player a ocupar 100% da altura do seu container */
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: contain; /* Garante que o vídeo se ajuste sem cortar, adicionando barras se necessário */
    background-color: black; /* Fundo para as áreas "vazias" do player */
  }
</style>