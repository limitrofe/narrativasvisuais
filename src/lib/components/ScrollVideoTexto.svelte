<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  export let videoDesk;
  export let videoMob;
  export let poster = '';
  export let duration = 10;
  export let scrollyDuration = 3000;
  export let pausas = [];

  let container;
  let videoElement;
  let isVisible = false;
  let showText = null;
  let src = '';

  function handleScroll() {
    if (!isVisible || !videoElement || videoElement.readyState < 2) return;

    const scrollTop = window.scrollY;
    const containerTop = container.offsetTop;
    const progress = (scrollTop - containerTop) / scrollyDuration;
    const percent = Math.min(1, Math.max(0, progress));
    const currentTime = percent * duration;

    videoElement.pause();
    videoElement.currentTime = currentTime;

    const pausePoint = pausas.find(p => Math.abs(currentTime - p.time) < 0.3);
    showText = pausePoint ? pausePoint.text : null;
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    src = window.innerWidth <= 768 ? videoMob : videoDesk;

    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${scrollyDuration}`,
      onEnter: () => (isVisible = true),
      onLeave: () => (isVisible = false),
      onEnterBack: () => (isVisible = true),
      onLeaveBack: () => (isVisible = false)
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });
</script>

<div bind:this={container} class="video-container" style="height: {scrollyDuration}px;">
  {#if isVisible}
    <video
      bind:this={videoElement}
      src={src}
      poster={poster || undefined}
      muted
      playsinline
      preload="auto"
      autoplay={false}
      style="position: fixed; top: 0; left: 0; width: 100%; height: auto; z-index: 1;"
    />
    {#if showText}
      <div class="overlay-text">
        <p>{showText}</p>
      </div>
    {/if}
  {/if}
</div>

<style>
  .video-container {
    position: relative;
    width: 100%;
  }

  .overlay-text {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    background: rgba(0, 0, 0, 0.6);
    padding: 1rem 2rem;
    border-radius: 10px;
    font-size: 1rem;
    z-index: 2;
    max-width: 90%;
    text-align: center;
  }
</style>
