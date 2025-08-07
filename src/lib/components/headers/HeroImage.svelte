<script>
  import { onMount } from 'svelte';

  // --- Props de Imagem ---
  export let desktopImage = "https://via.placeholder.com/1920x600?text=Desktop+Hero";
  export let mobileImage = "https://via.placeholder.com/768x400?text=Mobile+Hero";
  export let altText = "Imagem de fundo da narrativa";
  export let height = "600px"; // Altura do componente HeroImage
  export let backgroundPosition = "center center"; // Ex: 'center center', 'top left', '50% 50%'

  // --- Props de Texto (Título) ---
  export let titleDesktop = "Título da Narrativa (Desktop)";
  export let titleMobile = "Título da Narrativa (Mobile)";
  export let titleDesktopSize = "3em";
  export let titleMobileSize = "2em";
  export let titleColor = "white";
  export let titleDesktopWeight = "normal"; // 'light', 'normal', 'bold'
  export let titleMobileWeight = "normal"; // 'light', 'normal', 'bold'
  export let titleDesktopLineHeight = "1.2";
  export let titleMobileLineHeight = "1.2";
  export let titleDesktopLetterSpacing = "0em"; // 'kern' é 'letter-spacing' no CSS
  export let titleMobileLetterSpacing = "0em";
  export let titleDeskTextShadow = "2px 2px 4px rgba(0, 0, 0, 0.7);";
  export let titleMobileTextShadow = "2px 2px 4px rgba(0, 0, 0, 0.7);";

  // --- Props de Texto (Linha Fina / Subtítulo) ---
  export let subtitleDesktop = "Subtítulo da Narrativa (Desktop)";
  export let subtitleMobile = "Subtítulo da Narrativa (Mobile)";
  export let subtitleDesktopSize = "1.2em";
  export let subtitleMobileSize = "1em";
  export let subtitleColor = "white";
  export let subtitleDesktopWeight = "normal";
  export let subtitleMobileWeight = "normal";
  export let subtitleDesktopLineHeight = "1.5";
  export let subtitleMobileLineHeight = "1.5";
  export let subtitleDesktopLetterSpacing = "0em";
  export let subtitleMobileLetterSpacing = "0em";

  // --- Prop de Alinhamento de Texto ---
  // top-left, top-center, top-right, center-left, center-center, center-right, bottom-left, bottom-center, bottom-right
  export let textAlignment = "center-center";

  // Variáveis reativas para controle de mobile/desktop
  let isMobile = false;

  // Função para determinar o peso da fonte CSS
  function getFontWeight(weight) {
    switch (weight) {
      case 'light': return 300;
      case 'normal': return 400;
      case 'bold': return 700;
      default: return 400;
    }
  }

  // Detectar mobile ao carregar o componente
  onMount(() => {
    const checkMobile = () => {
      isMobile = window.matchMedia("(max-width: 768px)").matches; // Exemplo: mobile até 768px
    };
    checkMobile(); // Executa na montagem
    window.addEventListener('resize', checkMobile); // Reage a redimensionamento
    return () => window.removeEventListener('resize', checkMobile); // Limpeza
  });

  $: currentImage = isMobile ? mobileImage : desktopImage;
  $: currentTitle = isMobile ? titleMobile : titleDesktop;
  $: currentSubtitle = isMobile ? subtitleMobile : subtitleDesktop;

  // --- Estilos dinâmicos do título ---
  $: titleStyle = `
    font-size: ${isMobile ? titleMobileSize : titleDesktopSize};
    color: ${titleColor};
    font-weight: ${getFontWeight(isMobile ? titleMobileWeight : titleDesktopWeight)};
    line-height: ${isMobile ? titleMobileLineHeight : titleDesktopLineHeight};
    letter-spacing: ${isMobile ? titleMobileLetterSpacing : titleDesktopLetterSpacing};
    text-shadow: ${isMobile ? titleMobileTextShadow : titleDeskTextShadow};
  `;

  // --- Estilos dinâmicos do subtítulo ---
  $: subtitleStyle = `
    font-size: ${isMobile ? subtitleMobileSize : subtitleDesktopSize};
    color: ${subtitleColor};
    font-weight: ${getFontWeight(isMobile ? subtitleMobileWeight : subtitleDesktopWeight)};
    line-height: ${isMobile ? subtitleMobileLineHeight : subtitleDesktopLineHeight};
    letter-spacing: ${isMobile ? subtitleMobileLetterSpacing : subtitleDesktopLetterSpacing};
  `;

  // --- Classes para alinhamento de texto (usando CSS Grid) ---
  $: alignmentClass = '';
  switch (textAlignment) {
    case 'top-left': alignmentClass = 'align-top-left'; break;
    case 'top-center': alignmentClass = 'align-top-center'; break;
    case 'top-right': alignmentClass = 'align-top-right'; break;
    case 'center-left': alignmentClass = 'align-center-left'; break;
    case 'center-center': alignmentClass = 'align-center-center'; break;
    case 'center-right': alignmentClass = 'align-center-right'; break;
    case 'bottom-left': alignmentClass = 'align-bottom-left'; break;
    case 'bottom-center': alignmentClass = 'align-bottom-center'; break;
    case 'bottom-right': alignmentClass = 'align-bottom-right'; break;
    default: alignmentClass = 'align-center-center'; // Padrão
  }
