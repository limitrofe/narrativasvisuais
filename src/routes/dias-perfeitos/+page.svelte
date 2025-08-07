<script>
  // --- SEUS IMPORTS E COMPONENTES ORIGINAIS (MANTIDOS) ---
  import BotaoFlutuante from '$lib/components/BotaoFlutuante.svelte';
  import Ancora from '$lib/components/Ancora.svelte';
  import ScrollyFrames from '$lib/components/ScrollyFrames.svelte';

  // --- [INÍCIO] CÓDIGO ADICIONADO PARA O MENU SLIDER ---
  import { onMount } from 'svelte';

  
</script>


<style>

    .menu-slider-container {
      position: sticky;
      top: 0;
      width: 100%;
      background: rgba(255, 0, 38, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 999999999000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-links-wrapper {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem 1rem;
      overflow-x: auto;
      white-space: nowrap;
      scroll-behavior: smooth;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    .menu-links-wrapper::-webkit-scrollbar {
      display: none;
    }

    .menu-links-wrapper a {
      color: white;
      text-decoration: none;
      font-weight: bold;
      font-size: 1rem;
      transition: color 0.3s ease;
      flex-shrink: 0;
    }
    
    .menu-links-wrapper a:hover {
      color: #FFC700;
    }
    
    .scroll-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.4);
      color: white;
      border: none;
      cursor: pointer;
      z-index: 10;
      font-size: 1.5rem;
      font-weight: bold;
      height: 100%;
      width: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    }
    
    .scroll-btn:hover {
      background-color: rgba(0, 0, 0, 0.7);
    }

    .scroll-btn.left {
      left: 0;
    }
    
    .scroll-btn.right {
      right: 0;
    }

    .menu-slider-container::before,
    .menu-slider-container::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 60px;
      z-index: 5;
      pointer-events: none;
      transition: opacity 0.4s ease;
      opacity: 0;
    }

    .menu-slider-container::before {
      left: 0;
      background: linear-gradient(to right, rgba(255, 0, 38, 1), transparent);
    }

    .menu-slider-container::after {
      right: 0;
      background: linear-gradient(to left, rgba(255, 0, 38, 1), transparent);
    }

    .menu-slider-container.show-left::before {
      opacity: 1;
    }
    .menu-slider-container.show-right::after {
      opacity: 1;
    }
    /* ==================================
      [FIM] ESTILOS DO MENU SLIDER
      ==================================
    */


    /* ================================== */
    /* SEUS ESTILOS ORIGINAIS (MANTIDOS)  */
    /* ================================== */
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-th.woff2') format('woff2');
      font-weight: 100;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-th-lt.woff2') format('woff2');
      font-weight: 100;
      font-style: italic;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-lt.woff2') format('woff2');
      font-weight: 300;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-lt-lt.woff2') format('woff2');
      font-weight: 300;
      font-style: italic;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-rg.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
      font-weight: 400;
      font-style: italic;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
      font-weight: 700;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
      font-weight: 700;
      font-style: italic;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
      font-weight: 900;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
      font-weight: 900;
      font-style: italic;
    }
  
    :global(body) {
      margin: 0;
      font-family: 'Globotipo', sans-serif; 
      background-color: #0c0b1e;
      color: #fff;
    }

    .content-section {
      min-height: 50vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      text-align: center;
    }

    .texto-wrapper {
      margin: 0;
      padding: 0;
    }
    .trigger-snippet {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    :global(.sub-titulo) {
      font-size: 2.5rem;
      font-weight: bold;
      line-height: 1.2;
      display: block;
      margin: 0.5rem 0;
    }

    .intro,
    .outro {
      height: 70vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 2rem;
    }

    .grid-imagens {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: -2rem;
      width: 90%;
      max-width: 1200px;
      margin: 0.1rem auto;
      padding: -2rem;
    }

    .imagem-item, .imagem-item-largo {
      width: 100%;
      height: auto;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .imagem-item-largo {
      grid-column: span 2;
    }

    @media (max-width: 768px) {
      :global(.sub-titulo) {
        font-size: 1rem;
      }

      .grid-imagens {
        grid-template-columns: 1fr 1fr;
        gap: 0.1rem;
      }

      .imagem-item-largo {
        grid-column: span 1;
      }
    }

    :global(.hotspot-content) {
      background: #0c0b1e;
      padding: 0px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      position: relative;
    }
    :global(.hotspot-content-transparencia) {
      background: none;
      padding: 0px;
      border-radius: 0px;
      box-shadow: 0;
      position: relative;
      opacity: 1;
    }
    :global(.hotspot-content2) {
      background: transparent;
      padding: 0px;
      border-radius: 0px;
      position: relative;
    }
    :global(.hotspot-content img) {
      display: block;
      width: 100%;
      border-radius: 4px;
    }
    :global(.hotspot-content-transparencia img) {
      display: block;
      width: 100%;
      border-radius: 0px;
      opacity: 1;
    }
    :global(.hotspot-content2 img) {
      display: block;
      width: 100%;
      border-radius: 4px;
    }
    :global(.pin) {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%) rotate(180deg);
      width: 20px;
      height: 20px;
      background: white;
      clip-path: polygon(0 0, 100% 0, 50% 100%);
    }
 #cenario{
    scroll-margin-top: 100px;
  }
  #game{
    scroll-margin-top: 100px;
  }
  #mentores{
    scroll-margin-top: 100px;
  }
  #creditos{
    scroll-margin-top: 100px;
  }
</style>
<ScrollyFrames
  framePrefix="/img/frames/parte2/frame_"
  totalFrames={59}
  frameExtension=".jpg"
  framePadding={4}
  height="400vh"
/>



