<script>
import { onMount } from 'svelte';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

onMount(() => {
  gsap.utils.toArray('.animar').forEach(el => {
gsap.fromTo(
  el,
  { opacity: 0, y: 40 },
  {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
      //        ^^^^      ^^^^      ^^^^^^^
      //  play  pause   resume   reverse
    }
  }
);
  });
});


import MenuRodape from '$lib/components/MenuRodape.svelte';
    import GloboPlayer from '$lib/components/GloboPlayer.svelte';
    import Section from '$lib/components/Section.svelte';
    import Titulo from '$lib/components/Titulo.svelte';
    import TextoLongo from '$lib/components/TextoLongo.svelte';
    import FraseImagem from '$lib/components/FraseImagem.svelte';
    import Intertitulo from '$lib/components/Intertitulo.svelte';
    import ImagemVideoDuplo from '$lib/components/ImagemVideoDuplo.svelte';
    import ImagemFull from '$lib/components/ImagemFull.svelte';
    import CardSlider from '$lib/components/CardSlider.svelte';
    import SectionScrollHorizontal from '$lib/components/SectionScrollHorizontal.svelte';
    import ImagemDecorativa from '$lib/components/ImagemDecorativa.svelte';
    import PersonagemCard from '$lib/components/PersonagemCard.svelte';
    import CuriosidadeCard from '$lib/components/CuriosidadeCard.svelte';
    import CardSlider5 from '$lib/components/CardSlider5.svelte';
    import Creditos from '$lib/components/Creditos.svelte';

</script>
<div class="base">

<MenuRodape
  imagemTopo="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/logo.svg"
  imagemBgMenuDesk="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/bg-menu.jpg"
  imagemBgMenuMob="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/bg-menu.jpg"
  secoes={[
    { id: "trailer", label: "Trailer" },
    { id: "sinopse", label: "Sinopse" },
    { id: "trama", label: "Trama" },
    { id: "nucleos", label: "Núcleos" },
    { id: "curiosidades", label: "Curiosidades" },
    { id: "creditos", label: "Créditos" }
  ]}
/>

<Section 
  id="trailer"
  className="section-destaque animar"
  fundo="#ffe664"
  largura="100vw"
  alturaMobile="auto"
  alturaDesktop="auto"
  padding="0"
  margin="0"
>
  <div class="moldura-video-wrapper">
    <div class="player-area">
      <GloboPlayer
        videoId={13652205}       
        autoPlay={true}          
        startMuted={false}       
        skipDFP={true}           
        ga4={null}               
        on:ended={() => {}}
      />
    </div>
    <!-- Imagem da moldura para desktop -->
    <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/png-player-desk.png" class="moldura-img moldura-desk" alt="Moldura Desktop" />
    <!-- Imagem da moldura para mobile -->
    <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/png-player.png" class="moldura-img moldura-mob" alt="Moldura Mobile" />

    <h1 class="titulo-nuvem">
      Saiba tudo sobre <br>Êta Mundo Melhor!
    </h1>
  </div>
</Section>

<Section
  id="sinopse"
  className="section-destaque animar"
  fundo="#ffe664"
  largura="100vw"
  alturaMobile="auto"
  alturaDesktop="auto"
  padding="0"
  margin="0"
>
<div class="animar">

<Titulo
  className="section-destaque animar"
  texto="SINOPSE"
  cor="#232323"
  tamanhoDesk="3rem"
  tamanhoMob="2rem"
  espacamento="1rem"
  svgEsquerda="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/tit_esquerda.svg"
  svgDireita="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/tit_direita.svg"
/>
</div>

<div class="animar">
<TextoLongo
  className="section-destaque animar"
  texto="<p>Candinho e Policarpo estão de volta para novas aventuras e desafios. Com velhos amigos e novos parceiros, a dupla está pronta para superar qualquer obstáculo – até mesmo a busca por um filho perdido. </p>"
  largura="50%"    
  larguraMob = "90%"
  alinhamento="left"   
  animar={true}          
  tamanhoFonte="1.3rem"
  entrelinha="1.6"
  fundo="ffe664"
  cor="#232323"
  marginTopMob="1rem"
  marginBottomMob="0rem"
  paddingMob="1rem"
  marginTopDesk="0rem"
  marginBottomDesk="0rem"
  paddingDesk="2rem 4rem"
