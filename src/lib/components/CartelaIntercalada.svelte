<script>
  import { onMount } from 'svelte';
  
  export let onComplete; // Função para ser chamada quando a animação terminar

  // Duração da exibição da cartela em milissegundos
  const DURACAO_CARTELA = 5000; 

  onMount(() => {
    // Avisa o componente pai que a cartela terminou para poder passar para o próximo vídeo
    const timer = setTimeout(onComplete, DURACAO_CARTELA);

    // Limpa o timer quando o componente é destruído para evitar vazamentos de memória
    return () => clearTimeout(timer);
  });
</script>

<div class="cartela-container">
  <div class="texto-animado">
    <span>Vídeos</span>
    <span>mais vistos</span>
    <span>do g1</span>
  </div>
</div>

<style>
  .cartela-container {
    width: 100%;
    height: 100%;
    background-image: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/g1/g1tv/videosmaisvistos.jpg');
    background-size: cover;
    background-position: center center;
    display: flex;
    align-items: center;
    padding-left: 10vw; /* Alinhamento à esquerda */
    box-sizing: border-box;
  }

  .texto-animado span {
    display: block;
    color: white;
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: 5vw;
    line-height: 1.1;
    text-transform: uppercase;
    transform: translateY(20px);
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  /* Animação com delay para cada linha de texto */
  .texto-animado span:nth-child(1) {
    animation-delay: 0.2s;
  }
  .texto-animado span:nth-child(2) {
    animation-delay: 0.4s;
    font-size: 6vw; /* Destaque para a linha do meio */
  }
  .texto-animado span:nth-child(3) {
    animation-delay: 0.6s;
  }
x
  @keyframes fadeInUp {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Ajustes para telas menores */
  @media (max-width: 768px) {
    .texto-animado span {
      font-size: 8vw;
    }
    .texto-animado span:nth-child(2) {
      font-size: 9vw;
    }
  }
</style>