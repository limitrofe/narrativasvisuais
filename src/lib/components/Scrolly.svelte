<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { writable } from 'svelte/store';

  // --- Props Exportadas ---
  export let steps = [];
  export let height = "";
  export let etapaHeight = 110;
  export let defaultFadeDuration = 500;
  export let defaultBgColor = "#232323";
  export let defaultDipDuration = 150;

  // --- Variáveis Internas ---
  let container;
  let numSteps = 0;
  let active = 0;
  let previousActive = 0;
  let currentBg = defaultBgColor;
  let transitionTimeout;
  let videoElements = []; // Adicionado para guardar refs dos vídeos

  let tweenActive = tweened(0, { duration: defaultFadeDuration, easing: cubicOut });
  const isMobile = writable(false);

  // --- Funções ---
  function checkMobile() {
    isMobile.set(window.innerWidth <= 750);
  }

  function handleScroll() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scrollPos = Math.max(0, -rect.top);
    const fullHeight = rect.height - window.innerHeight;
    let progress = Math.min(1, scrollPos / (fullHeight || 1));
    let idx = Math.floor(progress * (numSteps - 1));
    if (idx < 0) idx = 0;
    if (idx > numSteps - 1) idx = numSteps - 1;
    if (active !== idx) {
      active = idx;
    }
  }

  // --- Lifecycle ---
  onMount(() => {
    checkMobile();
    const initialStep = steps[active];
    currentBg = (initialStep && initialStep.bgColor) || defaultBgColor;
    tweenActive.set(active, { duration: 0 });
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
      checkMobile();
      handleScroll();
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
      clearTimeout(transitionTimeout);
    };
  });

  // --- Reatividade ---
  $: numSteps = steps.length;
  $: sectionHeight = height || `${numSteps * etapaHeight}vh`;

  // Bloco reativo atualizado com lógica de vídeo
  $: {
    if (active !== previousActive && steps.length > 0) {
      const leavingStep = steps[previousActive];
      const enteringStep = steps[active];

      const newBg = (enteringStep && enteringStep.bgColor) || defaultBgColor;
      const stepDuration = (enteringStep && enteringStep.fadeDuration) || defaultFadeDuration;
      const stepDipColor = leavingStep && leavingStep.transitionColor;
      const stepDipDuration = (leavingStep && leavingStep.transitionDipDuration) || defaultDipDuration;

      clearTimeout(transitionTimeout);

      if (stepDipColor) {
        currentBg = stepDipColor;
        transitionTimeout = setTimeout(() => {
          currentBg = newBg;
        }, stepDipDuration);
      } else {
        currentBg = newBg;
      }

      // --- Lógica de Play/Pause para Vídeos ---
      const leavingVideo = videoElements[previousActive];
      const enteringVideo = videoElements[active];

      // Pausa/Reseta vídeo que está saindo
      if (leavingVideo && leavingStep && leavingStep.tipo === 'video') {
        const leaveAutoplay = leavingStep.autoplay ?? false;
        const leavePlayOnActive = leavingStep.playOnActive ?? true;
        if (!leaveAutoplay || leavePlayOnActive) {
          leavingVideo.pause();
          if (leavePlayOnActive) {
             leavingVideo.currentTime = 0;
          }
        }
      }

      // Toca vídeo que está entrando (se necessário)
      if (enteringVideo && enteringStep && enteringStep.tipo === 'video') {
        const enterAutoplay = enteringStep.autoplay ?? false;
        const enterPlayOnActive = enteringStep.playOnActive ?? true;
        const enterMuted = enteringStep.muted ?? true;

        if (enterAutoplay || enterPlayOnActive) {
          enteringVideo.muted = enterMuted;
          const playPromise = enteringVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.warn(`Vídeo ${active}: Autoplay bloqueado ou erro - `, error);
            });
          }
        }
      }
      // --- FIM: Lógica de Vídeos ---

      tweenActive.set(active, { duration: stepDuration, easing: cubicOut });
      previousActive = active;
    }
  }

  // --- Funções Helper de Mídia (Completas) ---
  function getConteudo(etapa, $isMobile) {
    if (!etapa.conteudo) return "";
    if (typeof etapa.conteudo === "string") return etapa.conteudo;
    if ($isMobile && etapa.conteudo.mob) return etapa.conteudo.mob;
    if (!$isMobile && etapa.conteudo.desk) return etapa.conteudo.desk;
    return etapa.conteudo.mob || etapa.conteudo.desk || "";
  }
  function getPoster(etapa, $isMobile) {
    if (!etapa.poster) return "";
    if (typeof etapa.poster === "string") return etapa.poster;
    if ($isMobile && etapa.poster.mob) return etapa.poster.mob;
    if (!$isMobile && etapa.poster.desk) return etapa.poster.desk;
    return etapa.poster.mob || etapa.poster.desk || "";
  }
  function getBackgroundImage(etapa, $isMobile) {
    if (!etapa.backgroundImage) return "";
    if (typeof etapa.backgroundImage === "string") return etapa.backgroundImage;
    if ($isMobile && etapa.backgroundImage.mob) return etapa.backgroundImage.mob;
    if (!$isMobile && etapa.backgroundImage.desk) return etapa.backgroundImage.desk;
    return etapa.backgroundImage.mob || etapa.backgroundImage.desk || "";
  }
  function getBackgroundVideo(etapa, $isMobile) {
    if (!etapa.backgroundVideo) return "";
    if (typeof etapa.backgroundVideo === "string") return etapa.backgroundVideo;
    if ($isMobile && etapa.backgroundVideo.mob) return etapa.backgroundVideo.mob;
    if (!$isMobile && etapa.backgroundVideo.desk) return etapa.backgroundVideo.desk;
    return etapa.backgroundVideo.mob || etapa.backgroundVideo.desk || "";
  }
