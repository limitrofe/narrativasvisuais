<script>
  import { onMount } from 'svelte';

  export let imageDesktop = '';
  export let imageMobile = '';
  export let count = 75;
  export let repeatCount = 3;

  let imageUrl = '';
  let capture;
  let observer;
  let started = false;

  async function startDisintegration() {
    if (started) return;
    started = true;

    imageUrl = window.innerWidth <= 768 ? imageMobile : imageDesktop;

    document.body.style.height = "300vh";

    const gsapModule = await import('gsap');
    const ScrollTriggerModule = await import('gsap/ScrollTrigger');
    const html2canvasModule = await import('html2canvas');

    const gsap = gsapModule.default || gsapModule;
    const ScrollTrigger = ScrollTriggerModule.default || ScrollTriggerModule;
    const html2canvas = html2canvasModule.default || html2canvasModule;

    gsap.registerPlugin(ScrollTrigger);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const images = document.querySelectorAll("#capture img");
    await Promise.all(Array.from(images).map(img => {
      return new Promise(resolve => {
        if (img.complete) resolve();
        else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });
    }));

    async function createCanvases(captureEl) {
      const canvas = await html2canvas(captureEl, {
        useCORS: true,
        allowTaint: true
      });

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

      let dataList = [];
      for (let i = 0; i < count; i++) {
        dataList.push(ctx.createImageData(canvasWidth, canvasHeight));
      }

      for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
          for (let l = 0; l < repeatCount; l++) {
            const index = (x + y * canvasWidth) * 4;
            const dataIndex = Math.floor(
              (count * (Math.random() + (2 * x) / canvasWidth)) / 3
            );
            if (dataIndex < count && dataIndex >= 0) {
              for (let p = 0; p < 4; p++) {
                dataList[dataIndex].data[index + p] = imageData.data[index + p];
              }
            }
          }
        }
      }

      const canvasElements = dataList.map((data, i) => {
        let clonedCanvas = canvas.cloneNode();
        clonedCanvas.getContext("2d").putImageData(data, 0, 0);
        clonedCanvas.className = "capture-canvas";
        clonedCanvas.style.position = "fixed";
        clonedCanvas.style.left = "50%";
        clonedCanvas.style.top = "50%";
        clonedCanvas.style.transform = "translate(-50%, -50%)";
        clonedCanvas.style.zIndex = "100";
        document.body.appendChild(clonedCanvas);
        return clonedCanvas;
      });

      captureEl.style.visibility = "hidden";

      canvasElements.forEach((clonedCanvas, i) => {
        const randomAngle = (Math.random() - 0.5) * 2 * Math.PI;
        const randomRotationAngle = 30 * (Math.random() - 0.5);

        let tl = gsap.timeline({
          scrollTrigger: {
            scrub: 1,
            start: "top top",
            end: "bottom bottom"
          }
        });

        tl.to(clonedCanvas, {
          duration: 1,
          rotation: randomRotationAngle,
          x: `+=${40 * Math.sin(randomAngle)}`,
          y: `+=${40 * Math.cos(randomAngle)}`,
          opacity: 0,
          delay: (i / dataList.length) * 2
        });
      });
    }

    await createCanvases(capture);
  }

  onMount(() => {
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        startDisintegration();
      }
    }, {
      threshold: 0.3 // só inicia quando ~30% do elemento está visível
    });

    if (capture) observer.observe(capture);

    return () => {
      observer?.disconnect();
      document.querySelectorAll('.capture-canvas').forEach(canvas => canvas.remove());
      document.body.style.height = "";
    };
  });
</script>

<div id="capture" bind:this={capture}>
  {#if imageUrl}
    <img src={imageUrl} alt="Imagem responsiva" />
  {/if}
</div>

<style>
  #capture {
    position: relative;
    width: 100vw;
    overflow: hidden;
    z-index: 10;
  }

  #capture img {
    width: 100vw;
    height: auto;
    display: block;
    user-select: none;
  }

  :global(.capture-canvas) {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }
</style>
