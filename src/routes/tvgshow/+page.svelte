<script>
  import { onMount, onDestroy } from 'svelte';
  import GshowRotativa from '$lib/components/GshowRotativa.svelte';
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
<GshowRotativa
  falkorApiUrl="https://falkor-cda.bastian.globo.com/tenants/gshow/instances/4af56893-1f9a-4504-9531-74458e481f91/posts/page/1"
  altura="120px"
  key={refreshKey}
 />


<TvCanalGlobo
  sheetsUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vTdbugqo-KWPw-5sFLqOh8ttynZ6lP71UIofvVUSLBy5b7JH37seXz0BiFrTcvL2k7VZcqYxXUFAmSw/pub?output=csv"
    style="width: 100%;height: 100vh;"

/>
