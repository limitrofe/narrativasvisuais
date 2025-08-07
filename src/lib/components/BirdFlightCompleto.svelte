<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
    gsap.registerPlugin(ScrollTrigger);
  
    export let imagemDesk = '';
    export let imagemMob = '';
    export let pontosDesk = [];
    export let pontosMob = [];
    export let alturaMaskDesktop = 900;
    export let alturaMaskMobile = 600;
    export let margemFinal = 0;
  
    // Lista de conteúdos: texto, imagem ou vídeo
    export let conteudos = [];
  
    let container;
    let imagemEl;
    let scrollArea;
    let imagemAtual = '';
    let pontosAtuais = [];
    let isMobile = false;
  
    function lerp(a, b, t) {
      return a + (b - a) * t;
    }
  
    function getPositionFromProgress(p, pontos) {
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
  
    onMount(() => {
      isMobile = window.innerWidth <= 768;
      imagemAtual = isMobile ? imagemMob : imagemDesk;
      pontosAtuais = isMobile ? pontosMob : pontosDesk;
  
      const scrollDuration = pontosAtuais.length * 800;
      scrollArea.style.height = `${scrollDuration + margemFinal}px`;
  
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${scrollDuration}`,
        pin: true,
        scrub: true,
        onUpdate: self => {
          const progress = self.progress;
          const { x, y } = getPositionFromProgress(progress, pontosAtuais);
          gsap.set(imagemEl, { x: -x, y: -y });
  
          conteudos.forEach(item => {
            if (progress >= item.triggerAt && !item.shown && item.el) {
              item.shown = true;
              gsap.to(item.el, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
            }
          });
        }
      });
    });
  </script>
  
  <style>
    .birdflight-wrapper {
      position: relative;
      width: 100%;
    }
  
    .birdflight-container {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100vh;
      max-width: 100vw;
      margin: 0 auto;
    }
  
    .birdflight-imagem {
      position: absolute;
      top: 0;
      left: 0;
      width: auto;
      height: 100vh;
      will-change: transform;
    }
  
    .scrollarea {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: -1;
    }
  
    .conteudo-overlay {
      position: absolute;
      opacity: 0;
      transform: translateY(50px); /* inicia deslocado */
      pointer-events: none;
      z-index: 10;
    }
  
    .conteudo-overlay.texto {
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      max-width: 300px;
    }
  
    .conteudo-overlay.imagem img {
      width: 200px;
      height: auto;
    }
  
    .conteudo-overlay.video video {
      width: 300px;
      height: auto;
    }
  </style>
  
  <div class="birdflight-wrapper">
    <div class="birdflight-container" bind:this={container}>
      <img bind:this={imagemEl} class="birdflight-imagem" src={imagemAtual} alt="Sobrevoo" />
  
      {#each conteudos as item (item.triggerAt)}
        <div
          class="conteudo-overlay {item.tipo}"
          style="
            transform: translate({item.x}px, {item.y}px);
            {item.estilo?.[isMobile ? 'mob' : 'desk']}
          "
          bind:this={item.el}
        >
          {#if item.tipo === 'texto'}
            {item.conteudo[isMobile ? 'mob' : 'desk']}
          {:else if item.tipo === 'imagem'}
            <img src={item.conteudo[isMobile ? 'mob' : 'desk']} alt="" />
          {:else if item.tipo === 'video'}
            <video
              src={item.conteudo[isMobile ? 'mob' : 'desk']}
              autoplay muted loop playsinline
            />
          {/if}
        </div>
      {/each}
    </div>
  
    <div class="scrollarea" bind:this={scrollArea}></div>
  </div>
  