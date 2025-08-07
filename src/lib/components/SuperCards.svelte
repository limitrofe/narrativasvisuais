<script>
    import { onMount } from 'svelte';
  
    export let sheetUrl = "";
    export let filtros = [];
    export let buscas = [];
    export let exibirCampos = [];
    export let tipoMidia = "imagem";
    export let colunaMidia = "";
    export let ordenarPor = "";
    export let agruparPor = "";
    export let templateTexto = "";
    export let textoFiltro = (filtro) => `Filtrar por ${filtro}`;
    export let textoBusca = "Buscar";
    export let botoesFiltroExtra = []; // Novo: botoes opcionais
  
    let dados = [];
    let dadosFiltrados = [];
    let filtrosAtuais = {};
    let buscaAtual = "";
  
    onMount(async () => {
      const Papa = (await import('papaparse')).default;
      Papa.parse(sheetUrl, {
        download: true,
        header: true,
        complete: function (results) {
          dados = results.data.filter(item => item[exibirCampos[0]?.coluna]);
          dadosFiltrados = [...dados];
        }
      });
    });
  
    function aplicarFiltros() {
      dadosFiltrados = dados.filter(item => {
        const passaFiltros = filtros.every(filtro => {
          const valorFiltro = filtrosAtuais[filtro];
          if (!valorFiltro) return true;
          return (item[filtro] || "").toLowerCase().includes(valorFiltro.toLowerCase());
        });
        const passaNomeado = filtrosAtuais["nomeados-ptbr"]
          ? (item["nomeados-ptbr"] || "").toLowerCase().includes(filtrosAtuais["nomeados-ptbr"].toLowerCase())
          : true;
        const passaBusca = buscas.length === 0 || buscas.some(busca => {
          return (item[busca] || "").toLowerCase().includes(buscaAtual.toLowerCase());
        });
        return passaFiltros && passaNomeado && passaBusca;
      });
    }
  
    function atualizarFiltro(filtro, valor) {
      filtrosAtuais[filtro] = valor;
      aplicarFiltros();
    }
  
    function atualizarBusca(valor) {
      buscaAtual = valor;
      aplicarFiltros();
    }
  
    function aplicarTemplate(template, dados) {
      let texto = template.replace(/{(.*?)}/g, (_, campo) => dados[campo] || "");
      texto = texto.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return texto;
    }
  
    function filtrarNomeado(nomeado) {
      filtrosAtuais["nomeados-ptbr"] = nomeado;
      aplicarFiltros();
    }
  
    $: ordenar();
    function ordenar() {
      if (ordenarPor) {
        dadosFiltrados.sort((a, b) => {
          return (a[ordenarPor] || "").localeCompare(b[ordenarPor] || "");
        });
      }
    }
  </script>
  
  <div class="filtros">
    {#each filtros as filtro}
      <input
        type="text"
        placeholder={textoFiltro(filtro)}
        on:input={(e) => atualizarFiltro(filtro, e.target.value)}
      />
    {/each}
  
    {#if buscas.length > 0}
      <input
        type="text"
        placeholder={textoBusca}
        on:input={(e) => atualizarBusca(e.target.value)}
      />
    {/if}
  </div>
  
  {#if botoesFiltroExtra.length > 0}
    <div class="botoes-filtro-nomeados">
      {#each botoesFiltroExtra as filtro}
        <button on:click={() => filtrarNomeado(filtro.valor)}>{filtro.label}</button>
      {/each}
    </div>
  {/if}
  
  <div class="cards">
    {#each dadosFiltrados as item}
      <div class="card">
        {#if tipoMidia === 'imagem' && item[colunaMidia]}
          <img src={item[colunaMidia]} alt="Imagem" />
        {:else if tipoMidia === 'video' && item[colunaMidia]}
          <video src={item[colunaMidia]} controls></video>
        {/if}
  
        {#if templateTexto}
          <p>{@html aplicarTemplate(templateTexto, item)}</p>
        {:else}
          {#each exibirCampos as campo}
            <p><strong>{campo.label}:</strong> {item[campo.coluna]}</p>
          {/each}
        {/if}
      </div>
    {/each}
  </div>
  
  <style>
  .filtros {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .filtros input {
    padding: 0.6rem 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
  }
  
  .botoes-filtro-nomeados {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .botoes-filtro-nomeados button {
    background: #eee;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .botoes-filtro-nomeados button:hover {
    background: #ddd;
  }
  
  .cards {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .card {
    width: 220px;
    background: white;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    gap: 10px;

  }
  
  img, video {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    white-space: pre-line;
  }
  
  @media (max-width: 768px) {
    .cards {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      max-width: 100%;
      gap: 10px;
    }
  
    .card {
      width: 140px;
      padding: 0.75rem;
    }
  }
  </style>
  