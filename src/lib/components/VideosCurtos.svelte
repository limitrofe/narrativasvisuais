<script>
  import { onMount, onDestroy } from 'svelte';

  export let falkorApiUrl = "https://falkor-cda.bastian.globo.com/tenants/g1/instances/9fc7d798-5f6d-4bb0-b074-5726f472749c/posts/ssi";
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
  let updateIntervalId;

  // Busca vídeos do Falkor (API G1)
  async function fetchVideosFromFalkor() {
    try {
      const resp = await fetch(falkorApiUrl);
      const data = await resp.json();
      // Ajuste a lógica de extração conforme o JSON real retornado pela API
      let parsed = [];

      // Exemplo: pode precisar adaptar se sua estrutura for diferente
      (data.items || []).forEach(item => {
        if (item.content && item.content.video && item.content.video.id) {
          parsed.push({
            videoId: item.content.video.id,
            title: item.content.title || "",
          });
        }
        // Também pode procurar vídeos em posts agregados, se houver
        if (item.aggregatedPosts && item.aggregatedPosts.length > 0) {
          item.aggregatedPosts.forEach(post => {
            if (post.content && post.content.video && post.content.video.id) {
              parsed.push({
                videoId: post.content.video.id,
                title: post.content.title || "",
              });
            }
          });
        }
      });

      // Elimina duplicatas
      videos = parsed.filter((v, idx, arr) =>
        v.videoId && arr.findIndex(x => x.videoId === v.videoId) === idx
      );
      current = 0;
    } catch (e) {
      videos = [];
      current = 0;
    }
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

    playerInstance.on('ended', () => {
      progressoAtual = 1;
      nextVideo();
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

  // Próximo vídeo, recarrega API ao chegar no fim
  async function nextVideo() {
    if (current < videos.length - 1) {
      current += 1;
      createAndLoadPlayer(videos[current].videoId);
    } else {
      // Chegou ao fim: recarrega a API
      await fetchVideosFromFalkor();
      if (videos.length > 0) {
        createAndLoadPlayer(videos[current].videoId);
      }
    }
  }

  // Atualiza lista de vídeos a cada 30 min (opcional)
  async function startAutoUpdate(intervalMinutes = 30) {
    if (updateIntervalId) clearInterval(updateIntervalId);
    updateIntervalId = setInterval(async () => {
      await fetchVideosFromFalkor();
      if (videos.length > 0) {
        createAndLoadPlayer(videos[current].videoId);
      }
    }, intervalMinutes * 60 * 1000);
  }

  onMount(async () => {
    await fetchVideosFromFalkor();
    if (videos.length === 0) return;

    if (!window.WM) {
      const script = document.createElement('script');
      script.src = 'https://s3.glbimg.com/v1/AUTH_e1b09a2d222b4900a437a46914be81e5/api/stable/web/api.min.js';
      script.async = true;
      script.onload = () => {
        window.WM.playerAvailable.then(() => {
          createAndLoadPlayer(videos[current].videoId);
          startAutoUpdate(30);
        });
      };
      document.body.appendChild(script);
    } else {
      window.WM.playerAvailable.then(() => {
        createAndLoadPlayer(videos[current].videoId);
        startAutoUpdate(30);
      });
    }
  });

  onDestroy(() => {
    if (playerInstance?.destroy) playerInstance.destroy();
    if (updateIntervalId) clearInterval(updateIntervalId);
  });
</script>

<!-- Stories-style progress bar -->
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
</style>
