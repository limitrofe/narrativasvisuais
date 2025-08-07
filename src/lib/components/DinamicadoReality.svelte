<script>
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  // --- Dados do Infográfico (sem mudanças) ---
  const stages = [
    { id: 1, type: 'Seletivas', eliminated: '3 ELIMINADOS POR EPISÓDIO - 15, 17 e 22 de julho', start: 24, end: 15 },
    { id: 2, type: 'Fase de Times', eliminated: '1 ELIMINADO POR EPISÓDIO - 24, 29, 31 de julho, 05 e 07 de agosto', start: 15, end: 10 },
    { id: 3, type: 'Fase Individual', eliminated: '2 ELIMINADOS POR EPISÓDIO - 12 e 14 de agosto', start: 10, end: 6 },
    { id: 4, type: 'Semi Final', eliminated: '3 ELIMINADOS - 19 de agosto', start: 6, end: 3 },
    { id: 5, type: 'Final', eliminated: '3 FINALISTAS - 21 de agosto', start: 3, end: 1, winner: true }
  ];

  let activeStep = writable(0);
  let isMobile = false;
  let containerElement; // Referência ao container principal
  let stageElements = []; // Array para guardar os elementos de cada etapa

  onMount(() => {
    // Usamos matchMedia, que é a forma moderna e eficiente de verificar o tamanho da tela
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    function setupScrollBehavior(event) {
      isMobile = event.matches;
      // Limpa listeners antigos para não ter duplicação
      cleanupListeners();

      if (isMobile) {
        // --- LÓGICA MOBILE: Intersection Observer ---
        // Ele observa os elementos e nos diz quando eles entram na tela
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.dataset.index);
              activeStep.set(index);
            }
          });
        }, {
          rootMargin: '-40% 0px -40% 0px' // Ativa o item quando ele está mais ou menos no meio da tela
        });

        // Pede para o observer "vigiar" cada uma das etapas
        stageElements.forEach(el => observer.observe(el));
        
        // Função de limpeza para o observer
        window.cleanupListeners = () => observer.disconnect();

      } else {
        // --- LÓGICA DESKTOP: Scroll travado (original) ---
        const handleDesktopScroll = () => {
          const rect = containerElement.getBoundingClientRect();
          const progress = -rect.top / (rect.height - window.innerHeight);
          const currentStep = Math.floor(Math.max(0, Math.min(1, progress)) * stages.length);
          activeStep.set(Math.min(stages.length - 1, currentStep));
        };

        window.addEventListener('scroll', handleDesktopScroll, { passive: true });
        
        // Função de limpeza para o listener de scroll
        window.cleanupListeners = () => window.removeEventListener('scroll', handleDesktopScroll);
      }
    }

    // Define uma função global de limpeza (inicialmente vazia)
    window.cleanupListeners = () => {};

    // Roda a função uma vez para definir o comportamento inicial...
    setupScrollBehavior(mediaQuery);
    // ...e adiciona um listener para mudar o comportamento se o usuário redimensionar a tela
    mediaQuery.addEventListener('change', setupScrollBehavior);

    // Quando o componente for destruído, remove o listener de 'change'
    return () => {
      cleanupListeners(); // Limpa o listener de scroll ou o observer
      mediaQuery.removeEventListener('change', setupScrollBehavior);
    };
  });
</script>