/>
</div>

<div class="animar">
<FraseImagem
  className="section-destaque animar"
  texto="Não há nada de tão bão que não possa meiorá!"
  autor="Candinho"
  fotoDesk="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/png/candinhoeoburro.webp"
  fotoMob="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/frase-candinho-8.png"
/>
</div>

</Section>

<Section
  id="trama"
  className="section-destaque animar"
  fundo="#ffe664"
  largura="100vw"
  alturaMobile="auto"
  alturaDesktop="auto"
  padding="0"
  margin="0"
>


<div class="animar">

<Titulo
  texto="ENTENDA A TRAMA"
  cor="#232323"
  tamanhoDesk="3.2rem"
  tamanhoMob="2rem"
  espacamento="1rem"
  svgEsquerda="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/tit_esquerda.svg"
  svgDireita="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/tit_direita.svg"
/>
</div>

<div class="animar">
<Intertitulo
  texto="São Paulo, 1940/1950"
  cor="#844812"
  tamanhoDesk="2.4rem"
  tamanhoMob="1.6rem"
  alinhamento="center"  
  peso={300}          
/>
</div>

<div class="animar">
  <Titulo
    texto="O FILHO PERDIDO"
    cor="#232323"
    tamanhoDesk="2.4rem"
    tamanhoMob="1.6rem"
    espacamento="1rem"
  />
  </div>
       
<div class="animar">

    <div class="player-trama">
      <GloboPlayer
        videoId={13662309}       
        autoPlay={true}          
        startMuted={false}       
        skipDFP={true}           
        ga4={null}               
        on:ended={() => {}}
      />
    </div>
    </div>


<div class="animar">
<TextoLongo
  texto="<p>Candinho agora vive na mansão herdada de sua mãe, Anastácia (Eliane Giardini, em Êta Mundo Bom!), ao lado de Policarpo e do filho, Júnior. Mas uma crueldade de Ernesto (Eriberto Leão) atinge em cheio o coração do caipira: durante uma tentativa de fuga com Filó (Débora Nascimento, em Êta Mundo Bom!), mãe do menino, o vilão sequestra o bebê. Filó, por sua vez, morre em um incêndio. E Ernesto some com o filho de Candinho, que se desespera.</p>"
  largura="50%"    
  larguraMob = "90%"
  alinhamento="left"   
  animar={true}          
  tamanhoFonte="1.3rem"
  entrelinha="1.6"
  fundo="transparent"
  cor="#232323"
  marginTopMob="1rem"
  marginBottomMob="0rem"
  paddingMob="0rem"
  marginTopDesk="0rem"
  marginBottomDesk="0rem"
  paddingDesk="2rem"
/>
</div>

  <div class="animar">
    <Titulo
      texto="UMA NOVA VILÃ"
      cor="#232323"
      tamanhoDesk="2.4rem"
      tamanhoMob="1.6rem"
      espacamento="1rem"
    />
  </div>
       
  <div class="animar">
    <div class="player-trama">
      <GloboPlayer
        videoId={13676948}       
        autoPlay={true}          
        startMuted={false}       
        skipDFP={true}           
        ga4={null}               
        on:ended={() => {}}
      />
    </div>
  </div>

