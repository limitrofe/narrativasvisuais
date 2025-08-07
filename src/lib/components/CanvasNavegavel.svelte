<script>
    import { onMount, tick, onDestroy } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
    gsap.registerPlugin(ScrollTrigger);
  
    export let canvasWidth = 5000;
    export let canvasHeight = 5000;
    export let pontosVooDesk = [];
    export let pontosVooMob = [];
    export let elementos = [];
    export let imagemFundo = '';
    export let usarGradiente = false;
    export let corTrajeto = '#c4170c';
    export let strokeWidth = 0;
    export let strokeDasharray = '';
    export let strokeLinecap = 'round';
    export let fundo = 'transparent';
  
    let wrapper, camera, pathLine;
    $: refs = new Array(elementos.length);
    let isMobile = false;
    let pontosVoo = [];
    let scrollTriggerInstance;
    let elementScrollTriggers = [];
    let canvasClass = 'canvas-wrapper loading';
  
    function lerp(a, b, t) {
      return a + (b - a) * t;
    }
  
    function getPositionFromProgress(p, pontos) {
      if (!pontos || pontos.length < 2) return { x: 0, y: 0 };
      const total = pontos.length - 1;
      const indexFloat = p * total;
      const index = Math.floor(indexFloat);
      const t = indexFloat - index;
      if (index >= total) return pontos[total];
      const atual = pontos[index];
      const prox = pontos[index + 1];
      return {
        x: lerp(atual.x, prox.x, t),
        y: lerp(atual.y, prox.y, t)
      };
    }
  
    function gerarPath(pontos) {
      if (!pontos || pontos.length < 2) return '';
      let path = `M${pontos[0].x},${pontos[0].y}`;
      for (let i = 1; i < pontos.length; i++) {
        const prev = pontos[i - 1];
        const curr = pontos[i];
        const cx = (prev.x + curr.x) / 2;
        const cy = (prev.y + curr.y) / 2;
        path += ` Q${prev.x},${prev.y} ${cx},${cy}`;
      }
      return path;
    }
  
    async function setupScrollTrigger() {
      isMobile = window.innerWidth <= 768;
      pontosVoo = isMobile && pontosVooMob.length > 0 ? pontosVooMob : pontosVooDesk;
      if (!pontosVoo || pontosVoo.length < 2) return;
      await tick();
  
      const startPos = getPositionFromProgress(0, pontosVoo);
      gsap.set(camera, { x: -startPos.x, y: -startPos.y });
  
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      elementScrollTriggers.forEach(t => t?.kill());
      elementScrollTriggers = [];
  
      const margemRodape = -1500; // ajuste aqui a margem em pixels
const alturaFinal = pontosVoo[pontosVoo.length - 1].y + margemRodape;
  
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: `+=${alturaFinal}`,
        scrub: true,
        pin: camera,
        anticipatePin: 1,
        pinSpacing: false,
        onUpdate: self => {
          if (!camera || !pathLine) return;
          const { x, y } = getPositionFromProgress(self.progress, pontosVoo);
          gsap.set(camera, { x: -x, y: -y });
  
          try {
            const totalLength = pathLine.getTotalLength();
            pathLine.style.strokeDasharray = totalLength;
            pathLine.style.strokeDashoffset = totalLength * (1 - self.progress);
          } catch (e) {}
        }
      });
  
      refs.forEach((ref, index) => {
        if (!ref) return;
        gsap.set(ref, { opacity: 0, scale: 0.95 });
        const trigger = ScrollTrigger.create({
          trigger: ref,
          containerAnimation: scrollTriggerInstance,
          start: 'top bottom-=100',
          end: 'bottom top+=100',
          toggleActions: 'play none none reverse',
          onEnter: () => gsap.to(ref, { opacity: 1, scale: 1, duration: 0.5 }),
          onLeave: () => gsap.to(ref, { opacity: 0, scale: 0.95, duration: 0.5 }),
          onEnterBack: () => gsap.to(ref, { opacity: 1, scale: 1, duration: 0.5 }),
          onLeaveBack: () => gsap.to(ref, { opacity: 0, scale: 0.95, duration: 0.5 })
        });
        elementScrollTriggers.push(trigger);
      });
  
      canvasClass = 'canvas-wrapper';
    }
  
    function handleResize() {
      isMobile = window.innerWidth <= 768;
      setupScrollTrigger();
    }
  
    onMount(() => {
      requestAnimationFrame(() => {
        setupScrollTrigger();
        window.addEventListener('resize', handleResize);
      });
    });
  
    onDestroy(() => {
      scrollTriggerInstance?.kill();
      elementScrollTriggers.forEach(t => t?.kill());
      window.removeEventListener('resize', handleResize);
    });
  </script>
  
  <style>
    .canvas-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
  
    .loading {
      opacity: 0;
      pointer-events: none;
    }
  
    .canvas-camera {
      position: relative;
      width: var(--canvasWidth);
      height: var(--canvasHeight);
      will-change: transform;
    }
  
    .canvas-item {
      position: absolute;
      transition: transform 0.3s;
      will-change: transform, opacity;
    }
  
    .canvas-texto {
      font-family: 'Globotipo', sans-serif;
    }
  
    .path-svg {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 1;
    }
  </style>
  
  <div
    class={canvasClass}
    bind:this={wrapper}
    style="background: {fundo};"
  >
    <div
      class="canvas-camera"
      bind:this={camera}
      style="--canvasWidth: {canvasWidth}px; --canvasHeight: {canvasHeight}px;"
    >
      {#if imagemFundo}
        <img
          src={imagemFundo}
          alt="fundo"
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: {canvasWidth}px;
            height: {canvasHeight}px;
            object-fit: cover;
            z-index: 0;
          "
        />
      {/if}
  
      {#if pontosVoo && pontosVoo.length > 0}
        <svg class="path-svg" width={canvasWidth} height={canvasHeight}>
          {#if usarGradiente}
            <defs>
              <linearGradient id="gradienteTrajeto" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#c4170c" />
                <stop offset="100%" stop-color="#f4e7c4" />
              </linearGradient>
            </defs>
          {/if}
          <path
            bind:this={pathLine}
            d={gerarPath(pontosVoo)}
            fill="none"
            stroke={usarGradiente ? 'url(#gradienteTrajeto)' : corTrajeto}
            stroke-width={strokeWidth}
            stroke-linecap={strokeLinecap}
            stroke-dasharray={strokeDasharray}
          />
        </svg>
      {/if}
  
      {#each elementos as el, i (el.x + '-' + el.y)}
        <div
          class="canvas-item"
          bind:this={refs[i]}
          style="left: {el.x}px; top: {el.y}px"
        >
          {#if el.tipo === 'imagem'}
            <img
              src={isMobile ? el.imagemMob : el.imagemDesk}
              alt="imagem"
              style="width: {isMobile ? el.larguraMob || '100%' : el.larguraDesk || '300px'}"
              loading="lazy"
            />
          {:else if el.tipo === 'imagemComTexto'}
            <div style="width: {isMobile ? el.larguraMob || '100%' : el.larguraDesk || '300px'}">
              <img
                src={isMobile ? el.imagemMob : el.imagemDesk}
                alt="imagem"
                style="width: 100%"
                loading="lazy"
              />
              <p
                class="canvas-texto"
                style="
                  font-size: {isMobile ? el.textoEstilo?.tamanhoMob || '1rem' : el.textoEstilo?.tamanhoDesk || '1.5rem'};
                  line-height: {isMobile ? el.textoEstilo?.lineHeightMob || '1.2' : el.textoEstilo?.lineHeightDesk || '1.3'};
                  font-weight: {el.textoEstilo?.peso || '400'};
                  color: {el.textoEstilo?.cor || '#000'};
                "
              >{el.texto}</p>
            </div>
          {:else if el.tipo === 'video'}
            <video
              src={isMobile ? el.videoMob : el.videoDesk}
              preload="metadata"
              autoplay
              muted
              loop
              playsinline
              style="width: {isMobile ? el.larguraMob || '100%' : el.larguraDesk || '400px'}"
            ></video>
          {:else if el.tipo === 'audio'}
            <audio controls>
              <source src={el.mp3} type="audio/mp3" />
              Seu navegador não suporta áudio.
            </audio>
          {:else if el.tipo === 'texto'}
            <div style="width: {isMobile ? el.larguraMob || '100%' : el.larguraDesk || '400px'}">
              <p
                class="canvas-texto"
                style="
                  font-size: {isMobile ? el.textoEstilo?.tamanhoMob || '1rem' : el.textoEstilo?.tamanhoDesk || '1.5rem'};
                  line-height: {isMobile ? el.textoEstilo?.lineHeightMob || '1.2' : el.textoEstilo?.lineHeightDesk || '1.3'};
                  font-weight: {el.textoEstilo?.peso || '400'};
                  color: {el.textoEstilo?.cor || '#000'};
                "
              >{el.texto}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  