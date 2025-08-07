<script>
import HeroImage from '$lib/components/headers/HeroImage.svelte';
  import Titulo from '$lib/components/Titulo.svelte';
import VideoPlayer from '$lib/components/VideoPlayer.svelte';


</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    box-sizing: border-box;
    font-family: sans-serif;
    padding: 0px;
    margin: 0px;
  }

  /* Estilos para o resto do conteúdo, apenas para contexto */
  p {
    max-width: 800px;
    text-align: center;
    line-height: 1.6;
  }
</style>

<main>
      <Titulo texto="Bem-vindo à Minha Narrativa Visual!" />

  <Titulo texto="Um Novo Capítulo Começa" />


  <HeroImage
    desktopImage="https://s2-g1.glbimg.com/GVAGNwz1K2kNh_MP2C5-Eh_DkO4=/0x0:1600x900/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2025/s/N/bp3AJYT9aKSZBhmkASFA/whatsapp-image-2025-04-29-at-19.44.57.jpeg"
    mobileImage="https://s2-g1.glbimg.com/GVAGNwz1K2kNh_MP2C5-Eh_DkO4=/0x0:1600x900/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2025/s/N/bp3AJYT9aKSZBhmkASFA/whatsapp-image-2025-04-29-at-19.44.57.jpeg"
    altText="Caminho montanhoso solitário"
    height="1000px"
    backgroundPosition="center center"
    textAlignment="left"

    titleDesktop="Capítulo Um: O Chamado Distante"
    titleMobile="O Chamado"

    subtitleDesktop="Uma jornada começa com um único passo incerto."
    subtitleMobile="Um Passo Incerto"
  />

  <p>
    Neste capítulo, o protagonista encontra um artefato misterioso que o impulsiona para uma aventura inesperada. As montanhas à frente prometem desafios e descobertas.
  </p>
<VideoPlayer
  videoId = '13630390';
  autoplay = true;
  publicidade = true;
  fullwidth = true;
  />
   <HeroImage
    desktopImage="https://s2-g1.glbimg.com/GVAGNwz1K2kNh_MP2C5-Eh_DkO4=/0x0:1600x900/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2025/s/N/bp3AJYT9aKSZBhmkASFA/whatsapp-image-2025-04-29-at-19.44.57.jpeg"
    mobileImage="https://images.unsplash.com/photo-1517457210887-f87cc26ef532?q=80&w=768&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    altText="Caminho montanhoso solitário"
    height="200px"
    backgroundPosition="center center"
    textAlignment="bottom-left"

    titleDesktop="Caminho montanhoso solitário"
    titleMobile="O Chamado"
    titleDesktopSize="2.5em"
    titleMobileSize="1.8em"
    titleColor="#f8f9fa"
    titleDesktopWeight="bold"
    titleMobileWeight="bold"

    subtitleDesktop="Uma jornada começa com um único passo incerto."
    subtitleMobile="Um Passo Incerto"
    subtitleDesktopSize="1.1em"
    subtitleMobileSize="0.9em"
    subtitleColor="#f8f9fa"
    subtitleDesktopWeight="regular"
    subtitleMobileWeight="regular"
  />
</main>
