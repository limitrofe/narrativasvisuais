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
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-rg-lt.woff2') format('woff2');
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
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bd-lt.woff2') format('woff2');
      font-weight: 700;
      font-style: italic;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bk.woff2') format('woff2');
      font-weight: 900;
      font-style: normal;
    }
    @font-face {
      font-family: 'Globotipo';
      src: url('https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/gshow/guerreiros/fonts/globo-bk-lt.woff2') format('woff2');
      font-weight: 900;
      font-style: italic;
    }
  </style>
</svelte:head>


<script>
  // Adicionamos onDestroy para limpar o intervalo
  import { onMount, onDestroy } from 'svelte';

  export let falkorApiUrl = "https://falkor-cda.bastian.globo.com/tenants/g1/instances/4af56893-1f9a-4504-9531-74458e481f91/posts/page/1";
  export let altura = "150px"; // Esta altura pode precisar de ajuste dependendo do conteúdo final

  let noticias = [];
  let offset = 0;
  let updateInterval; // Variável para armazenar o ID do intervalo de atualização

  // Função para formatar a data
  function formatarData(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo'
      };
      return date.toLocaleString('pt-BR', options);
    } catch (e) {
      console.error("Erro ao formatar data:", isoString, e);
      return isoString;
    }
  }

  // Função para buscar as notícias da API Falkor
  async function fetchNoticias() {
    try {
      const response = await fetch(falkorApiUrl);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const parsedNoticias = [];

      data.items.forEach(item => {
        if (item.aggregatedPosts && item.aggregatedPosts.length > 0) {
          item.aggregatedPosts.forEach(post => {
            if (post.content && post.content.title && post.content.url) {
              parsedNoticias.push({
                editoria: post.content.chapeu ? post.content.chapeu.label : item.content.section || 'Geral',
                titulo: post.content.title,
                url: post.content.url,
                resumo: post.content.summary || '',
                dataPublicacao: post.publication || item.publication,
                dataUltimaAtualizacao: post.lastPublication || item.lastPublication,
                imagemUrl: post.content.image && post.content.image.sizes && post.content.image.sizes.S ? post.content.image.sizes.S.url : null // Usando 'S' para thumbnail
              });
            }
          });
        }
        else if (item.content && item.content.title && item.content.url) {
          parsedNoticias.push({
            editoria: item.content.chapeu ? item.content.chapeu.label : item.content.section || 'Geral',
            titulo: item.content.title,
            url: item.content.url,
            resumo: item.content.summary || '',
            dataPublicacao: item.publication,
            dataUltimaAtualizacao: item.modified,
            imagemUrl: item.content.image && item.content.image.sizes && item.content.image.sizes.S ? item.content.image.sizes.S.url : null // Usando 'S' para thumbnail
          });
        }
      });

      if (data.specialItems && data.specialItems.length > 0) {
        data.specialItems.forEach(sItem => {
          if (sItem.externalData && sItem.externalData.items) {
            sItem.externalData.items.forEach(extItem => {
              if (extItem.content && extItem.content.title && extItem.content.url) {
                parsedNoticias.push({
                  editoria: extItem.content.chapeu ? extItem.content.chapeu.label : extItem.content.section || 'Geral',
                  titulo: extItem.content.title,
                  url: extItem.content.url,
                  resumo: extItem.content.summary || '',
                  dataPublicacao: extItem.publication,
                  dataUltimaAtualizacao: extItem.modified,
                  imagemUrl: extItem.content.image && extItem.content.image.sizes && extItem.content.image.sizes.S ? extItem.content.image.sizes.S.url : null // Usando 'S' para thumbnail
                });
              }
            });
          }
        });
      }

      // Atualiza as notícias e reseta o offset para que a rotativa recomece com os novos dados
      const validNoticias = parsedNoticias.filter(n => n.titulo && n.url);
      noticias = [...validNoticias, ...validNoticias]; // duplica para a esteira girar sem fim
      offset = 0; // Reinicia o offset ao atualizar as notícias
      startAnim(); // Reinicia a animação com as novas notícias

    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      // Mantém as notícias atuais em caso de erro para não quebrar a exibição
    }
  }