<div class="animar">
<TextoLongo
  texto="<p>Júnior, filho de Candinho, vai parar no orfanato Casa dos Anjos, comandado por Zulma (Heloisa Périssé), prima de Ernesto. A vilã, que conta com a ajuda de Zenaide (Evelyn Castro), passa a chamar o menino de Samir e planeja um golpe do baú ao descobrir que a criança é filho de Candinho – o caipira milionário. </p><br> <p>No orfanato, Samir convive com outras crianças, que são exploradas por Zulma. Os pequenos confeccionam o “livro do coração”, que a malvada usa para aplicar golpes em viúvas e viúvos. </p>"
  largura="50%"    
  larguraMob = "90%"
  alinhamento="left"   
  animar={true}          
  tamanhoFonte="1.3rem"
  entrelinha="1.6"
  fundo="transparent"
  cor="#232323"
  marginTopMob="1rem"
  marginBottomMob="0rem"
  paddingMob="0rem"
  marginTopDesk="0rem"
  marginBottomDesk="0rem"
  paddingDesk="2rem"
/>
</div>
<div class="animar">
<ImagemFull
  srcDesk="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/orfanato.jpg"
  srcMob=""
  widthDesk="100vw"
  heightDesk="auto"
  widthMob="100vw"
  heightMob="auto"
  styleImg=""
  />

</div>
<div class="animar">
<TextoLongo
  texto="<p>No abrigo, vivem crianças que se tornam amigas - ou quem sabe rivais - de Samir (Davi Malizia), como Jasmim (Dandara Arcebispo), Aladin (Vicente Alvite), Simba (Arthur Yera), Denguinho (Maya Dias) e Felícia (Marina Cypriano)</p>"
  largura="50%"    
  larguraMob = "90%"
  alinhamento="left"   
  animar={true}          
  tamanhoFonte="1.3rem"
  entrelinha="1.6"
  fundo="transparent"
  cor="#232323"
  marginTopMob="1rem"
  marginBottomMob="0rem"
  paddingMob="0rem"
  marginTopDesk="0rem"
  marginBottomDesk="0rem"
  paddingDesk="2rem"
/>
</div>



<div class="animar">
    <Titulo
      texto="UM FALSO ALIADO"
      cor="#232323"
      tamanhoDesk="2.4rem"
      tamanhoMob="1.6rem"
      espacamento="1rem"
    />
  </div>
       
  <div class="animar">
    <div class="player-trama">
      <GloboPlayer
        videoId={13664909}       
        autoPlay={true}          
        startMuted={false}       
        skipDFP={true}           
        ga4={null}               
        on:ended={() => {}}
      />
    </div>
  </div>


<div class="animar">

<TextoLongo
  texto="<p>Enquanto Candinho encara a busca pelo menino, enfrenta também a ganância e as artimanhas dos que estão de olho em sua fortuna. Decepcionado por ter ficado de mãos abanando no testamento de tia Anastácia, Celso (Rainer Cadete) volta a se aliar à Sandra (Flávia Alessandra) para tentar abocanhar o dinheiro do primo. Tudo isso, claro, escondido de sua esposa, Maria (Bianca Bin).</p><br><p>Ele também engana a todos fingindo estar à procura do filho de Candinho, quando, na verdade, ele tem um pacto com Zulma para que ela mantenha o menino no orfanato.</p>"
  largura="50%"    
  larguraMob = "90%"
  alinhamento="left"   
  animar={true}          
  tamanhoFonte="1.3rem"
  entrelinha="1.6"
  fundo="transparent"
  cor="#232323"
  marginTopMob="1rem"
  marginBottomMob="0rem"
  paddingMob="0rem"
  marginTopDesk="0rem"
  marginBottomDesk="0rem"
  paddingDesk="2rem"
/>
</div>

<div class="animar">
    <Titulo
      texto="UMA PAIXÃO VERDADEIRA"
      cor="#232323"
      tamanhoDesk="2.4rem"
      tamanhoMob="1.6rem"
      espacamento="1rem"
    />
  </div>
       
  <div class="animar">
    <div class="player-trama">
      <GloboPlayer
        videoId={13671041}       
        autoPlay={true}          
        startMuted={false}       
        skipDFP={true}           
        ga4={null}               
        on:ended={() => {}}
      />
    </div>
  </div>


<div class="animar">

