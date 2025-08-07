<script>
    import { onMount } from 'svelte';
  
    export let videoDesktop = '';
    export let videoMobile = '';
    export let posterDesktop = '';
    export let posterMobile = '';
    export let backgroundLayerColor = '#f9e8ca';
    export let count = 20;
    export let repeatCount = 2;
  
    let isMobile = false;
    let videoEl;
    let camaDeFundo;
    let selectedVideoSrc = '';
    let selectedPoster = '';
    let started = false;
    let fragments = [];
    let showButton = true;
    let timeout;
    let skipPressed = false;
    let videoWrapper;
    let mostrarHeader = true;
  
    function skipIntro() {
      if (!started) {
        skipPressed = true;
        showButton = false;
        handleDisintegrate();
      }
    }
  
    function voltarAoInicio() {
      mostrarHeader = true;
      started = false;
      skipPressed = false;
      showButton = true;
      document.body.style.overflow = 'hidden';
  
      setTimeout(() => {
        videoEl?.play();
        timeout = setTimeout(() => {
          if (!started) {
            showButton = false;
            handleDisintegrate();
          }
        }, 10000);
      }, 300);
    }
  
    async function handleDisintegrate() {
      if (started) return;
      started = true;
      clearTimeout(timeout);
  
      document.body.style.overflow = 'hidden';
      videoEl.pause();
      videoEl.currentTime = Math.max(0, videoEl.currentTime - 0.01);
  
      await new Promise(resolve => {
        const check = () => {
          if (videoEl.readyState >= 2) resolve();
          else setTimeout(check, 10);
        };
        check();
      });
  
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
      const backupCanvas = document.createElement('canvas');
      backupCanvas.width = canvas.width;
      backupCanvas.height = canvas.height;
      backupCanvas.className = 'disintegrate-backup';
      Object.assign(backupCanvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '10',
        pointerEvents: 'none'
      });
      backupCanvas.getContext('2d').putImageData(imageData, 0, 0);
      document.body.appendChild(backupCanvas);
  
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (camaDeFundo) camaDeFundo.style.opacity = '1';
        });
      });
  
      videoWrapper.remove();
  
      const { default: gsap } = await import('gsap');
      const fragmentCount = isMobile ? 25 : count;
      const dataList = Array.from({ length: fragmentCount }, () => ctx.createImageData(canvas.width, canvas.height));
  
      for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
          const index = (x + y * canvas.width) * 4;
          for (let l = 0; l < repeatCount; l++) {
            const dIndex = Math.floor((fragmentCount * (Math.random() + (2 * x) / canvas.width)) / 3);
            if (dIndex >= 0 && dIndex < fragmentCount) {
              for (let p = 0; p < 4; p++) {
                dataList[dIndex].data[index + p] = imageData.data[index + p];
              }
            }
          }
        }
      }
  
      fragments = dataList.map((data) => {
        const c = document.createElement('canvas');
        c.width = canvas.width;
        c.height = canvas.height;
        c.getContext('2d').putImageData(data, 0, 0);
        Object.assign(c.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          zIndex: '100',
          pointerEvents: 'none'
        });
        c.className = 'disintegrate-fragment';
        document.body.appendChild(c);
        return c;
      });
  
      await Promise.all(
        fragments.map((frag, i) => {
          const angle = (Math.random() - 0.5) * 2 * Math.PI;
          const rotation = 30 * (Math.random() - 0.5);
          return gsap.to(frag, {
            rotation,
            x: `+=${40 * Math.sin(angle)}`,
            y: `+=${40 * Math.cos(angle)}`,
            opacity: 0,
            delay: i * 0.02,
            duration: 0.3
          }).then();
        })
      );
  
      setTimeout(() => {
        document.body.style.overflow = 'auto';
        fragments.forEach(el => el.remove());
        fragments = [];
        // document.querySelector('.scroll-next')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
  
      setTimeout(() => {
        if (camaDeFundo) camaDeFundo.style.opacity = '0';
        document.querySelectorAll('.disintegrate-backup').forEach(el => el.remove());
        mostrarHeader = false;
      }, 1000);
    }
  
    onMount(() => {
      isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      selectedVideoSrc = isMobile ? videoMobile : videoDesktop;
      selectedPoster = isMobile ? posterMobile : posterDesktop;
      document.body.style.overflow = 'hidden';
  
      timeout = setTimeout(() => {
        if (!started) {
          showButton = false;
          handleDisintegrate();
        }
      }, 10000);
  
      videoEl?.play()?.catch(() => {});
  
      return () => {
        clearTimeout(timeout);
      };
    });
  </script>
  
  {#if mostrarHeader}
    <div class="background-layer" style="background-color: {backgroundLayerColor};"></div>
    <div class="background-cama" bind:this={camaDeFundo}></div>
  
    <div class="video-wrapper" bind:this={videoWrapper}>
      {#if selectedVideoSrc}
        <video
          bind:this={videoEl}
          src={selectedVideoSrc}
          poster={selectedPoster}
          autoplay
          muted
          playsinline
          class="hero-video"
          onerror={() => console.error('Erro ao carregar vídeo', selectedVideoSrc)}
        ></video>
      {/if}
    </div>
  {/if}
  
  {#if showButton}
    <button class="skip-intro" on:click={skipIntro}>Pular introdução</button>
  {/if}
  
  {#if !mostrarHeader}
    <button class="voltar-topo" on:click={voltarAoInicio}>Voltar ao início</button>
  {/if}
  
  <style>
    .background-layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
    }
  
    .background-cama {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #f9e8ca;
      z-index: 30;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.6s ease;
    }
  
    .video-wrapper {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      position: relative;
      z-index: 1;
    }
  
    .hero-video {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      object-fit: cover;
      z-index: 20;
      display: block;
      pointer-events: none;
      opacity: 1;
      transition: opacity 1s ease;
      background: transparent !important;
    }
  
    :global(.disintegrate-fragment),
    :global(.disintegrate-backup) {
      background: transparent !important;
    }
  
    .skip-intro {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 1rem 2.5rem;
      font-size: 1.1rem;
      font-weight: bold;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s;
    }
  
    .skip-intro:hover {
      background: rgba(0, 0, 0, 0.9);
    }
  
    .voltar-topo {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      background: #000;
      color: #fff;
      padding: 0.5rem 1.2rem;
      border: none;
      font-weight: bold;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
  