</script>

<style>
  .hero-container {
    width: 100%;
    height: var(--hero-height); /* Usa a prop de altura */
    background-size: cover;
    background-repeat: no-repeat;
    background-position: var(--bg-position);
    display: grid; /* Usamos Grid para alinhamento de conteúdo */
    place-items: center; /* Centraliza o conteúdo por padrão */
    position: relative; /* Para posicionar conteúdo absoluto se necessário */
    overflow: hidden; /* Garante que nada transborde */
    font-family: sans-serif; /* Fonte padrão */
  }

  .hero-content {
    padding: 0px; /* Espaçamento interno para o texto */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); /* Sombra para o texto para melhor legibilidade */
    max-width: 100%; /* Limita a largura do texto para não esticar demais */
    z-index: 1; /* Garante que o texto esteja acima da imagem */
    /* Estilos para o alinhamento via Grid */
    grid-area: 1 / 1 / 2 / 2; /* Faz com que o conteúdo ocupe a única célula do grid */
  }

  h2 {
    margin: 0;
    line-height: var(--title-line-height);
    letter-spacing: var(--title-letter-spacing);
    font-weight: var(--title-font-weight);
    font-size: var(--title-font-size);
    color: var(--title-color);
  }

  p {
    margin: 0;
    line-height: var(--subtitle-line-height);
    letter-spacing: var(--subtitle-letter-spacing);
    font-weight: var(--subtitle-font-weight);
    font-size: var(--subtitle-font-size);
    color: var(--subtitle-color);
  }

  /* --- Classes de Alinhamento de Texto (usando CSS Grid) --- */
  .align-top-left { place-items: start start; text-align: left; }
  .align-top-center { place-items: start center; text-align: center; }
  .align-top-right { place-items: start end; text-align: right; }
  .align-center-left { place-items: center start; text-align: left; }
  .align-center-center { place-items: center center; text-align: center; }
  .align-center-right { place-items: center end; text-align: right; }
  .align-bottom-left { place-items: end start; text-align: left; }
  .align-bottom-center { place-items: end center; text-align: center; }
  .align-bottom-right { place-items: end end; text-align: right; }
</style>

<div
  class="hero-container {alignmentClass}"
  style="
    --hero-height: {height};
    background-image: url('{currentImage}');
    --bg-position: {backgroundPosition};
  "
  role="img"
  aria-label={altText}
>
  <div class="hero-content">
    {#if currentTitle}
      <h2 style="{titleStyle}">
        {currentTitle}
      </h2>
    {/if}
    {#if currentSubtitle}
      <p style="{subtitleStyle}">
        {currentSubtitle}
      </p>
    {/if}
  </div>
</div>