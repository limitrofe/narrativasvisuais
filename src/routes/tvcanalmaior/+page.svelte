<script>
  import { onMount, onDestroy } from 'svelte';
  import RotaCard from '$lib/components/RotaCard.svelte';
  import TvCanalGlobo from '$lib/components/TvCanalGlobo.svelte';


  let refreshKey = 0; // Variável para forçar o refresh do componente RotativaNoticias
  let intervalId; // Para armazenar o ID do setInterval

  onMount(() => {
    // Configura um intervalo para incrementar a refreshKey a cada 5 minutos (300.000 ms)
    intervalId = setInterval(() => {
      refreshKey += 1; // Incrementa a key, forçando RotativaNoticias a ser recriado
      console.log(`[${new Date().toLocaleTimeString()}] Forçando refresh de RotativaNoticias. Nova key: ${refreshKey}`);
    }, 300000); // 5 minutos
  });

  onDestroy(() => {
    // Limpa o intervalo quando o componente pai é destruído
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
</script>
<RotaCard
  sheetsUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vRWA78HdfRCaonuUFeHK3xeU9p8tIebMnU98SlVkx-d6NsW04a4o3GnKR9N6i73T0zNsAtEmQ5OPj8g/pub?output=csv"
  altura="60px"
  key={refreshKey} />


<TvCanalGlobo
  sheetsUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vTdbugqo-KWPw-5sFLqOh8ttynZ6lP71UIofvVUSLBy5b7JH37seXz0BiFrTcvL2k7VZcqYxXUFAmSw/pub?output=csv"
    style="width: 100%;height: 100vh;"

/>

<svelte:head>
  <style>
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
  </style>
</svelte:head>