<TextoLongo
  texto="<p>Mesmo com todos os desafios, Candinho segue movido pela fé no reencontro com o filho e ganha o frescor de uma nova paixão, por uma velha conhecida: Dita (Jeniffer Nascimento), que se muda para a cidade grande em busca de uma vida melhor e reencontra Candinho.</p><br><p>Cansada da exploração que vive na fazenda de Cunegundes (Elizabeth Savala) e da preguiça de seu marido, Quincas (Miguel Rômulo), ela parte com o filho, Joaquim, e a tia, Manoela (Dhu Moraes), para São Paulo. Na cidade, ela vai lutar para se tornar uma grande cantora de rádio. </p>"
  largura="50%"    
  larguraMob = "90%"
  alinhamento="left"   
  animar={true}          
  tamanhoFonte="1.3rem"
  entrelinha="1.6"
  fundo="transparent"
  cor="#232323"
  marginTopMob="1rem"
  marginBottomMob="0rem"
  paddingMob="0rem"
  marginTopDesk="0rem"
  marginBottomDesk="0rem"
  paddingDesk="2rem"
/>
</div>


<div class="animar">
    <Titulo
      texto="UM SEGREDO DO PASSADO"
      cor="#232323"
      tamanhoDesk="2.4rem"
      tamanhoMob="1.6rem"
      espacamento="1rem"
    />
  </div>
       
  <div class="animar">
    <div class="player-trama">
      <GloboPlayer
        videoId={13689905}       
        autoPlay={true}          
        startMuted={false}       
        skipDFP={true}           
        ga4={null}               
        on:ended={() => {}}
      />
    </div>
  </div>




<div class="animar-ultimo">
<TextoLongo
  texto="<p>Estela (Larissa Manoela) é uma mulher forte, que trabalha como enfermeira e faz de tudo para cuidar de sua irmã mais nova, Anabela (Isabelly Carvalho), e de sua avó, Aurora (Lu Grimaldi), depois que seu pai morreu e sua mãe sumiu no mundo.</p><br><p>O que ninguém desconfia é que Estela guarda um grande mistério. Ao receber telegramas enigmáticos, ela se vê completamente atormentada e teme que seu segredo seja revelado. </p>"
  largura="50%"    
  larguraMob = "90%"
  alinhamento="left"   
  animar={true}          
  tamanhoFonte="1.3rem"
  entrelinha="1.6"
  fundo="transparent"
  cor="#232323"
  marginTopMob="1rem"
  marginBottomMob="0rem"
  paddingMob="0rem"
  marginTopDesk="0rem"
  marginBottomDesk="0rem"
  paddingDesk="2rem"
/>
<img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/png-trans.png" alt="Moldura" width="100%" style="padding:-100px;" />

</div>




</Section>





<Section
  id="nucleos"
  className="section-destaque"
  fundo="#6eb4a3"
  largura="auto"
  alturaMobile="auto"
  alturaDesktop="auto"
  padding="0"
  margin="0"
>

<Titulo
  texto="NÚCLEOS"
  cor="#232323"
  tamanhoDesk="3rem"
  tamanhoMob="2rem"
  espacamento="1rem"
  svgEsquerda="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/tit_esquerda.svg"
  svgDireita="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/tit_direita.svg"
/>
<CardSlider
  titulo="Mansão de Candinho"
  cards={[
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/candinho.jpg",
      nome: "Candinho",
      ator: "Sergio Guizé",
      descricao: "Continua o mesmo homem ingênuo, simples, caipira, cheio de positividade e amor pela vida, ao lado de seu fiel escudeiro, o burro Policarpo"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/samir.jpg",
      nome: "Samir",
      ator: "Davi Malizia",
      descricao: "É o filho perdido de Candinho, sequestrado por Ernesto (Eriberto Leão) no início da trama"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/asdrubal.jpg",
      nome: "Asdrúbal",
      ator: "Luis Miranda",
      descricao: "Professor, usa diferentes disfarces para conseguir informações sobre o filho desaparecido de Candinho (Sergio Guizé)"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/picole.jpg",
      nome: "Picolé",
      ator: "Isaac Amendoim",
      descricao: "Um dos principais confidentes de Candinho (Sergio Guizé), ajuda o amigo a procurar o filho perdido"
    },
    
    // ...mais cards, pode ser só 1 ou muitos...
  ]}