let animId;

function getSpeed() {
  // Ajuste os valores como preferir
  if (window.innerWidth <= 700) { // Considera mobile até 700px
    return 1.2; // Velocidade mobile
  } else {
    return 3; // Velocidade desktop
  }
}

function startAnim() {
  cancelAnimationFrame(animId);

  function step() {
    offset -= getSpeed(); // Agora usa velocidade conforme device

    if (noticias.length > 0) {
      const singleCardTotalWidth = 350 + 20; // min-width + margin-right (desktop, ajuste se quiser mobile diferente)
      const totalContentWidth = singleCardTotalWidth * (noticias.length / 2);

      if (Math.abs(offset) >= totalContentWidth) {
        offset = 0;
      }
    } else {
      offset = 0;
      cancelAnimationFrame(animId);
      return;
    }
    animId = requestAnimationFrame(step);
  }

  animId = requestAnimationFrame(step);
}

  onMount(async () => {
    // Faz a primeira busca ao montar o componente
    await fetchNoticias();

    // Define o intervalo para buscar novas notícias a cada 3 minutos (3 * 60 * 1000 ms)
    // A condição `typeof window !== 'undefined'` é uma proteção extra para Server-Side Rendering
    // para garantir que o setInterval só seja executado no navegador.
    if (typeof window !== 'undefined') {
        updateInterval = setInterval(fetchNoticias, 10 * 60 * 1000);
    }
  });

  onDestroy(() => {
    // Limpa o intervalo e o animation frame quando o componente é destruído para evitar vazamento de memória
    if (typeof window !== 'undefined') { // Proteção extra para ambientes SSR
        clearInterval(updateInterval);
        cancelAnimationFrame(animId);
    }
  });
</script>

