<script>
  import { onMount, tick } from 'svelte';
  
  let gsap;
  let ScrollTrigger;
  
  export let imagemDesk = '';
  export let imagemMob = '';
  export let pontosDesk = [];
  export let pontosMob = [];
  export let alturaMaskDesktop = 900;
  export let alturaMaskMobile = 600;
  export let margemFinal = 0;
  export let larguraImagem = 1400;
  export let alturaImagem = 1000;
  
  let wrapper;
  let container;
  let imagemEl;
  let scrollArea;
  let imagemAtual = '';
  let pontosAtuais = [];
  let pontoAtualIdx = 0;
  let mounted = false;
  
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  
  function getPositionFromProgress(p, pontos) {
    const total = pontos.length - 1;
    const indexFloat = p * total;
    const index = Math.floor(indexFloat);
    const t = indexFloat - index;
    
    if (index >= total) return { ...pontos[total], idx: total };
    
    const atual = pontos[index];
    const prox = pontos[index + 1];
    
    // Mostra o texto do ponto atual durante toda a transição
    // Só muda para o próximo quando t > 0.5 (meio do caminho)
    const textoIdx = t > 0.5 ? Math.min(index + 1, total) : index;
    
    return {
      x: lerp(atual.x, prox.x, t),
      y: lerp(atual.y, prox.y, t),
      idx: textoIdx
    };
  }
  
  function initializeComponent() {
    if (!mounted || !imagemEl || !pontosAtuais.length) return;
    
    console.log('Inicializando com:', { imagemAtual, pontosAtuais });
    
    // Inicializa com o primeiro ponto
    pontoAtualIdx = 0;
    
    const scrollDuration = pontosAtuais.length * 800;
    scrollArea.style.height = `${scrollDuration + margemFinal}px`;
    
    // Limpa ScrollTriggers existentes
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === wrapper) {
        trigger.kill();
      }
    });
    
    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        console.log('ScrollTrigger ativado!');
        ScrollTrigger.create({
          trigger: wrapper,
          start: 'top top',
          end: `+=${scrollDuration}`,
          pin: container,
          pinSpacing: true,
          scrub: true,
          onUpdate: async (self) => {
            const { x, y, idx } = getPositionFromProgress(self.progress, pontosAtuais);
            gsap.set(imagemEl, { x: -x, y: -y });
            
            if (pontoAtualIdx !== idx) {
              console.log('Progresso:', self.progress.toFixed(2), 'IDX:', idx, pontosAtuais[idx]);
              pontoAtualIdx = idx;
              await tick();
            }
          }
        });
      }
    });
  }
  
  function setupResponsive() {
    const isMobile = window.innerWidth <= 768;
    imagemAtual = isMobile ? imagemMob : imagemDesk;
    pontosAtuais = isMobile ? pontosMob : pontosDesk;
    
    console.log('Setup responsivo:', { isMobile, imagemAtual, pontosAtuais });
    
    if (!pontosAtuais || pontosAtuais.length === 0) {
      console.warn('Sem pontos para configuração atual!');
      return false;
    }
    
    return true;
  }
  
  onMount(async () => {
    try {
      // Importa GSAP
      const g = await import('gsap');
      const ST = await import('gsap/ScrollTrigger');
      
      gsap = g.gsap;
      ScrollTrigger = ST.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      
      mounted = true;
      
      // Setup inicial
      if (setupResponsive()) {
        // Aguarda a imagem carregar antes de inicializar
        if (imagemEl) {
          if (imagemEl.complete) {
            initializeComponent();
          } else {
            imagemEl.onload = () => initializeComponent();
          }
        }
      }
      
      // Listener para resize
      const handleResize = () => {
        if (setupResponsive()) {
          // Aguarda um tick para garantir que a imagem foi atualizada
          tick().then(() => {
            if (imagemEl && imagemEl.complete) {
              initializeComponent();
            }
          });
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
      
    } catch (error) {
      console.error('Erro ao inicializar BirdFlight:', error);
    }
  });
  
  // Reativo para mudanças nas props
  $: if (mounted && (imagemDesk || imagemMob) && (pontosDesk.length || pontosMob.length)) {
    setupResponsive();
    tick().then(() => {
      if (imagemEl && imagemEl.complete) {
        initializeComponent();
      }
    });
  }
</script>

<style>
  .birdflight-wrapper {
    position: relative;
    width: 100%;
    height: auto;
    background-color: #f9e8ca;
    isolation: isolate;
    z-index: auto;
  }
  
  .birdflight-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden; /* Mudança aqui - era visible */
  }
  
  .birdflight-imagem {
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
    pointer-events: none;
    z-index: 0;
    display: block; /* Garante que a imagem seja exibida */
  }
  
  .overlay, .legenda {
    position: absolute;
    left: 30px;
    bottom: 70px;
    background: rgba(0,0,0,0.7);
    color: #fff;
    padding: 0.8rem 1.3rem;
    border-radius: 0.8rem;
    font-size: 1.1rem;
    z-index: 10;
    max-width: 350px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    pointer-events: auto;
    animation: fadeIn 0.7s;
  }
  
  .legenda {
    left: 30px;
    bottom: 30px;
    background: rgba(255,255,255,0.25);
    color: #222;
    font-size: 0.95rem;
    margin-top: 10px;
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    .overlay, .legenda {
      left: 10px;
      right: 10px;
      bottom: 60px;
      max-width: none;
      font-size: 1rem;
    }
    .legenda {
      bottom: 18px;
    }
  }
  
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(20px);
    }
    to { 
      opacity: 1; 
      transform: none;
    }
  }
  
  .scrollarea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
    z-index: -1;
  }
  
  .debug-info {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 100;
    background: rgba(0,0,0,0.1);
    color: #111;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
  }
</style>

<div class="birdflight-wrapper" bind:this={wrapper}>
  <div class="birdflight-container" bind:this={container}>
    {#if imagemAtual}
      <img
        bind:this={imagemEl}
        class="birdflight-imagem"
        src={imagemAtual}
        alt="Sobrevoo"
        style="width: {larguraImagem}px; height: {alturaImagem}px;"
        draggable="false"
        on:load={() => {
          console.log('Imagem carregada:', imagemAtual);
          if (mounted) initializeComponent();
        }}
        on:error={(e) => {
          console.error('Erro ao carregar imagem:', e);
        }}
      />
    {:else}
      <div class="birdflight-imagem" style="width: {larguraImagem}px; height: {alturaImagem}px; background: #ddd; display: flex; align-items: center; justify-content: center;">
        Carregando imagem...
      </div>
    {/if}
    
    <!-- Debug info mais detalhado -->
    <div class="debug-info">
      <div>idx: {pontoAtualIdx}/{pontosAtuais.length - 1}</div>
      <div>img: {imagemAtual ? 'LOADED' : 'NO IMAGE'}</div>
      <div>pts: {pontosAtuais.length} pontos</div>
      <div>gsap: {gsap ? 'OK' : 'NO GSAP'}</div>
      <div>mounted: {mounted ? 'YES' : 'NO'}</div>
    </div>
    
    <!-- Textos removidos temporariamente para debug -->
    <!-- {#if pontosAtuais && pontosAtuais[pontoAtualIdx]?.overlay}
      <div class="overlay">{@html pontosAtuais[pontoAtualIdx].overlay}</div>
    {/if}
    
    {#if pontosAtuais && pontosAtuais[pontoAtualIdx]?.legenda}
      <div class="legenda">{pontosAtuais[pontoAtualIdx].legenda}</div>
    {/if} -->
  </div>
  
  <div class="scrollarea" bind:this={scrollArea}></div>
</div>