<script>
    import { createEventDispatcher, onMount } from 'svelte';
    export let pergunta;
    export let isLast = false;
  
    const dispatch = createEventDispatcher();
  
    let respostaSelecionada = null;
    let mostrarModal = false;
    let inicio = 0;
  
    onMount(() => {
      inicio = Date.now();
    });
  
    function responder(resposta) {
      if (respostaSelecionada !== null) return;
      respostaSelecionada = resposta;
  
      // ✅ Delay para mostrar visual antes de abrir o modal
      setTimeout(() => {
        mostrarModal = true;
      }, 500);
    }
  
    function proxima() {
      const fim = Date.now();
      dispatch('responder', {
        isCorrect: respostaSelecionada?.correta,
        inicio,
        fim,
        texto: respostaSelecionada?.texto
      });
      respostaSelecionada = null;
      mostrarModal = false;
    }
  
    function respostaCorreta() {
      return pergunta.respostas.find(r => r.correta);
    }
  </script>
  
  <section class="pergunta">
    <h2>{pergunta.texto}</h2>
  
    {#if pergunta.tipo === 'imagem' && pergunta.midia}
      <img src={pergunta.midia} alt="imagem da pergunta" class="midia" />
    {:else if pergunta.tipo === 'video' && pergunta.midia}
      <video src={pergunta.midia} autoplay muted playsinline controls class="midia" />
    {:else if pergunta.tipo === 'audio' && pergunta.midia}
      <audio src={pergunta.midia} controls class="midia" />
    {/if}
  
    <div class="respostas">
      {#each pergunta.respostas as resposta (resposta.texto)}
        <button
          class:selected={respostaSelecionada === resposta}
          class:correta={respostaSelecionada && resposta.correta}
          class:errada={respostaSelecionada && !resposta.correta && resposta === respostaSelecionada}
          on:click={() => responder(resposta)}
          disabled={respostaSelecionada !== null}
        >
          {resposta.texto}
        </button>
      {/each}
    </div>
  
    {#if mostrarModal}
      <div class="modal">
        <div class="modal-content">
          <p class="status">
            {#if respostaSelecionada?.correta}
              ✅ Você acertou!
            {:else}
              ❌ Você errou!
            {/if}
          </p>
  
          {#if pergunta.explicacao_tipo === 'imagem' && pergunta.explicacao_midia}
            <img src={pergunta.explicacao_midia} alt="explicação" class="midia-explicacao" />
          {:else if pergunta.explicacao_tipo === 'video' && pergunta.explicacao_midia}
            <video
              src={pergunta.explicacao_midia}
              autoplay
              muted
              playsinline
              controls
              class="midia-explicacao"
            ></video>
          {:else if pergunta.explicacao_tipo === 'audio' && pergunta.explicacao_midia}
            <audio src={pergunta.explicacao_midia} controls class="midia-explicacao"></audio>
          {/if}
  
          {#if !respostaSelecionada?.correta}
            <p class="correta"><strong>Resposta correta:</strong> {respostaCorreta().texto}</p>
          {/if}
  
          {#if pergunta.explicacao}
            <p class="texto"><strong>Explicação:</strong> {pergunta.explicacao}</p>
          {/if}
  
          <button class="proxima" on:click={proxima}>
            {isLast ? 'Parabéns, você terminou. Clique aqui para ver o resultado' : 'Próxima pergunta'}
          </button>
        </div>
      </div>
    {/if}
  </section>
  
  <style>
    .pergunta {
      width: 100%;
      text-align: center;
      animation: fadeIn 0.3s ease;
    }
  
    h2 {
      font-size: 1.6rem;
      margin-bottom: 1rem;
      color: #222;
    }
  
    .midia {
      max-width: 100%;
      max-height: 300px;
      margin: 1rem auto;
      border-radius: 10px;
    }
  
    .respostas {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 2rem;
    }
  
    button {
      font-size: 1rem;
      padding: 1rem;
      border-radius: 8px;
      border: none;
      background-color: #f4f4f4;
      cursor: pointer;
      transition: all 0.3s ease;
    }
  
    button:hover:not(:disabled) {
      background-color: #c4170c;
      color: white;
    }
  
    .correta {
      background-color: #4caf50 !important;
      color: white;
    }
  
    .errada {
      background-color: #f44336 !important;
      color: white;
    }
  
    .modal {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
    }
  
    .modal-content {
      background: #fff6f6;
      border-radius: 16px;
      max-width: 90%;
      width: 600px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  
    .status {
      font-size: 1.4rem;
      font-weight: bold;
      color: #c4170c;
    }
  
    .midia-explicacao {
      max-width: 100%;
      max-height: 300px;
      border-radius: 12px;
    }
  
    .texto {
      font-size: 1rem;
      color: #232323;
    }

    .correta {
      font-size: 1rem;
      color: #fff;
    }

  
    .proxima {
      background-color: #c4170c;
      color: white;
      padding: 0.75rem 2rem;
      font-size: 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
  
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  
    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        padding: 1.5rem;
      }
    }
  </style>
  