<script>
    import { createEventDispatcher, onMount } from 'svelte';
  
    export let titulo = '';
    export let descricao = '';
    export let buttonLabel = 'Começar';
    export let bg = '';
  
    const dispatch = createEventDispatcher();
  
    let tipoFundo = '';
    let estiloFundo = '';
  
    onMount(() => {
      if (!bg) return;
  
      if (bg.startsWith('#')) {
        tipoFundo = 'cor';
        estiloFundo = `background-color: ${bg};`;
      } else if (bg.endsWith('.mp4')) {
        tipoFundo = 'video';
      } else {
        tipoFundo = 'imagem';
        estiloFundo = `background-image: url(${bg}); background-size: cover; background-position: center;`;
      }
    });
  
    function iniciar() {
      dispatch('start');
    }
  </script>
  
  {#if tipoFundo === 'video'}
    <video autoplay muted loop playsinline class="fundo-video">
      <source src={bg} type="video/mp4" />
    </video>
  {/if}
  
  <section class="quiz-start" style={estiloFundo}>
    <div class="conteudo">
      {#if titulo}
        <h1>{titulo}</h1>
      {/if}
      {#if descricao}
        <p>{descricao}</p>
      {/if}
  
      <button on:click={iniciar}>
        {buttonLabel}
      </button>
    </div>
  </section>
  
  <style>
    .quiz-start {
      width: 100%;
      text-align: center;
      padding: 1rem;
      animation: fadeIn 0.4s ease;
      position: relative;
      z-index: 10;
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .conteudo {
      max-width: 600px;
      margin: 0 auto;
      z-index: 20;
      position: relative;
      background: rgba(255, 255, 255, 0.85);
      padding: 1rem;
      border-radius: 12px;
    }
  
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: #222;
      line-height: 1.5rem;
    }
  
    p {
      font-size: 1.2rem;
      line-height: 1.5rem;
      margin-bottom: 1rem;
      color: #444;
    }
  
    button {
      background-color: #c4170c;
      color: white;
      font-size: 1.2rem;
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s ease;
    }
  
    button:hover {
      background-color: #c4170c;
    }
  
    .fundo-video {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100vw;
      height: 100vh;
      object-fit: cover;
    }
  
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
  