<style>
  .pin-container {
    /* O truque: um container muito alto para dar "espaço" para a rolagem interna */
    height: 500vh; /* 100vh por etapa da animação */
    position: relative;
    background-color: #0c0b1e;
    z-index: 1001;
  }

  .sticky-content {
    /* O conteúdo visual que vai "grudar" no topo da tela */
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    /* overflow: hidden; <<< REMOVIDO: Agora o filho controla o overflow */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* O layout do infográfico */
  .infographic {
    width: 100%;
    max-width: 1400px;
    color: white;
    font-family: 'Globotipo', sans-serif; 
    background-color: #0c0b1e;
  scrollbar-width: none;

    /* --- ✨ NOVAS REGRAS PARA O DESKTOP --- */
    max-height: 90vh; /* Garante que o infográfico nunca seja maior que 90% da altura da tela */
    overflow-y: auto; /* Adiciona rolagem interna APENAS se o conteúdo ultrapassar a altura máxima */
    padding: 2rem; /* Mantém o padding lateral e adiciona um respiro vertical */
  }

  .header {
    text-align: center;
    margin-bottom: 0rem;
    /* Começa um pouco apagado */
    opacity: 0.2;
    transition: opacity 0.5s ease;
    background-color: #0c0b1e;
    padding-top: 1rem; /* Reduzido um pouco pois .infographic já tem padding */
    font-family: 'Globotipo', sans-serif; 
  }

  .header.active {
    opacity: 1;
  }

  .header h2 {
    font-size: 1.2rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    margin-bottom: 0.5rem;
    font-family: 'Globotipo', sans-serif; 
  }

  .header .linha-fina {
    font-size: 1.1rem;
    font-weight: 300;
    color: #cccccc; /* Um cinza claro para diferenciar do título */
    max-width: 600px; /* Evita que a linha fique muito longa em telas grandes */
    margin: 1.5rem auto 0.5rem auto; /* Espaçamento vertical e centralização */
    line-height: 1.5;
    opacity: 0.9;
    background-color: #0c0b1e;
  }

  .header .stats {
    display: flex;
    justify-content: center;
    align-items: start;
    font-size: 2rem;
    font-weight: bold;
    font-family: 'Globotipo', sans-serif; 
  }

  .header .divider {
    border-left: 0px solid white;
    height: 40px;
    margin: 0 2rem;
  }

  /* Cada etapa do infográfico */
  .stage {
    display: grid;
    grid-template-columns: 1fr 2fr;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    position: relative;
    opacity: 0.2;
    transform: translateY(15px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .stage.active {
    opacity: 1;
    transform: translateY(0);
  }

  .stage-card {
    background-color: #d1263d;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    width: 400px;
    justify-self: center;
  }

  .stage-card h3 {
    margin: 0;
    font-size: 1.5rem;
    font-family: 'Globotipo', sans-serif; 
  }

  .stage-card p {
    margin: 0.5rem 0 0 0;
    font-size: 0.8rem;
    line-height: 1.2;
    font-family: 'Globotipo', sans-serif; 
  }

  .participant-info .count {
    font-size: 0.9rem;
    font-family: 'Globotipo', sans-serif; 
  }

  .icons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .icon {
    width: 16px;
    height: 16px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10zm0 12c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    transition: opacity 0.5s ease;
  }

  .icon.eliminated {
    opacity: 0.3;
  }
  
  /* ======================================= */
  /* ✨ AJUSTES PARA DISPOSITIVOS MÓVEIS ✨ */
  /* ======================================= */
  @media (max-width: 768px) {
    /* ✨ REGRAS PARA DESATIVAR A TRAVA DE TELA ✨ */
    .pin-container {
      height: auto;
    }
    .sticky-content {
      position: static;
      height: auto;
    }

    /* ✨ No mobile, resetamos o comportamento do infográfico ✨ */
    .infographic {
      padding: 0.1rem 1rem;
      max-height: none; /* Remove a limitação de altura */
      overflow-y: visible; /* Remove a rolagem interna */
    }
  
    .header {
      margin-top: 60px;
      padding-top: 2rem;
    }
    
    .header .stats {
      font-size: 1.5rem;
    }

    .header .divider {
      margin: 0 0.5rem;
    }

    .header .linha-fina {
      font-size: 1rem;
      margin-bottom: 0rem;
    }

    .stage {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .stage-card {
      width: 100%;
      max-width: 350px;
      justify-self: center;
    }

    .stage-card h3 {
      font-size: 1.2rem;
    }
    
    .participant-info .icons {
      justify-content: center;
    }
  }
  .infographic::-webkit-scrollbar {
  display: none;
}

</style>
<div class="pin-container" bind:this={containerElement}>
  <div class="sticky-content">
    
    <div class="infographic">
      <div class="header" class:active={$activeStep >= 0}>
    <h2>TEMPORADA 1</h2>

    <p class="linha-fina">Acompanhe a jornada dos participantes, desde as seletivas até a grande final.</p>

    <div class="stats">
      <div>
        <div>12</div>
        <div>EPISÓDIOS</div>
      </div>
      <div class="divider"></div>
      <div>
        <div>24</div>
        <div>PARTICIPANTES</div>
      </div>
    </div>
</div>

      <div class="header" class:active={$activeStep >= 0}>
        </div>

      {#each stages as stage, i}
        <div 
          class="stage" 
          class:active={$activeStep === i} 
          bind:this={stageElements[i]}
          data-index={i}
        >
          <div class="stage-card">
            <h3>{stage.type}</h3>
            <p>{stage.eliminated}</p>
          </div>
          <div class="participant-info">
            <div class="count">
              INÍCIO: {stage.start} PARTICIPANTES / FINAL: {stage.end} {stage.winner ? 'VENCEDOR' : 'PARTICIPANTES'}
            </div>
            <div class="icons">
              {#each {length: stage.start} as _, j}
                <div class="icon" class:eliminated={j >= stage.end}></div>
              {/each}
            </div>
          </div>
        </div>
      {/each}

    </div>
  </div>
</div>