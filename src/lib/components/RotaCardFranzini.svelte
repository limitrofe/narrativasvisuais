<script>
  import { onMount, onDestroy } from "svelte";

  // --- ESTADO DO COMPONENTE ---
  let noticias = [];
  let indiceNoticiaAtual = 0;
  let noticiaVisivel = true;
  let carregando = true;
  let componenteAtivo = true;

  let modo = "DESTAQUES";
  let dataHoraDestaque = "";

  const TEXTO_DESTAQUE_RECOLHIDO = "DESTAQUES<br> da home<br>DO G1 AGORA";

  const INTERVALO_DESTAQUE = 8000;
  const INTERVALO_NOTICIA = 8000;

  // --- TERMOS PARA IGNORAR ---
  // Adicione aqui qualquer string que você queira usar para filtrar notícias.
  const TERMOS_IGNORADOS = [
    "Vídeos do g1",
    "Fantástico",
    "g1 jogos", // Não precisa mais de "G1 jogos" por causa do .toLowerCase()
  ];

  // --- FUNÇÕES ---

  function getFormattedCurrentDateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const time = `${hours}h${minutes}`;
    const date = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    return `${time} | ${date}`;
  }

  async function fetchNoticias() {
    try {
      // Array de páginas que você quer buscar para ter mais notícias
      const paginasParaBuscar = [1, 2, 3]; 

      // Cria uma lista de "promises", uma para cada página
      const promises = paginasParaBuscar.map(page =>
        fetch(`https://falkor-cda.bastian.globo.com/tenants/g1/instances/4af56893-1f9a-4504-9531-74458e481f91/posts/page/${page}`)
          .then(resp => resp.json())
      );

      // Executa todas as buscas em paralelo para mais eficiência
      const resultados = await Promise.all(promises);

      let parsed = [];
      // Junta os itens de todas as páginas em uma única lista
      resultados.forEach(data => {
        if (data && data.items) {
          data.items.forEach((item) => {
            if (item.content && item.content.title) {
              parsed.push(item.content.title);
            }
          });
        }
      });

      // Lógica de filtro que ignora maiúsculas/minúsculas
      const noticiasFiltradas = parsed.filter((titulo) => {
        if (!titulo) return false;
        const tituloLowerCase = titulo.toLowerCase();
        // Mantém a notícia apenas se o título NÃO incluir nenhum dos termos ignorados
        return !TERMOS_IGNORADOS.some(termo => tituloLowerCase.includes(termo.toLowerCase()));
      });

      // Usa o Set para remover duplicatas da lista já filtrada
      noticias = [...new Set(noticiasFiltradas)];
      
      console.log(`Carregadas ${noticias.length} notícias únicas de ${paginasParaBuscar.length} páginas.`);

    } catch (e) {
      console.error("Erro ao buscar notícias:", e);
      noticias = ["Não foi possível carregar as notícias."];
    } finally {
      carregando = false;
    }
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  async function iniciarCiclo() {
    await fetchNoticias();
    while (componenteAtivo) {
      modo = 'DESTAQUES';
      dataHoraDestaque = getFormattedCurrentDateTime();
      await sleep(INTERVALO_DESTAQUE);
      if (!componenteAtivo) break;

      modo = 'NOTICIAS';
      // Checa se a busca resultou em alguma notícia válida
      if (noticias.length === 0) {
        await sleep(INTERVALO_NOTICIA);
        await fetchNoticias();
        continue; // Pula o resto do loop e tenta buscar notícias novamente
      }

      for (let i = 0; i < 5; i++) {
        noticiaVisivel = false;
        await sleep(400);
        if (indiceNoticiaAtual >= noticias.length - 1) {
            await fetchNoticias();
            indiceNoticiaAtual = 0;
            // Checa novamente se a nova busca resultou em notícias válidas
            if (noticias.length === 0) break; 
        } else {
            indiceNoticiaAtual++;
        }
        noticiaVisivel = true;
        await sleep(INTERVALO_NOTICIA);
        if (!componenteAtivo) break;
      }
      if (!componenteAtivo) break;
    }
  }

  onMount(() => {
    componenteAtivo = true;
    iniciarCiclo();
  });

  onDestroy(() => {
    componenteAtivo = false;
  });
</script>

<div class="bloco-rodape-g1" class:modo-noticias={modo === 'NOTICIAS'}>
  {#if carregando}
    <div class="card-loading">Carregando…</div>
  {:else}
    <div class="card-destaque">
      {#if modo === 'DESTAQUES'}
        <span class="destaque-titulo">DESTAQUES DA HOME DO G1 AGORA</span>
        <span class="destaque-horario">{dataHoraDestaque}</span>
      {:else}
        <span class="destaque-titulo-recolhido">{@html TEXTO_DESTAQUE_RECOLHIDO}</span>
      {/if}
    </div>

    <div class="card-noticias" class:visivel={noticiaVisivel}>
      {#if noticias[indiceNoticiaAtual]}
        <span class="titulo-noticia">{noticias[indiceNoticiaAtual]}</span>
      {/if}
    </div>
  {/if}
</div>
<style>
  @font-face {
    font-family: 'Globotipo';
    src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd.woff2') format('woff2');
    font-weight: 900;
    font-style: normal;
  }

  :root {
    --cor-vermelho-g1: #c4170c;
    --cor-branco: #ffffff;
    --cor-preto: #333333;
    --fonte-principal: 'Globotipo', 'Open Sans', Arial, sans-serif;
    --duracao-transicao: 0.6s;
    --gap-entre-cards: 1vw;
  }

  .bloco-rodape-g1 {
    width: 100vw;
    max-width: 1600px;
    position: fixed;
    left: 50%;
    bottom: 10px;
    z-index: 400;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: var(--gap-entre-cards);
    pointer-events: none;
    transform: translateX(-50%);
    font-family: var(--fonte-principal);
    height: 140px;
    opacity:0;
  }

  .card-destaque {
    background: var(--cor-branco);
    color: var(--cor-vermelho-g1);
    border-radius: 12px;
    padding: 12px 18px;
    box-shadow: 0 8px 36px -8px #0008;
    pointer-events: auto;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
    /* 1. ADICIONADO 'border-radius' À TRANSIÇÃO */
    transition: width var(--duracao-transicao) ease-in-out,
                justify-content var(--duracao-transicao) ease-in-out,
                border-radius var(--duracao-transicao) ease-in-out;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .bloco-rodape-g1.modo-noticias .card-destaque {
    width: 25vw;
    justify-content: flex-start;
    align-items: center;
    /* 2. BORDAS DO CARD RECOLHIDO (Esquerda: arredondada, Direita: reta) */
    border-radius: 12px 0 0 12px;
  }

  .destaque-titulo {
    font-size: 2.5rem;
    font-weight: 900;
    text-transform: uppercase;
    line-height: 1.1;
  }
  .destaque-horario {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--cor-preto);
    line-height: 1.1;
  }
  .destaque-titulo-recolhido {
    font-size:2rem;
    font-weight: 900;
    text-transform: uppercase;
    white-space: normal;
    text-align: left;
    line-height: 1.15;
  }

  .card-noticias {
    background: var(--cor-preto);
    color: var(--cor-branco);
    border-radius: 12px;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    box-shadow: 0 8px 36px -8px #232323;
    pointer-events: auto;
    box-sizing: border-box;
    overflow: hidden;
    /* 3. ADICIONADO 'border-radius' À TRANSIÇÃO */
    transition: width var(--duracao-transicao) ease-in-out, 
                opacity calc(var(--duracao-transicao) * 0.5) ease-in-out, 
                padding var(--duracao-transicao) ease-in-out,
                border-radius var(--duracao-transicao) ease-in-out;
    width: 0;
    opacity: 0;
    padding-left: 0;
    padding-right: 0;
    border-width: 0;
  }
  
  .bloco-rodape-g1.modo-noticias .card-noticias {
    width: calc(100% - 25vw - var(--gap-entre-cards));
    opacity: 1;
    padding-left: 18px;
    padding-right: 18px;
    border-width: 0;
    /* 4. BORDAS DO CARD DE NOTÍCIA (Esquerda: reta, Direita: arredondada) */
    border-radius: 0 12px 12px 0;
  }

  .card-noticias .titulo-noticia {
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
  }
  .card-noticias.visivel .titulo-noticia {
    opacity: 1;
  }

  .titulo-noticia {
    width: 100%;
    font-size: 2rem;
    font-weight: 900;
    text-transform: uppercase;
    line-height: 1.15;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .card-loading {
      width: 100%; text-align: center; color: white;
      font-size: 1.5rem; background: #00000080;
      padding: 15px; border-radius: 12px;
  }

  @media (max-width: 768px) {
    .bloco-rodape-g1 {
      flex-direction: column;
      height: auto;
    }
    .card-destaque {
      flex-direction: column;
      align-items: flex-start;
    }
    .bloco-rodape-g1.modo-noticias .card-destaque {
        justify-content: center;
        align-items: center;
    }
    .destaque-titulo-recolhido {
        text-align: center;
    }
    .card-destaque,
    .bloco-rodape-g1.modo-noticias .card-destaque,
    .bloco-rodape-g1.modo-noticias .card-noticias {
        width: 100% !important; 
        height: auto;
        min-height: 50px;
    }
    .destaque-titulo, .destaque-titulo-recolhido { font-size: 1rem; }
    .destaque-horario { font-size: 0.8rem; }
    .titulo-noticia { font-size: 1.1rem; }
  }
</style>