/>
<CardSlider
  titulo="São Paulo"
  cards={[
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/dita.jpg",
      nome: "Dita",
      ator: "Jeniffer Nascimento",
      descricao: "Sobrinha de Manoela (Dhu Moraes), se separa de Quincas (Miguel Rômulo) e vai para São Paulo tentar a vida de cantora"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/manoela.jpg",
      nome: "Manoela",
      ator: "Dhu Moraes",
      descricao: "Tia de Dita (Jeniffer Nascimento), parte com ela para São Paulo "
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/celso.jpg",
      nome: "Celso",
      ator: "Rainer Cadete",
      descricao: "Irmão de Sandra (Flávia Alessandra), marido de Maria (Bianca Bin) e primo de Candinho (Sergio Guizé) "
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/maria.jpg",
      nome: "Maria",
      ator: "Bianca Bin",
      descricao: "Mulher de Celso (Rainer Cadete), é grata por ele ter assumido o filho que esperava do noivo que morreu"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/estela.jpg",
      nome: "Estela",
      ator: "Larissa Manoela",
      descricao: "Estudante de Enfermagem com um passado misterioso"
    },
    // ...mais cards, pode ser só 1 ou muitos...
  ]}
/>
<CardSlider
  titulo="Os vilões"
  cards={[
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/ernesto.jpg",
      nome: "Ernesto",
      ator: "Eriberto Leão",
      descricao: "Vilão dado como morto no final da trama anterior, ele retorna para uma nova leva de maldades"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/sandra.jpg",
      nome: "Sandra",
      ator: "Flávia Alessandra",
      descricao: "A irmã de Celso (Rainer Cadete) está presa pelos crimes que cometeu no passado e aguarda ansiosa por sua liberdade condicional"
    },
    
    // ...mais cards, pode ser só 1 ou muitos...
  ]}
/>
<CardSlider
  titulo="Orfanato Casa dos Anjos"
  cards={[
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/zulma.jpg",
      nome: "Zulma",
      ator: "Heloísa Périssé",
      descricao: "Vilã com toques de humor. Dona do abrigo onde o filho de Candinho (Sergio Guizé), Samir (Davi Malizia), vai parar"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/zenaide.jpg",
      nome: "Zenaide",
      ator: "Evelyn Castro",
      descricao: "Funcionária e aliada de Zulma (Heloisa Périssé), vive uma relação de amor e ódio com a 'patroinha'"
    },
    
    // ...mais cards, pode ser só 1 ou muitos...
  ]}
/>
<CardSlider
  titulo="Sítio Dom Pedro II"
  cards={[
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/cunegundes.jpg",
      nome: "Cunegundes",
      ator: "Elizabeth Savala",
      descricao: "Dona do sítio onde Candinho (Sergio Guizé) foi criado e esposa de Quinzinho (Ary Fontoura)"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/quinzinho.jpg",
      nome: "Quinzinho",
      ator: "Ary Fontoura",
      descricao: "Dono do sítio onde Candinho (Sergio Guizé) foi criado e marido de Cunegundes (Elizabeth Savala)"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/medeia.jpg",
      nome: "Medéia",
      ator: "Betty Gofman",
      descricao: "Irmã de Quinzinho (Ary Fontoura), que surge para morar no sítio depois de ser misteriosamente abandonada pelo marido"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/quincas.jpg",
      nome: "Quincas",
      ator: "Miguel Rômulo",
      descricao: "Casado com Dita (Jeniffer Nascimento), pai de Joaquim (Tom Zé), filho de Cunegundes (Elizabeth Savala) e Quinzinho (Ary Fontoura)"
    },
    
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/20-mariadivina.jpg",
      nome: "Maria Divina",
      ator: "Castorine",
      descricao: "Assume o lugar de Manoela (Dhu Moraes) quando ela vai para São Paulo"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/zedosporcos.jpg",
      nome: "Zé dos Porcos",
      ator: "Anderson Di Rizzi",
      descricao: "Antigo funcionário do sítio, é abandonado por Mafalda (Camila Queiroz, em Êta Mundo Bom!). Desiludido, resolve nunca mais se apaixonar, até conhecer Maria Divina (Castorine)."
    },
    // ...mais cards, pode ser só 1 ou muitos...
  ]}
