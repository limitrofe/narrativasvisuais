<script>
  import { onMount } from 'svelte';

  export let totalFrames = 511;
  export let scrollyDuration = 5000;

  export let pathDesk = '';
  export let pathMob = '';
  export let posterDesk = '';
  export let posterMob = '';

  let canvas;
  let container;
  let context;
  let isMobile = false;
  let images = [];
  let currentFrame = 0;
  let framesValidos = new Set();
  let isLoaded = false;

  function pad(n) {
    return String(n).padStart(4, '0');
  }

  function getFrameSrc(i) {
    const folder = isMobile ? pathMob : pathDesk;
    return `${folder}/frame_${pad(i)}.jpg`;
  }

  function preloadImages(qtdInicial = 20) {
    for (let i = 0; i < qtdInicial; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
    }
  }

  function loadAllImages() {
    return new Promise((resolve) => {
      for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);
        img.onload = () => framesValidos.add(i);
        images[i] = img;
      }
      resolve();
    });
  }

  function drawFrame(index) {
    index = Math.max(0, Math.min(totalFrames - 1, index));

    if (!framesValidos.has(index)) {
      let offset = 1;
      let found = false;

      while (!found && offset < totalFrames) {
        const prev = index - offset;
        const next = index + offset;

        if (framesValidos.has(prev)) {
          index = prev;
          found = true;
        } else if (framesValidos.has(next)) {
          index = next;
          found = true;
        }

        offset++;
      }

      if (!found) return;
    }

    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    context.clearRect(0, 0, canvas.width, canvas.height);

    let drawWidth, drawHeight;
    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = img.width * (canvas.height / img.height);
    } else {
      drawWidth = canvas.width;
      drawHeight = img.height * (canvas.width / img.width);
    }

    const dx = (canvas.width - drawWidth) / 2;
    const dy = (canvas.height - drawHeight) / 2;

    context.drawImage(img, dx, dy, drawWidth, drawHeight);
  }

  function resizeCanvas() {
    if (!container || !canvas) return;
    canvas.width = container.clientWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrame);
  }

  function handleScroll() {
    const scrollTop = window.scrollY;
    const containerTop = container.offsetTop;
    const containerBottom = containerTop + scrollyDuration;

    const isInView = scrollTop >= containerTop && scrollTop <= containerBottom;
    canvas.style.visibility = isInView ? 'visible' : 'hidden';

    if (isInView) {
      const progress = scrollTop - containerTop;
      const percent = Math.min(1, Math.max(0, progress / scrollyDuration));
      currentFrame = Math.floor(percent * totalFrames);
      drawFrame(currentFrame);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  onMount(() => {
    isMobile = window.innerWidth < 768;
    context = canvas.getContext('2d');

    preloadImages();

    loadAllImages().then(() => {
      isLoaded = true;
      drawFrame(0);
    });

    resizeCanvas();
    handleScroll();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<style>
  .scroll-frame-container {
    height: var(--altura-scroll, 5000px);
    position: relative;
    background: #fff;
    z-index: 0;
  }

  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1;
    pointer-events: none;
    visibility: hidden; /* oculta fora da seção */
  }

  .fallback {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100vh;
    object-fit: contain;
    background: #fff;
    z-index: 0;
  }
</style>

<div class="scroll-frame-container" bind:this={container} style="--altura-scroll: {scrollyDuration}px">
  {#if !isLoaded}
    <img
      class="fallback"
      src="{isMobile ? posterMob : posterDesk}"
      alt="carregando..."
    />
  {/if}
  <canvas bind:this={canvas}></canvas>
</div>
