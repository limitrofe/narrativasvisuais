<script>
    import { onMount } from 'svelte';
  
    export let videoId = '';
    export let autoplay = false;
    export let publicidade = false;
    export let fullwidth = false;
  
    // GA4 config
    export let measurementId = ''; // exemplo: 'G-TY5Q77JETQ'
    export let userId = ''; // globoid
    export let appInstanceId = ''; // obrigatório
    export let eventParams = {}; // { video_id: '123456', video_playback: 'online' }
    export let userProperties = {}; // { consumption_environment: 'web', user_code_provider: 'cadun' }
  
    let container;
  
    onMount(() => {
      // Inject Google Tag if ainda não existe
      if (!window.gtag) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);
  
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
          dataLayer.push(arguments);
        };
  
        gtag('js', new Date());
      }
  
      // Config inicial do GA4
      gtag('config', measurementId, {
        user_id: userId
      });
  
      // Envia propriedades do usuário
      gtag('set', 'user_properties', {
        ...userProperties
      });
  
      // Exemplo de evento: video_play
      gtag('event', 'video_play', {
        ...eventParams,
        send_to: measurementId
      });
    });
  </script>
  
  <style>
    .video-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      position: relative;
    }
  
    .video-container.full {
      width: 100vw;
    }
  
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  </style>
  
  <div class="video-container {fullwidth ? 'full' : ''}" bind:this={container}>
    <iframe
      src={`https://player.globo.com/embed/${videoId}?autoplay=${autoplay}&ads=${publicidade}`}
      allowfullscreen
      allow="autoplay; encrypted-media"
    ></iframe>
  </div>
  