/>
<CardSlider
  titulo="A pensão"
  cards={[
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/margarida.jpg",
      nome: "Margarida",
      ator: "Nivea Maria",
      descricao: "É a dona nova dona da pensão que foi de Camélia (Ana Lúcia Torre, em Êta Mundo Bom!)"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/sonia.jpg",
      nome: "Sônia",
      ator: "Paula Burlamaqui",
      descricao: "Mulher bonita e independente, sofre preconceito por ser desquitada"
    },
    
    // ...mais cards, pode ser só 1 ou muitos...
  ]}
/>
<CardSlider
  titulo="A rádio"
  cards={[
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/lucio.jpg",
      nome: "Lúcio",
      ator: "Tony Tornado",
      descricao: "Dono da Rádio Paraíso, foi apaixonado por Margarida (Nivea Maria), com quem teve uma história no passado"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/olimpia.jpg",
      nome: "Olímpia",
      ator: "Rosane Gofman",
      descricao: "Estrela das radionovelas, ela se sente ameaçada com a chegada de Dita (Jeniffer Nascimento)"
    },
  ]}
  
/>
<CardSlider
  titulo="O dancing"
  cards={[
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/tamires.jpg",
      nome: "Tamires",
      ator: "Monique Alfradique",
      descricao: "Gerente do Dancing, assumiu o negócio no lugar de Clarice (Marianna Armellini em Êta Mundo Bom!), sua prima"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/franciely.jpg",
      nome: "Francine",
      ator: "Luciana Fernandes",
      descricao: "Dançarina, é uma espécie de aliada de Tamires (Monique Alfradique)"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/mirtes.jpg",
      nome: "Mirtes",
      ator: "Mariana Bridi",
      descricao: "Jovem de boa família, foi parar no Dancing depois da ruína financeira dos pais"
    },
  ]}
  
/>
<div class="animar-ultimo2">
  <img src="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/curiosidades.png" alt="Moldura" width="100%" style="padding:-100px;" />
</div>
</Section>




<Section
  id="curiosidades"
  className="section-destaque"
  fundo="linear-gradient(180deg, #7fa59d 0%, #8da7a7 50%, #ab90a2 100%)"
  largura="auto"
  alturaMobile="auto"
  alturaDesktop="auto"
  padding="0"
  margin="0"
>

<div>
<Titulo
  texto="CURIOSIDADES"
  cor="#232323"
  tamanhoDesk="3.2rem"
  tamanhoMob="2rem"
  espacamento="1rem"
  svgEsquerda="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/tit_esquerda.svg"
  svgDireita="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/tit_direita.svg"
/>
</div>
<ImagemFull
  srcDesk="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/curiosidades2.png"
  srcMob="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/curiosidades2.png"
  widthDesk="100vw"
  heightDesk="auto"
  widthMob="100vw"
  heightMob="auto"
/>
<div class="animar">

