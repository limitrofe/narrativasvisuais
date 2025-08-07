<script>
    import { onMount, tick } from 'svelte';
    import GloboPlayer from './GloboPlayer.svelte';
  
    export let videos = [];
  
    let currentIndex = 0;
    let currentVideoId = '';
    let touchStartY = 0;
    let isAnimating = false;
    const basePath = '/tiktok-globoplayer';
  
    async function goToIndex(index) {
      if (index < 0 || index >= videos.length) return;
      currentIndex = index;
      currentVideoId = videos[currentIndex];
      history.pushState(null, '', `${basePath}/video/${currentVideoId}`);
    }
  
    function handleWheel(event) {
      event.preventDefault();
      if (isAnimating) return;
      if (event.deltaY > 30) {
        nextVideo();
      } else if (event.deltaY < -30) {
        prevVideo();
      }
    }
  
    function handleTouchStart(event) {
      touchStartY = event.touches[0].clientY;
    }
  
    function handleTouchEnd(event) {
      const touchEndY = event.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      if (Math.abs(diffY) > 50) {
        if (diffY > 0) {
          nextVideo();
        } else {
          prevVideo();
        }
      }
    }
  
    function nextVideo() {
      if (currentIndex < videos.length - 1) {
        isAnimating = true;
        goToIndex(currentIndex + 1);
        setTimeout(() => { isAnimating = false; }, 400);
      }
    }
  
    function prevVideo() {
      if (currentIndex > 0) {
        isAnimating = true;
        goToIndex(currentIndex - 1);
        setTimeout(() => { isAnimating = false; }, 400);
      }
    }
  
    onMount(() => {
      if (videos.length > 0) {
        currentVideoId = videos[currentIndex];
        history.replaceState(null, '', `${basePath}/video/${currentVideoId}`);
      }
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('touchstart', handleTouchStart, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: false });
    });
  </script>
  
  <style>
    body {
      overflow: hidden;
      background: black;
    }
  
    .container {
      overflow: hidden;
      height: 100vh;
      width: 100vw;
      position: relative;
    }
  
    .thumbs {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      transition: transform 0.5s ease;
    }
  
    .thumb {
      height: 100vh;
      width: 100vw;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .thumb img {
      max-height: 100%;
      max-width: 100%;
      object-fit: cover;
      opacity: 0.3;
    }
  
    .player {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 10;
    }
  </style>
  
  <div class="container">
    <div class="thumbs" style="transform: translateY(-{currentIndex * 100}vh);">
      {#each videos as videoId, index}
        <div class="thumb">
          <img src="/thumbs/{videoId}.jpg" alt="thumb" />
        </div>
      {/each}
    </div>
  
    <div class="player">
      {#if currentVideoId}
        <GloboPlayer
          key={currentVideoId}
          videoId={currentVideoId}
          autoPlay={true}
          startMuted={false}
          skipDFP={true}
          full={true}
        />
      {/if}
    </div>
  </div>
  