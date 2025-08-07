<script>
  // ✅ Caminho corrigido para o ReelsPlayer.svelte
  // Sobe duas pastas (../../) para src/, depois desce para lib/components/
  import ReelsPlayer from '../../lib/components/ReelsPlayer.svelte';

  // URL do seu arquivo CSV com os videoIds.
  // IMPORTANTE: Esta URL precisa ser acessível publicamente e o formato deve ser CSV.
  // Certifique-se de que o Google Sheets esteja configurado para "Publicar na web" como CSV.
  const mySheetsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTdbugqo-KWPw-5sFLqOh8ttynZ6lP71UIofvVUSLBy5b7JH37seXz0BiFrTcvL2k7VZcqYxXUFAmSw/pub?output=csv"; 
  
  // URL base para as imagens de thumbnail dos vídeos.
  // Ex: Se o videoId for '123' e você tiver uma imagem '123.jpg' em `static/thumbs/`,
  // o caminho completo que o `ReelsPlayer` construirá será '/thumbs/123.jpg'.
  // Certifique-se de ter essa pasta 'thumbs' dentro da sua pasta 'static' no projeto SvelteKit.
  const myThumbsBaseUrl = "/thumbs"; 
</script>

<main>
  <ReelsPlayer sheetsUrl={mySheetsUrl} thumbsBaseUrl={myThumbsBaseUrl} />
</main>

<style>
  /* Estilos para o elemento <main> - garante que ele ocupe a tela toda */
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black; /* Fundo para a área principal da aplicação */
  }
  
  /* Estilos globais para o body. Usar :global() é necessário para estilos fora do escopo do componente. */
  /* Isso é crucial para que o player em tela cheia funcione corretamente e sem barras de rolagem. */
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden; /* Impede a rolagem da página inteira */
    height: 100vh; /* Garante que o body ocupe a altura total da viewport */
    width: 100vw; /* Garante que o body ocupe a largura total da viewport */
  }
</style>