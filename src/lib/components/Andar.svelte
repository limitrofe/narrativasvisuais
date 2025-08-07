<script>
  import { onMount } from 'svelte';

  // --- Props para tornar o componente reutilizável ---
  export let preTitulo = "Nº Andar";
  export let titulo = "Nome do Andar";
  export let descricao = "Descrição do andar...";
  export let corCard = "#2c2a4a"; // Cor de fundo do card de texto
  export let bgSrc = ""; // Imagem de fundo da seção inteira
  
  // Imagens que farão a animação de parallax
  export let foto1Src = "";
  export let foto2Src = "";
  export let foto3Src = "";

  /**
   * SVELTE ACTION: trackScroll
   * Esta função monitora a posição de rolagem DENTRO do elemento em que é usada.
   * Ela calcula um --scroll-progress (de 0 a 1) e o injeta como uma variável CSS,
   * permitindo que o CSS reaja ao scroll de forma super performática.
   */
  function trackScroll(node) {
    const handleScroll = () => {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calcula o progresso. Começa em 0 quando o topo do elemento atinge o topo da tela,
      // e termina em 1 quando o final do elemento atinge o final da tela.
      const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)));

      // Injeta a variável no estilo do elemento
      node.style.setProperty('--scroll-progress', progress.toPrecision(3));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Executa uma vez para definir o estado inicial

    return {
      destroy() {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }
</script>

<style>
  .andar-section {
    /* A seção precisa ser bem alta para ter espaço para o scroll */
    min-height: 180vh;
    width: 100%;
    position: relative;
    background-image: var(--bg-image-url);
    background-size: cover;
    background-position: center;
    background-attachment: fixed; /* O fundo fica fixo, criando um efeito de parallax */
    padding: 2rem;
    box-sizing: border-box;
    overflow: hidden; /* Garante que as imagens não "vazem" */
  }

  .content-wrapper {
    /* Este container segura o card e as imagens */
    position: sticky;
    top: 0;
    height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center; /* Alinha o card e as imagens */
  }

  .text-card {
    position: absolute;
    top: 80px; /* Posição do card */
    left: 0;
    background-color: var(--card-color);
    color: white;
    padding: 2rem 2.5rem;
    border-radius: 0 12px 12px 0; /* Borda arredondada só na direita */
    z-index: 10;
    width: 35%;
    min-width: 300px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
  .text-card .pre-titulo {
    font-weight: bold;
    font-size: 1rem;
    opacity: 0.8;
  }
  .text-card .titulo {
    font-size: 3.5rem;
    font-weight: 800;
    margin: 0.5rem 0;
    line-height: 1;
  }
  .text-card .descricao {
    font-size: 1rem;
    line-height: 1.5;
    opacity: 0.9;
  }

  /* Container das imagens que animam */
  .images-container {
    position: relative;
    flex-grow: 1;
    height: 100%;
    width: 100%;
  }

  .parallax-image {
    position: absolute;
    width: 45%; /* Tamanho da imagem */
    border: 5px solid white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.4);
    will-change: transform; /* Otimização para o navegador */

    /* A mágica acontece aqui, usando a variável --scroll-progress */
    /* Cada imagem tem valores iniciais e finais diferentes para criar o efeito de sobreposição */
  }

  .foto-1 {
    top: 50%;
    left: 40%;
    z-index: 3;
    /* Move de -100% (fora da tela em cima) para 0% (posição final), rotacionando */
    transform: 
      translateY(calc(-100% + 100% * var(--scroll-progress, 0))) 
      translateX(-50%)
      rotate(calc(15deg - 20deg * var(--scroll-progress, 0)));
  }

  .foto-2 {
    top: 50%;
    left: 55%;
    z-index: 2;
     /* Começa na posição Y 50% e sobe um pouco, rotacionando para o outro lado */
    transform: 
      translateY(calc(50% - 70% * var(--scroll-progress, 0)))
      translateX(-50%)
      rotate(calc(-15deg + 25deg * var(--scroll-progress, 0)));
  }

  .foto-3 {
    top: 50%;
    left: 35%;
    z-index: 1;
    /* Começa na posição Y 100% (embaixo) e sobe bastante, ficando quase reta */
    transform:
      translateY(calc(100% - 130% * var(--scroll-progress, 0)))
      translateX(-50%)
      rotate(calc(5deg * var(--scroll-progress, 0)));
  }

  /* Ajustes para mobile */
  @media (max-width: 768px) {
    .andar-section { min-height: 120vh; }
    .content-wrapper { flex-direction: column; position: relative; }
    .text-card { position: relative; width: 90%; top: 0; border-radius: 12px; }
    .parallax-image { width: 80%; left: 10%; }
    .foto-1, .foto-2, .foto-3 { top: 20%; } /* Simplifica a posição no mobile */
  }

</style>

<div class="andar-section" use:trackScroll style="--bg-image-url: url({bgSrc});">
  <div class="content-wrapper">
    
    <div class="text-card" style="--card-color: {corCard};">
      <div class="pre-titulo">{preTitulo}</div>
      <h2 class="titulo">{titulo}</h2>
      <p class="descricao">{descricao}</p>
    </div>

    <div class="images-container">
      <img class="parallax-image foto-1" src={foto1Src} alt="Foto 1 do {titulo}" />
      <img class="parallax-image foto-2" src={foto2Src} alt="Foto 2 do {titulo}" />
      <img class="parallax-image foto-3" src={foto3Src} alt="Foto 3 do {titulo}" />
    </div>

  </div>
</div>