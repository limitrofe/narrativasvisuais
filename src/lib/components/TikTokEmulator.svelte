<script>
    import { onMount, tick } from 'svelte';
  
    export let videos = [];
  
    let wrapper;
    let container;
    let fixedMode = false;
    let currentIndex = 0;
    let totalHeight = 0;
  
    function pauseAllExcept(index) {
      const allVideos = wrapper.querySelectorAll('video');
      allVideos.forEach((v, i) => {
        if (i === index) v.play();
        else v.pause();
      });
    }
  
    function handleScroll() {
      const wrapperTop = wrapper.getBoundingClientRect().top;
      const wrapperBottom = wrapper.getBoundingClientRect().bottom;
  
      const isInside = wrapperTop <= 0 && wrapperBottom > window.innerHeight;
  
      if (isInside && !fixedMode) {
        fixedMode = true;
      } else if (!isInside && fixedMode) {
        fixedMode = false;
      }
  
      if (fixedMode) {
        const totalScrollable = totalHeight - window.innerHeight;
        const scrolled = -wrapperTop;
        const progress = scrolled / totalScrollable;
        const index = Math.floor(progress * videos.length);
  
        if (index !== currentIndex && index >= 0 && index < videos.length) {
          currentIndex = index;
          pauseAllExcept(currentIndex);
        }
  
        container.style.transform = `translateY(-${currentIndex * 100}vh)`;
      }
    }
  
    onMount(async () => {
      await tick();
      totalHeight = videos.length * window.innerHeight;
      pauseAllExcept(0);
      window.addEventListener('scroll', handleScroll);
    });
  </script>
  
  <style>
    .tiktok-wrapper {
      position: relative;
      width: 100%;
      z-index: 0;
    }
  
    .tiktok-fake {
      height: var(--fake-height);
      width: 100%;
    }
  
    .tiktok-fixed {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      pointer-events: auto;
      z-index: 0; /* NÃO sobrepõe nada */
    }
  
    .tiktok-container {
      height: 100vh;
      width: 100%;
      transition: transform 0.6s ease;
    }
  
    .tiktok-slide {
      height: 100vh;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  </style>
  
  <div bind:this={wrapper} class="tiktok-wrapper">
    <div
      class="tiktok-fake"
      style="--fake-height: {videos.length * 100}vh"
    ></div>
  
    {#if fixedMode}
      <div class="tiktok-fixed">
        <div bind:this={container} class="tiktok-container">
          {#each videos as video, index}
            <div class="tiktok-slide">
              <video
                src={video}
                playsinline
                muted
                preload="auto"
                controls={false}
                loop
              />
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  