<CardSlider5
  titulo=""
  cards={[
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/curiosidades/mundobom.webp",
      descricao: "Continuação de Êta Mundo Bom!, a trama traz de volta 20 personagens da novela de 2016"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/curiosidades/burrico.webp",
      descricao: "O burrinho Policarpo na verdade é uma fêmea e se chama Juliana - ela, inclusive, já participou de outra novela: No Rancho Fundo (2024)"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/curiosidades/autores.webp",
      descricao: "Walcyr Carrasco, autor da primeira novela, ganha a colaboração de Mauro Wilson para a continuação"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/curiosidades/emmy.webp",
      descricao: "Juntos, Walcyr Carrasco e Mauro Wilson têm 3 Emmys Internacionais; Walcyr, por Verdades Secretas, e Mauro, por A Mulher Invisível e Doce de Mãe"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/curiosidade05.png",
      descricao: "É a segunda vez que Walcyr Carrasco escreve a continuação de uma história. Em 2021, ele escreveu Verdades Secretas II, que se tornou a primeira telenovela a ser exibida exclusivamente no streaming no Brasil"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/curiosidades/Samir-_Davi-Malizia_-Globo.webp",
      descricao: "Davi Malizia, ator que dá vida ao filho de Candinho, brilhou nos cinemas ao interpretar Ney Matogrosso na infância, no longa “Homem com H”"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/curiosidades/picole3.webp",
      descricao: "Outro ator mirim da novela também se destacou nas telonas: Isaac Amendoim foi o Chico Bento no filme lançado em 2024; ele também é influenciador digital e amigo de Gustavo Tubarão, criador de conteúdo famoso por seus vídeos na roça"
    },
    {
      imagem: "https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/nucleos/curiosidades/irmas.webp",
      descricao: "As irmãs Betty e Rosane Gofman voltam a integrar o elenco de uma mesma novela pela quarta vez"
    }
  ]}
/>






</div>


</Section>
<Section
  id="creditos"
  className="section-destaque animar"
  fundo="transparent"
  largura="100vw"
  alturaMobile="auto"
  alturaDesktop="100vh"
  padding="0"
  margin="0"
>

<Titulo
  className="section-destaque animar"
  texto="CRÉDITOS"
  cor="#232323"
  tamanhoDesk="3.2rem"
  tamanhoMob="2rem"
  espacamento="1rem"
  svgEsquerda="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/tit_esquerda.svg"
  svgDireita="https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/etamundomelhor/img/etamundomelhor/tit_direita.svg"
/>

<Creditos
  corFundo="transparent"
  corTextoGeral="#232323"
  corFuncao="#6eb4a3"
  corNome="#cd670d"
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
    { funcao: "Conteúdo", nome: "Vitor Gilard" },
    { funcao: "Design", nome: "Guilherme Gomes e Juan Silva" },
    { funcao: "Dev", nome: "Guilherme Gomes" },
    { funcao: "Coordenação", nome: "Davi Padovani (conteúdo) e Guilherme Gomes (design e desenvolvimento)" }
    
  ]}
/>
</Section>

</div>
<style>
body{
  background-color:#eddcc0;
}

.video-responsive {
  width: 100vw;
  max-width: 100vw;
  height: auto;
  background: #000;
  margin: 0;
  overflow: hidden;
  display: block;
  position: relative;
}

/* Player Globo embutido pode ser <iframe>, <video> ou <div.clappr-player> */
.video-responsive :global(iframe),
.video-responsive :global(video),
.video-responsive :global(.clappr-player[data-player]) {
  position: absolute;
  top: 0; left: 0;
  width: 100vw !important;
  height: 100vw !important;
  min-width: 100vw !important;
  min-height: 56.25vw !important; /* para 16:9, mas pro vertical 177vw (troque se for só vertical) */
  background: #000 !important;
  object-fit: contain !important; /* Muda para cover se quiser cortar */
  border: none !important;
  z-index: 10;
}

/* Desktop: ocupa 100vh (altura máxima), largura proporcional */
@media (min-width: 901px) {
  .video-responsive {
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    min-height: 100vh;
  }
  .video-responsive :global(iframe),
  .video-responsive :global(video),
  .video-responsive :global(.clappr-player[data-player]) {
    width: 100vw !important;
    height: 100vh !important;
    min-width: 100vw !important;
    min-height: 100vh !important;
    object-fit: cover !important;
  }
}



  .animar {
  opacity: 0;
  transform: translateY(40px);
  transition: none;
  margin: 0;
  padding:0;
}
.moldura-video-wrapper {
  position: relative;
  width: 100vw;
  aspect-ratio: 920/768;
  margin: 0 auto;
  overflow: visible;
}

