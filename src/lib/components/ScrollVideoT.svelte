<script>
  import { onMount } from 'svelte';
  import ScrollyVideo from 'scrolly-video/dist/ScrollyVideo.svelte';

  export let videoDesk = '';
  export let videoMob = '';
  export let posterDesk = '';
  export let posterMob = '';
  export let duration = 10; // duração do vídeo em segundos
  export let scrollyDuration = 4000; // altura do scroll em px

  let isMobile = false;
  let loaded = false;
  let videoEl;

  // Detecta se é mobile
  onMount(() => {
    isMobile = window.innerWidth < 768;

    if (videoEl) {
      videoEl.addEventListener('loadeddata', () => {
        loaded = true;
      });

      // fallback se o evento não disparar (Safari às vezes buga)
      setTimeout(() => {
        if (!loaded) loaded = true;
      }, 4000);
    }
  });

  $: videoSrc = isMobile ? videoMob : videoDesk;
  $: posterSrc = isMobile ? posterMob : posterDesk;
</script>

<!-- Pré-carregamento invisível (necessário pro iOS funcionar) -->
<video
  bind:this={videoEl}
  src={videoSrc}
  poster={posterSrc}
  muted
  playsinline
  preload="auto"
  style="display: none;"
></video>

{#if !loaded}
  <div class="scrolly-loading">
    <p>Carregando vídeo...</p>
  </div>
{:else}
  <div style="height: {scrollyDuration}px">
    <ScrollyVideo
      src={videoSrc}
      poster={posterSrc}
      duration={duration}
      scrollyDuration={scrollyDuration}
      muted
      autoplay
      cover
    />
  </div>
{/if}

<style>
.scrolly-loading {
  height: 100vh;
  background: #fff;
  color: #232323;
  font-family: 'Open Sans', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
</style>
