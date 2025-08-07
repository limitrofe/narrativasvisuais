<script>
    import { createEventDispatcher, onMount } from 'svelte';
  
    export let answers = [];
    export let startTime;
    export let endTime;
    export let quiz = [];
    export let bg = '';
  
    const dispatch = createEventDispatcher();
    let showDetalhes = false;
  
    const totalQuestoes = quiz.length;
    let tempoTotal = 0;
    let pontuacaoTotal = 0;
    let acertos = 0;
    let erros = 0;
    let detalhamento = [];
  
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
  
    function calcularPontuacaoQuestao(acertou, tempoSegundos, totalQuestoes) {
      if (!acertou) return 0;
      const valorQuestao = 100 / totalQuestoes;
      const tempoIdeal = 45;
      const tempoMax = 130;
      const percentualMinimo = 0.15;
  
      if (tempoSegundos <= tempoIdeal) return valorQuestao;
      if (tempoSegundos > tempoMax) return valorQuestao * percentualMinimo;
  
      const excesso = tempoSegundos - tempoIdeal;
      const desconto = excesso / (tempoMax - tempoIdeal) * (1 - percentualMinimo);
      return valorQuestao * (1 - desconto);
    }
  
    answers.forEach((resposta, index) => {
      const tempo = (resposta.fim - resposta.inicio) / 1000;
      tempoTotal += tempo;
      const pontos = calcularPontuacaoQuestao(resposta.isCorrect, tempo, totalQuestoes);
  
      detalhamento.push({
        id: index + 1,
        pergunta: quiz[index].pergunta.texto,
        acertou: resposta.isCorrect,
        tempo: tempo.toFixed(1),
        pontos: pontos.toFixed(2),
        explicacao: quiz[index].pergunta.explicacao,
        explicacao_tipo: quiz[index].pergunta.explicacao_tipo,
        explicacao_midia: quiz[index].pergunta.explicacao_midia,
        resposta_correta: quiz[index].pergunta.respostas.find(r => r.correta)?.texto,
        resposta_dada: resposta.texto
      });
  
      pontuacaoTotal += pontos;
      resposta.isCorrect ? acertos++ : erros++;
    });
  </script>
  
  {#if tipoFundo === 'video'}
    <video autoplay muted loop playsinline class="fundo-video">
      <source src={bg} type="video/mp4" />
    </video>
  {/if}
  
  <section class="resultado" style={estiloFundo}>
    <h2 class="titulo-premio">Resultado Final</h2>
    <p class="frase-impacto">
      {#if acertos === totalQuestoes}
        🏆 Você acertou tudo! Um verdadeiro especialista.
      {:else if acertos > erros}
        🚀 Ótimo desempenho! Você está no caminho certo.
      {:else}
        📚 Aprender faz parte. Que tal tentar de novo?
      {/if}
    </p>
  
    <div class="metricas">
      <div><strong>Acertos:</strong> {acertos}</div>
      <div><strong>Erros:</strong> {erros}</div>
      <div><strong>Tempo total:</strong> {Math.round(tempoTotal)}s</div>
      <div><strong>Pontuação final:</strong> {pontuacaoTotal.toFixed(2)} / 100</div>
    </div>
  
    <div class="botoes">
      <button class="refazer" on:click={() => dispatch('start')}>Refazer quiz</button>
      <button class="ver-detalhes" on:click={() => showDetalhes = true}>Ver detalhes das perguntas</button>
    </div>
  
    {#if showDetalhes}
      <div class="modal">
        <div class="modal-content">
          <button class="fechar" on:click={() => showDetalhes = false}>✕</button>
          <h3>Resumo por pergunta</h3>
  
          <div class="cards-container">


            {#each detalhamento as item}
            
              <div class="card" class:acertou={item.acertou} class:errou={!item.acertou}>
                {#if item.explicacao_tipo === 'imagem'}
                  <img src={item.explicacao_midia} alt="Explicação" class="img-explicacao" />
                  {:else if item.explicacao_tipo === 'video'}
                  <video src={item.explicacao_midia} autoplay muted playsinline loop controls class="img-explicacao"></video>                
                {:else if item.explicacao_tipo === 'audio'}
                  <audio src={item.explicacao_midia} controls></audio>
                {/if}
  
                <h3>Pergunta {item.id}<br />{item.pergunta}</h3>

                <p><strong>Acertou?</strong> {item.acertou ? '✅' : '❌'}</p>
                <p><strong>A sua resposta:</strong> {item.resposta_dada}</p>
                {#if !item.acertou}
                  <p><strong>Correta:</strong> {item.resposta_correta}</p>
                {/if}
                {#if item.explicacao}
                  <p>{item.explicacao}</p>
                {/if}
                <hr>
                <div class="info-extra">
                    <p><strong>Pontos:</strong> {item.pontos}</p>
                    <p><strong>Tempo:</strong> {item.tempo}s</p>
                  </div>
                  
 
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </section>
  
  <style>
    .resultado {
      padding: 10px;
      text-align: center;
      min-height: 50vh;
      position: relative;
      z-index: 10;
    }
  
    .titulo-premio {
      font-size: 2.4rem;
      margin-bottom: 0.5rem;
    }
  
    .frase-impacto {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      color: #444;
    }
  
    .metricas {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1rem 0;
    }
  
    .botoes button {
      margin: 0.5rem;
      padding: 0.8rem 2rem;
      border: none;
      background-color: #c4170c;
      color: white;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
    }
    .botoes .refazer {
      margin: 0.5rem;
      padding: 0.8rem 2rem;
      border: none;
      background-color: #5e5e5e;
      color: white;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
    }
  
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
    }
  
    .modal-content {
      background: white;
      padding: 2rem;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      border-radius: 20px;
      position: relative;
    }
  
    .fechar {
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  
    .cards-container {
      display: flex;
      overflow-x: auto;
      gap: 1rem;
      padding: 1rem 0;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scroll-padding-left: 2rem;
    }
  
    .card {
      flex: 0 0 85%;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 1.5rem;
      text-align: left;
      border: 3px solid transparent;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
      scroll-snap-align: start;
      position: relative;
      transition: transform 0.3s ease;
    }
  
    .card.acertou {
      border-color: #2e7d32;
      box-shadow: 0 0 8px #2e7d32aa;
    }
  
    .card.acertou::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      border-radius: 20px;
      box-shadow: 0 0 15px 5px #2e7d32aa;
      animation: pulse 2s infinite;
      z-index: -1;
    }
  
    .card.errou {
      border-color: #000;
      box-shadow: 0 0 8px #00000088;
    }
  
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(46,125,50, 0.4); }
      70% { box-shadow: 0 0 0 15px rgba(46,125,50, 0); }
      100% { box-shadow: 0 0 0 0 rgba(46,125,50, 0); }
    }
  
    @media (min-width: 768px) {
      .card {
        flex: 0 0 40%;
      }
    }
  
    
    .img-explicacao {
      max-width: 100%;
      margin-bottom: 1rem;
      border-radius: 10px;
    }
  
    .info-extra {
      display: flex;
      justify-content: space-between;
      gap: 2rem;
      margin-top: 1rem;
    }
  
    h3 {
      color: #232323;
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
    @media (max-width: 767px){
      .titulo-premio {
      font-size: 2.2rem;
      margin-top:0px;
      margin-bottom: 0.5rem;
    }
    .card {
    flex: 0 0 75%;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 0.5rem;
    text-align: left;
    border: 1px solid transparent;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
    scroll-snap-align: start;
    position: relative;
    transition: transform 0.3s ease;
    }
    .img-explicacao {
      max-width: 100%;
      margin-bottom: 0.3rem;
      border-radius: 4px;
    }
    }

  </style>
  