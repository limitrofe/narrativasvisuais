<script>
  import { onMount, onDestroy } from 'svelte';

  export let videoId;
  export let autoPlay = true;
  export let startMuted = false;
  export let skipDFP = true;
  export let controls = true;
  export let full = false; // Adicionamos 'full' para o CSS, se necessário

  let playerInstance;
  let playerElement;

  // Carrega o script do player da Globo se ainda não estiver disponível
  // Esta lógica deve estar no componente PAI se você só quer carregar uma vez
  // Mas para o exemplo de componente isolado, mantemos aqui.
  // IMPORTANTE: Isso pode causar recarregamentos desnecessários se o GloboPlayer
  // for destruído e criado muitas vezes. Idealmente, o script WM.Player
  // seria carregado uma única vez no componente raiz (App.svelte ou ReelsPlayer).
  onMount(() => {
    const loadGloboPlayerScript = () => {
      if (!window.WM || !window.WM.Player) {
        const script = document.createElement('script');
        script.src = 'https://s3.glbimg.com/v1/AUTH_e1b09a2d222b4900a437a46914be81e5/api/stable/web/api.min.js';
        script.async = true;
        script.onload = () => {
          // A API da Globo usa uma Promise para indicar que o player está disponível
          window.WM.playerAvailable.then(initPlayer).catch(e => console.error("Erro ao carregar player da Globo:", e));
        };
        document.body.appendChild(script);
      } else {
        window.WM.playerAvailable.then(initPlayer).catch(e => console.error("Erro ao carregar player da Globo:", e));
      }
    };

    const initPlayer = () => {
      if (playerInstance && playerInstance.destroy) {
        playerInstance.destroy();
      }

      const config = {
        source: Number(videoId),
        autoPlay: autoPlay,
        startMuted: startMuted,
        skipDFP: skipDFP,
        controls: controls,
        width: '100%',
        height: '100%', // Agora 100% do container pai, que será 100vh/100vw no ReelsPlayer
      };

      playerInstance = new window.WM.Player(config);
      playerInstance.attachTo(playerElement);

      // Dispara um evento customizado 'videoEnded' para o componente pai
      playerInstance.on('ended', () => {
        dispatch('ended');
      });

      // Tenta dar play e unmute se autoPlay for true e não estiver mutado inicialmente
      setTimeout(() => {
        try {
          if (autoPlay && !startMuted) {
            playerInstance.unmute && playerInstance.unmute();
            playerInstance.play && playerInstance.play();
          }
        } catch (e) {
          console.error("Erro ao tentar reproduzir vídeo no GloboPlayer:", e);
        }
      }, 100); // Pequeno atraso para garantir que o player esteja pronto
    };

    // Certifique-se de que o videoId é válido antes de tentar carregar
    if (videoId) {
        loadGloboPlayerScript();
    }
  });

  onDestroy(() => {
    if (playerInstance && playerInstance.destroy) {
      playerInstance.destroy();
      playerInstance = null; // Limpa a referência
    }
  });

  // O Svelte vai recriar o componente (e chamar onMount novamente) se a prop 'key' mudar no pai
  // ou se 'videoId' mudar e o Svelte detectar que o componente precisa ser re-renderizado
  // com um novo estado.
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<div class="globo-player-wrapper" bind:this={playerElement} class:full={full}></div>

<style>
  .globo-player-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000; /* Fundo escuro para evitar flashes */
  }

  /* Se o prop 'full' for verdadeiro, o wrapper ocupa toda a tela */
  /* No seu caso, o .player no ReelsPlayer já garante 100vh/100vw, então talvez 'full' não seja estritamente necessário aqui, mas é bom ter. */
  .globo-player-wrapper.full {
    width: 100vw;
    height: 100vh;
  }

  /* Estilos para o player da Globo dentro do wrapper */
  .globo-player-wrapper :global(.clappr-player[data-player]),
  .globo-player-wrapper :global(iframe),
  .globo-player-wrapper :global(video) {
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: contain; /* CRUCIAL: Garante que o vídeo caiba sem cortar */
    background: #000;
  }
</style>