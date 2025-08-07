<script>
  import BotaoFlutuante from '$lib/components/BotaoFlutuante.svelte';
  import Ancora from '$lib/components/Ancora.svelte';

import Parallax from '$lib/components/Parallax.svelte';
import HorizontalReveal from '$lib/components/HorizontalReveal.svelte';
import HeroHeader from '$lib/components/HeroHeader.svelte';
import ImagemFull from '$lib/components/ImagemFull.svelte';
  import Section from '$lib/components/Section.svelte';
  import ScrollNotasSobreImagem from '$lib/components/ScrollNotasSobreImagem.svelte';
  import CaixaTexto from '$lib/components/CaixaTexto.svelte';
  import Titulo from '$lib/components/Titulo.svelte';
  import ImagemPro from '$lib/components/ImagemPro.svelte';
  import Snippet from '$lib/components/Snippet.svelte'; 
  import Andar from '$lib/components/Andar.svelte'; 
  import DinamicadoReality from '$lib/components/DinamicadoReality.svelte';
  import GaleriaCan from '$lib/components/GaleriaCan.svelte';
	import TextoLongo from '$lib/components/TextoLongo.svelte';
	import GloboPlayer from '$lib/components/GloboPlayer.svelte';
import GaleriaPolaroid from '$lib/components/GaleriaPolaroid.svelte';
  import Creditos from '$lib/components/Creditos.svelte';

  import { browser } from '$app/environment'; 

import InteractiveScroll from '$lib/components/InteractiveScroll.svelte';
  import Hotspot from '$lib/components/Hotspot.svelte';

  // Defina suas camadas aqui. Brinque com os valores de 'speed' para ver a mágica!
  // Para o exemplo funcionar, vamos usar imagens de placeholder.
  // Substitua pelas suas imagens.
const exampleLayers=[
    {
      // Propriedades padrão (desktop)
      src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/bg_desk.jpg',
      alt: 'Céu distante',
      speedY: -0.05,
      speedX: 0.05,
      zIndex: 1,
      // Propriedades que SÓ se aplicam no mobile
      mobile: {
        src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/bg_mob.jpg', // Imagem diferente para mobile
        speedY: -0.08, // Animação um pouco mais rápida no mobile
        speedX: -0.05,
      }
    },
    {
      src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/mentores_desk.png',
      alt: 'Apresentadora',
      speedY: -0.2,
      zIndex: 2,
      initialScale: 0.8,
      mobile: {
        src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/mentores_mob.png', // Imagem diferente para mobile
        initialScale: 0.71, // Um pouco menor no mobile para caber melhor
        speedY: 0.15,
      }
    },
    {
      src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/logoCan.png',
      alt: 'Logo do Canal',
      speedY: 0,
      zIndex: 5,
      initialScale: 0.55,
      mobile: {
        src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/logoCan-mob.png',
        initialScale: 0.6, // Maior e mais central no mobile
        speedY: -0.05,
      }
    },
    {
      // Esta camada não tem a chave 'mobile', então usará as mesmas propriedades em todas as telas
      src: 'https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/parallax/logoTV.png',
      alt: 'Logo da TV',
      speedX: 0,
      speedY: 0,
      zIndex: 5,
      initialScale: 0.65
    }
  ];
  const myCharacters=[
    {
      id: 1,
      name: "Alex Atala",
      photoUrl: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/mentor2.jpg",
      description: `Considerado um dos chefs mais influentes e renomados do mundo, Alex Atala construiu uma carreira sólida ao apostar em uma gastronomia autoral. No Chef de Alto Nível, ele assume o papel de mentor com a mesma intensidade com que conduz sua cozinha: exigente, mas profundamente comprometido com o crescimento dos participantes.`
    },
    {
      id: 2,
      name: "Jefferson Rueda",
      photoUrl: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/mentor1.jpg",
      description: `Se define como cozinheiro, açougueiro, defensor da agricultura familiar e caipira raiz. No reality, Jefferson Rueda quer incentivar o melhor dos participantes: "Se depender de mim, vou fazer o que precisar para o melhor da minha equipe. O dia a dia de uma cozinha não é fácil. É muito difícil. É muito prazeroso, mas é exaustivo.`
    },
    {
      id: 3,
      name: "Renata Vanzetto",
      photoUrl: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/mentora3.jpg",
      description: `Representa uma nova geração de chefs: empreendedora, sensível e com uma visão plural da gastronomia. No Chef de Alto Nível, ela se destaca por sua entrega emocional e por ser firme como mentora.`
    }
  ];

  const meuTitulo="Conheça Nossos Mentores";

function smoothScrollTo(id, event) {
  // 1. Impede o navegador de dar o "pulo" instantâneo
  event.preventDefault(); 
  
  // 2. Encontra o elemento da âncora pelo id
  const element = document.getElementById(id); 

  // 3. Se o elemento existir, manda o navegador rolar suavemente até ele
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth', // A mágica acontece aqui!
      block: 'start'      // Alinha o topo do elemento com o topo da tela
    });

    // Opcional: Atualiza a URL na barra de endereço
    history.pushState(null, null, `#${id}`);
  }
}

</script>
<nav class="menu-navegacao-suave">
  <!-- <a href="#game" on:click={(e) => smoothScrollTo('game', e)}>O Jogo</a> -->
  <a href="#header" on:click={(e) => smoothScrollTo('header', e)}>Início</a>
  <a href="#cenario" on:click={(e) => smoothScrollTo('cenario', e)}>Cozinhas</a>
  <a href="#dinamica" on:click={(e) => smoothScrollTo('dinamica', e)}>Dinâmica</a>
  <a href="#mentores" on:click={(e) => smoothScrollTo('mentores', e)}>Personagens</a>
  <!-- <a href="#participantes" on:click={(e) => smoothScrollTo('participantes', e)}>Galeria</a> -->
  <!-- <a href="#creditos" on:click={(e) => smoothScrollTo('creditos', e)}>Créditos</a> -->