.moldura-img {
  position: absolute;
  top: 0; left: 0;
  width: 100vw;
  height: auto;
  max-width: 100vw;
  z-index: 2;
  pointer-events: none;
}

/* Só desktop, esconde no mobile */
.moldura-desk {
  display: block;
}
.moldura-mob {
  display: none;
}
.player-area {
  position: absolute;
  left: 0; /* começa na esquerda total */
  top: calc(22 / 768 * 100%); /* altura do topo da área amarela */
  width: 100vw; /* ocupa toda a largura da moldura */
  height: calc(480 / 768 * 100%); /* altura proporcional à nova moldura */
  border-radius: 0;
  overflow: hidden;
  background: #ffe664;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-trama {
  position: relative;
  top: calc(22 / 768 * 100%);
  left: 50%;
  width: 50vw;
  aspect-ratio: 16 / 9;
  /* height: auto;  REMOVE ISSO! */
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffe664;
  z-index: 1;
  overflow: hidden;
  padding-top:10px;
}

.player-trama video, 
.player-trama iframe, 
.player-trama .clappr-player[data-player] {
  width: 100%;
  height: 100%;
  object-fit: cover; /* ou "contain" se preferir ver tudo do vídeo */
  background: #000;
  display: block;
}




/* Player da Globo ocupa tudo dentro da área recortada */
.player-area :global(.clappr-player[data-player]),
.player-area :global(iframe),
.player-area :global(video) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  background: #ffe664;
}
.titulo-nuvem {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(60px + 15vw); /* Ajuste esse valor pra encostar o texto "dentro" das nuvens (pode ser em % ou px, depende do PNG) */
  z-index: 3;
  width: 100%;
  text-align: center;
  font-weight: 900;
  font-size: clamp(2.2rem, 5vw, 8rem); /* responsivo */
  color: #ffe664;  /* Ou branco (#fff) se precisar de contraste */
  /* text-shadow: 0 4px 32px #fff9, 0 2px 8px #22384b66; */
  letter-spacing: -1px;
  line-height: 1.05;
  pointer-events: none; /* NUNCA cobre o vídeo! */
  user-select: none;
  padding: 0 3vw;
  text-transform: uppercase;
}

/* Mobile: deixa menor e mais alto */
@media (max-width: 700px) {
  .titulo-nuvem {
    font-size: clamp(1.8rem, 6vw, 2.2rem);
    bottom: 10vw;
    padding: 0 6vw;
  }
}
.base{
  background-color:#ffe664;
}
.animar img {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  line-height: 0;
}
.animar-ultimo,
.animar-ultimo * {
  margin: 0;
  padding: 0;
}

.animar-ultimo img {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  margin-bottom: -20px;
  padding-bottom: 0;
  line-height: 0;
  margin-top: -280px;
}
.animar-ultimo2 img {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  margin-bottom: -20px;
  padding-bottom: 0;
  line-height: 0;
  margin-top: -180px;
}

.animar-ultimo p {
  margin-bottom: 0;

}

@media (max-width: 700px) {
.animar-ultimo img {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  margin-bottom: -20px;
  padding-bottom: 0;
  line-height: 0;
  margin-top: -20px;
}
.animar-ultimo2 img {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  margin-bottom: -20px;
  padding-bottom: 0;
  line-height: 0;
  margin-top: -20px;
}
  .moldura-desk {
    display: none;
  }
  .moldura-mob {
    display: block;
  }
.player-trama {
  position: relative;
  top: calc(22 / 768 * 100%);
  left: 50%;
  width: 100vw;
  aspect-ratio: 16 / 9;
  /* height: auto;  REMOVE ISSO! */
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffe664;
  z-index: 1;
  overflow: hidden;
}

.player-trama video, 
.player-trama iframe, 
.player-trama .clappr-player[data-player] {
  width: 100%;
  height: 100%;
  object-fit: cover; /* ou "contain" se preferir ver tudo do vídeo */
  background: #000;
  display: block;
}


}
</style>
