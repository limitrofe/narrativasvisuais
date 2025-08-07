<script>
    let familiaSelecionada = null;
  
    const imagens = {
      inicial: {
        desktop: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/img/guerreiros/abre-familias-desk.jpg',
        mobile: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/img/guerreiros/abre-familias.jpg',
        alt: 'Famílias Alencar e Bandeira'
      },
      alencar: {
        desktop: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/img/guerreiros/familias-alencar-desk.jpg',
        mobile: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/img/guerreiros/familias-alencar-mobi.jpg',
        alt: 'Família Alencar'
      },
      bandeira: {
        desktop: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/img/guerreiros/familias-bandeira-desk.jpg',
        mobile: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/img/guerreiros/familias-bandeira-mobi.jpg',
        alt: 'Família Bandeira'
      }
    };
  
    function handleClickLado(lado) {
      familiaSelecionada = (familiaSelecionada === lado) ? null : lado;
    }
  </script>
  
  <style>
    .familia-wrapper {
      position: relative;
      width: 100%;
      margin: auto;
    }
  
    .img-wrapper {
      width: 100%;
    }
  
    .img-wrapper picture, .img-wrapper img {
      width: 100%;
      display: block;
    }
  
    .click-zone {
      position: absolute;
      top: 0;
      height: 100%;
      width: 50%;
      z-index: 10;
      cursor: pointer;
    }
  
    .click-zone.left {
      left: 0;
    }
  
    .click-zone.right {
      right: 0;
    }
  </style>
  
  <div class="familia-wrapper">
    <div class="img-wrapper">
      <picture>
        <source srcset={imagens[familiaSelecionada || 'inicial'].mobile} media="(max-width: 768px)" />
        <img src={imagens[familiaSelecionada || 'inicial'].desktop} alt={imagens[familiaSelecionada || 'inicial'].alt} />
      </picture>
    </div>
  
    <!-- Zonas clicáveis fixas por cima da imagem -->
    <div class="click-zone left" on:click={() => handleClickLado('alencar')}></div>
    <div class="click-zone right" on:click={() => handleClickLado('bandeira')}></div>
  </div>
  