</nav>

<style>
    .menu-navegacao-suave {
    position: sticky; /* Fica fixo no topo ao rolar a página */
    top: 0;
    width: 100%;
    background: rgba(255, 0, 38, 0.8); /* Fundo semi-transparente */
    backdrop-filter: blur(10px); /* Efeito de vidro fosco */
    z-index: 999999999000;
    display: flex;
    justify-content: center;
    padding: 1rem 0;
    gap: 1.5rem;
  }

  .menu-navegacao-suave a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
    transition: color 0.3s ease;
  }
  
  .menu-navegacao-suave a:hover {
    color: #FFC700; /* Cor de destaque ao passar o mouse */
  }



    /* ================================== */
    /* 1. DEFINIÇÃO DA FONTE GLOBOTIPO    */
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
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2'); /* Nota: este parece ser o mesmo arquivo do peso 700, pode ser necessário verificar o arquivo de fonte correto para 900 */
      font-weight: 900;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2'); /* Nota: o mesmo que acima */
      font-weight: 900;
      font-style: italic;
    }
  
    /* ================================== */
    /* 2. ESTILOS GERAIS COM A FONTE APLICADA */
    /* ================================== */
    :global(body) {
      margin: 0;
      /* APLICAÇÃO DA FONTE PADRÃO PARA TODO O SITE */
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

    /* ======================================== */
    /* NOVOS ESTILOS PARA A GRADE DE IMAGENS 1-2-1 */
    /* ======================================== */

    .grid-imagens {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr; /* Cria 2 colunas de largura igual */
      gap: -2rem;                      /* Espaçamento entre as imagens */
      width: 90%;
      max-width: 1200px;
      margin: 0.1rem auto;              /* Centraliza a grade na página */
      padding: -2rem;
    }

    /* Estilo base para todos os itens na grade */
    .imagem-item, .imagem-item-largo {
      width: 100%;
      height: auto;
      border-radius: 8px; /* Opcional: para bordas arredondadas */
      overflow: hidden;   /* Garante que a imagem não saia do container */
      box-shadow: 0 4px 15px rgba(0,0,0,0.2); /* Opcional: adiciona uma sombra */
    }

    /* Faz o item se expandir por 2 colunas */
    .imagem-item-largo {
      grid-column: span 2;
    }


    /* ================================== */
    /* AJUSTES RESPONSIVOS */
    /* ================================== */
    @media (max-width: 768px) {
      :global(.sub-titulo) {
        font-size: 1rem; /* Regra original mantida */
      }

      /* Regras da nova grade para mobile */
      .grid-imagens {
        /* Em telas menores, usa apenas 1 coluna */
        grid-template-columns: 1fr 1fr;
        gap: 0.1rem; /* Aumenta o espaço vertical no mobile */
      }

      /* No layout de 1 coluna, todos os itens ocupam 1 espaço */
      .imagem-item-largo {
        grid-column: span 1;
      }
    }

    /* ================================== */
    /* ESTILOS HOTSPOT */
    /* ================================== */
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
<BotaoFlutuante
  href="https://receitas.globo.com/receitas-da-tv/chef-de-alto-nivel/"
 backgroundColor="#FFC700"
    width="55px"
    height="55px"
    borderRadius="10px"
      ariaLabel="Tudo sobre Chef de Alto Nível"
>
  <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/can/receitas.svg" style="fill:#5A2864;">
</BotaoFlutuante>


  <Ancora id="header" />

  <Parallax layers={exampleLayers} />



<Ancora id="mentores" />
<HorizontalReveal 
  id="mentores"  title="Conheça Nossos Mentores"
  characters={myCharacters}
/>

  <Ancora id="participantes" />

<Section fundo="#0c0b1e" padding="10rem 0">
<GaleriaCan />
</Section>



<Section
  id="creditos"
  className="section-destaque animar"
  fundo="#0c0b1e"
  largura="100vw"
  
  alturaDesktop="120vh"
  padding="0"
  margin="0"
>

<Titulo
  className="section-destaque animar"
  texto="CRÉDITOS"
  cor="#d1263d"
  tamanhoDesk="3.2rem"
  tamanhoMob="2rem"
  espacamento="1rem"
  svgEsquerda=""
  svgDireita=""
/>

<Creditos
  corFundo="#0c0b1e"
  corTextoGeral="#232323"
  corFuncao="#d1263d"
  corNome="#fff"
  tamanhoFuncaoDesk="1.3rem"
  tamanhoNomeDesk="2.2rem"
  lineHeightFuncaoDesk="1.1"
  lineHeightNomeDesk="1.2"
  tamanhoFuncaoMob="1rem"
  tamanhoNomeMob="1.5rem"
  lineHeightFuncaoMob="1.18"
  lineHeightNomeMob="1.19"
  alinhamento="left"
  espacamentoItens="2rem"
  creditos={[
    { funcao: "Conteúdo", nome: "Patricia Farias" },
    { funcao: "Design", nome: "Guilherme Gomes, Juan Silva, Gabs e Kayan Albertin" },
    { funcao: "Dev", nome: "Guilherme Gomes" },
    { funcao: "Analista de produtos", nome: "Lucas Pappacena" },
    { funcao: "Coordenação", nome: "Patricia Farias (produtos) e Guilherme Gomes (design e desenvolvimento)" },
    { funcao: "", nome: "" }
    
  ]}
/>
</Section>


