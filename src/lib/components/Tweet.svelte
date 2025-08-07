<script>
    export let autor = "João Silva";
    export let usuario = "@joaosilva";
    export let avatar = "/avatar.jpg";
    export let verificado = true;
    export let texto = "Este é um tweet de exemplo.";
    export let imagem = ""; // opcional
    export let data = "10:32 · 20 de abril de 2025";
    export let respostas = 12;
    export let reposts = 30;
    export let curtidas = 230;
    export let views = "15,2 mil";
  </script>
  
  <div class="tweet">
    <img class="avatar" src={avatar} alt="avatar" />
    <div class="conteudo">
      <div class="topo">
        <strong>{autor}</strong>
        {#if verificado}
          <span class="verificado">✔️</span>
        {/if}
        <span class="usuario">{usuario}</span>
      </div>
      <div class="texto">{texto}</div>
      {#if imagem}
        <img class="imagem" src={imagem} alt="imagem do tweet" />
      {/if}
      <div class="rodape">
        <span>{data}</span>
        <div class="interacoes">
          <span>💬 {respostas}</span>
          <span>🔁 {reposts}</span>
          <span>❤️ {curtidas}</span>
          <span>👁 {views}</span>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    .tweet {
      display: flex;
      gap: 1rem;
      border-bottom: 1px solid #ccc;
      padding: 1rem;
      font-family: sans-serif;
      max-width: 600px;
      margin: auto;
    }
  
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
  
    .conteudo {
      flex: 1;
    }
  
    .topo {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      font-size: 1rem;
    }
  
    .usuario {
      color: gray;
    }
  
    .texto {
      margin: 0.5rem 0;
      font-size: 1rem;
    }
  
    .imagem {
      width: 100%;
      border-radius: 8px;
      margin-top: 0.5rem;
    }
  
    .rodape {
      font-size: 0.8rem;
      color: gray;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  
    .interacoes span {
      margin-right: 1rem;
    }
  </style>
  