</script>

<style>
  .scrolly-section {
    position: relative;
    width: 100vw;
    min-height: 100vh;
    margin: 0;
    z-index: 2;
  }
  .scrolly-sticky {
    position: sticky;
    top: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--scrolly-bg);
    transition: background 0.5s ease-in-out;
  }
  .scrolly-etapa {
    position: absolute;
    top: 0; left: 0; width: 100vw; height: 100vh;
    display: flex; align-items: center; justify-content: center;
    will-change: opacity;
    pointer-events: none;
    z-index: 1;
  }
  .scrolly-etapa.active {
    z-index: 2;
    pointer-events: auto;
  }
  .scrolly-img, .scrolly-video, .scrolly-embed {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    display: block;
  }

  .is-desktop .scrolly-img,
  .is-desktop .scrolly-video {
    object-fit: contain;
  }

  .scrolly-embed {
      background: #fff;
  }

  .scrolly-texto {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0; left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    font-size: 2vw;
    padding: 0;
  }
  .scrolly-text-inner {
    position: relative;
    z-index: 1;
    padding: 0;
    width: 100%;
    text-align: center;
  }
  .scrolly-bg-video {
    position: absolute;
    z-index: 0;
    top: 0; left: 0; width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.28;
    pointer-events: none;
  }
</style>

<section
  bind:this={container}
  class="scrolly-section"
  class:is-mobile={$isMobile}
  class:is-desktop={!$isMobile}
  style="height: {sectionHeight}"
>
  <div
    class="scrolly-sticky"
    style="--scrolly-bg: {currentBg};"
  >
    {#each steps as etapa, i}
      <div
        class="scrolly-etapa {i === Math.round($tweenActive) ? 'active' : ''}"
        style="opacity: {Math.max(0, 1 - Math.abs($tweenActive - i))};"
      >
        {#if etapa.tipo === 'foto'}
          <img
            class="scrolly-img"
            src={getConteudo(etapa, $isMobile)}
            alt={etapa.alt || ''}
            draggable="false"
          />
        {:else if etapa.tipo === 'video'}
          <video
            bind:this={videoElements[i]}
            class="scrolly-video"
            src={getConteudo(etapa, $isMobile)}
            playsinline
            poster={getPoster(etapa, $isMobile)}
            muted={etapa.muted ?? true}
            controls={etapa.controls ?? false}
            loop={etapa.loop ?? true}
            preload="auto"
          >
            Seu navegador não suporta vídeos HTML5.
          </video>
        {:else if etapa.tipo === 'texto'}
          <div
            class="scrolly-texto"
            style="
              color: {etapa.color || '#fff'};
              background:
                {etapa.backgroundColor
                  ? etapa.backgroundColor
                  : (
                      getBackgroundImage(etapa, $isMobile)
                        ? `url('${getBackgroundImage(etapa, $isMobile)}') center/cover no-repeat`
                        : 'transparent'
                    )
                };
              position: relative;
            "
          >
            {#if getBackgroundVideo(etapa, $isMobile)}
              <video
                src={getBackgroundVideo(etapa, $isMobile)}
                autoplay
                muted
                loop
                playsinline
                class="scrolly-bg-video"
              />
            {/if}
            <div class="scrolly-text-inner">
              {@html etapa.conteudo}
            </div>
          </div>
        {:else if etapa.tipo === 'embed'}
          <iframe
            class="scrolly-embed"
            src={getConteudo(etapa, $isMobile)}
            frameborder="0"
            allowfullscreen
            style="background: #fff;"
          ></iframe>
        {/if}
      </div>
    {/each}
  </div>
</section>