<div class="rotativa" style="height:{altura};min-height:{altura};max-height:{altura};">
  <div class="rotativa-esteira" style="transform:translateX({offset}px);height:{altura};min-height:{altura};max-height:{altura};">
    {#each noticias as n, i (i)}
      <a class="card-noticia" href={n['url']} target="_blank" rel="noopener">
        <div class="card-inner-flex">
          {#if n.imagemUrl}
            <div class="card-imagem-container">
              <img src={n.imagemUrl} alt={n.titulo} class="card-imagem" />
            </div>
          {/if}
          <div class="card-texto-content">
            <div class="editoria-data-container">
              <div class="editoria">
                {n['editoria'] || 'Geral'} | {formatarData(n.dataPublicacao)}
              </div>

            </div>
            <div class="titulo">
              {n['titulo']}
            </div>

            </div>
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  body, html {
  font-family: 'Globotipo', Arial, sans-serif;
}
  .rotativa {
    width: 100vw;
    background: transparent;
    color: #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 200;
    height: 300px !important; /* Altura padrão para desktop */
    min-height: 200px !important;
    max-height: 350px !important;
    padding: 0px 0;
    margin: 0;
  }

  .rotativa-esteira {
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-family: 'Globotipo', Arial, sans-serif;
    height: 100%;
    min-height: 300px;
    max-height: 450px;
    padding: 0;
    margin: 0;
    gap: 10px;
  }

  .card-noticia {
    color: inherit;
    text-decoration: none;
    display: inline-flex; /* Permite controlar o flex interno */
    flex-direction: row; /* Alinhamento principal dos conteúdos (imagem e texto) */
    align-items: center;
    background: rgba(196, 23, 12, 1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 16px;
    min-width: 1200px; /* Largura total do card (200px imagem + gap + 200px texto + padding) */
    max-width: 1300px; /* Um pouco mais de flexibilidade */
    height: 230px; /* Ajustado para acomodar a nova altura dos elementos */
    margin-right: 8px;
    transition: all 0.5s ease;
    box-shadow: 2 4px -1px rgba(0,0,0,1);
  }

  .card-noticia:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .card-inner-flex {
    display: flex;
    align-items: start;
    width: 100%;
    gap: 5px; /* Espaço entre a imagem e o texto */
    height: 100%;
  }

  .card-imagem-container {
    flex-shrink: 0; /* Impede que a imagem encolha */
    width: 340px; /* Largura da imagem */
    height: 100%; /* Ocupa a altura total disponível no flex */
    display: flex;
    align-items: start;
    justify-content: start;
    overflow: hidden; /* Garante que a imagem não vaze */
    border-radius: 8px; /* Opcional: arredondar a imagem também */
    border: 1px solid rgba(255, 255, 255, 1); /* Borda sutil */
  }

  .card-imagem {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Recorta a imagem para preencher o contêiner */
  }

  .card-texto-content {
    flex-grow: 1; /* Permite que o texto ocupe o espaço restante */
    display: flex;
    flex-direction: column;
    justify-content:start ; /* Centraliza verticalmente o texto */
    min-width: 950px; /* Largura mínima para o texto */
    max-width: 1000px; /* Largura máxima para o texto */
    overflow: hidden; /* Garante que o texto não vaze */
    text-align: left; /* Alinha o texto à esquerda */
    padding-top: 10px;
    padding-left: 10px;
  }

  .editoria-data-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
    width: 100%;
  }

  .editoria {
    font-size: 2rem;
    font-weight: 100;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.8);
    /* background: rgba(255, 255, 255, 0.1); */
    padding: 0px 0px;
    border-radius: 12px;
    white-space: nowrap;
    text-align: left;
    width: fit-content; /* Ajusta a largura ao conteúdo */
    margin-bottom: 4px; /* Espaço entre editoria e data */
    width: 90%;
    text-transform:capitalize; /* Capitaliza a primeira letra de cada palavra */
  }

  .data-publicacao {
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap; /* Impede que a data quebre linha */
    text-align: left;
    font-weight: 100;
  }

  .titulo {
    font-size: 3.3rem; /* Ajuste o tamanho da fonte para caber no espaço */
    font-weight: 600;
    line-height: 1.1;
    color: #fff;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Limita a 3 linhas */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
    /* text-transform: uppercase; */
    flex-grow: 1; /* Permite que o título ocupe o espaço restante */
  }

  /* Media Queries para responsividade */
  @media (max-width: 768px) {
    .rotativa, .rotativa-esteira {
      height: 120px !important;
      min-height: 100px !important;
      max-height: 120px !important;
      padding: 15px 0;
    }

    .card-noticia {
      min-width: 480px; /* Ajuste a largura do card para telas menores */
      max-width: 520px;
      height: 90px;
      padding: 12px;
      margin-right: 15px;
      border-radius: 8px;
    }

    .card-imagem-container {
      width: 80px; /* Diminui a imagem */
    }

    .card-texto-content {
      min-width: 240px;
      max-width: 320px;
    }

    .editoria {
      font-size: 0.65rem;
      margin-bottom: 6px;
      border-radius: 4px;
    }

    .data-publicacao {
      font-size: 0.6rem;
    }

    .titulo {
      font-size: 0.85rem;
      -webkit-line-clamp: 2; /* Limita a 2 linhas em telas menores */
    }
  }

  @media (max-width: 480px) {
    .rotativa, .rotativa-esteira {
      height: 180px !important;
      min-height: 180px !important;
      max-height: 240px !important;
      padding: 0px 0;
    }

    .card-noticia {
      min-width: 420px;
      max-width: 520px;
      height: 120px;
      padding: 8px;
      margin-right: 10px;
    }

    .card-imagem-container {
      width: 140px;
    }

    .card-texto-content {
      min-width: 240px;
      max-width: 240px;
    }

    .editoria {
      font-size: 0.9rem;
      margin-bottom: 1px;
      /* padding: 3px 6px; */
    }

    .data-publicacao {
      font-size: 0.55rem;
    }

    .titulo {
      font-size: 1rem;
      line-height: 1.3rem;
      -webkit-line-clamp: 4;
    }
  }
</style>