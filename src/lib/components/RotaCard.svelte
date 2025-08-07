<script>
  import { onMount, onDestroy } from "svelte";
  export let falkorApiUrl =
    "https://falkor-cda.bastian.globo.com/tenants/g1/instances/4af56893-1f9a-4504-9531-74458e481f91/posts/page/1";

  let noticias = [];
  let atual = 0;
  let carregando = true;
  let visivel = true;
  let fadeTimeout;
  let ultimaRecarga = "";

  function formatarDataHora(dataString) {
    if (!dataString) return "";
    try {
      const date = new Date(dataString);
      return (
        date
          .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
        " | " +
        date.toLocaleDateString("pt-BR")
      );
    } catch {
      return dataString;
    }
  }

  async function fetchNoticias() {
    carregando = true;
    try {
      const resp = await fetch(falkorApiUrl);
      const data = await resp.json();
      let parsed = [];

      data.items.forEach((item) => {
        if (item.aggregatedPosts && item.aggregatedPosts.length > 0) {
          item.aggregatedPosts.forEach((post) => {
            if (post.content && post.content.title) {
              parsed.push(post.content.title);
            }
          });
        } else if (item.content && item.content.title) {
          parsed.push(item.content.title);
        }
      });

      if (data.specialItems && data.specialItems.length > 0) {
        data.specialItems.forEach((sItem) => {
          if (sItem.externalData && sItem.externalData.items) {
            sItem.externalData.items.forEach((extItem) => {
              if (extItem.content && extItem.content.title) {
                parsed.push(extItem.content.title);
              }
            });
          }
        });
      }

      noticias = [...new Set(parsed.filter((n) => !!n))];
      carregando = false;
      atual = 0;
      visivel = true;
      ultimaRecarga = formatarDataHora(new Date());
      startRotativa();
    } catch (e) {
      carregando = false;
    }
  }

  function startRotativa() {
    clearTimeout(fadeTimeout);
    if (noticias.length === 0) return;

    function proxima() {
      visivel = false;
      fadeTimeout = setTimeout(() => {
        // Se for o último, faz novo fetch, senão avança.
        if (atual + 1 >= noticias.length) {
          fetchNoticias();
        } else {
          atual += 1;
          visivel = true;
          fadeTimeout = setTimeout(proxima, 10000);
        }
      }, 400);
    }

    // Inicia ciclo:
    fadeTimeout = setTimeout(proxima, 10000);
  }

  onMount(async () => {
    await fetchNoticias();
  });

  onDestroy(() => {
    clearTimeout(fadeTimeout);
  });
</script>

<div class="bloco-rodape-g1">
  <div class="header-row">
    <span class="titulo-main">
        <h1 class="titulo-main">
    Destaques do g1</h1>
    
    <span class="infos-datas">
      Última atualização: {ultimaRecarga ? ultimaRecarga : "--"}
    </span>
  </div>
  <div class="linha-fio"></div>

  {#if carregando}
    <div class="loading-titulo">Carregando…</div>
  {:else if noticias.length > 0}
    <div
      class="card-titulo {visivel ? 'visivel' : 'sumindo'}"
      aria-live="polite"
    >
      <span class="titulo">{noticias[atual]}</span>
    </div>
    {#if noticias.length > 1}
      <div class="indicador-rotativa-stories">
        {#each noticias as _, i}
          <span class="traco-story {i === atual ? 'ativo' : ''}"></span>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="loading-titulo">Nenhuma notícia encontrada</div>
  {/if}
</div>

<style>
.bloco-rodape-g1 {
  width: 95vw;
  max-width: 1400px;
  min-width: 230px;
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 400;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  pointer-events: none;
  transform: translateX(-50%);
}

.header-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  font-family: 'Globotipo', 'Open Sans', Arial, sans-serif;
  padding: 0;
  box-sizing: border-box;
  padding-bottom: 20px;
}
.titulo-main {
  font-size: 2.2rem;
  color: #c4170c; /* texto vermelho */
  font-weight: 900;
  letter-spacing: 0.04em;
  background-color: #ffffff; /* tarja branca */
  padding: 0.2em 0.2em; /* espaço interno */
  border-radius: 8px; /* canto arredondado */
  display: inline-block; /* garante que a tarja se ajuste ao conteúdo */
  text-transform: uppercase;
  font-family: 'Globotipo', 'Open Sans', Arial, sans-serif;
}
.infos-datas {
  font-size: 1.8rem;
  color: #c4170c;
  font-weight: 500;
  background-color: #ffffff;
  padding: 0.3em 0.6em;
  border-radius: 8px;
  display: inline-block;
  white-space: nowrap;
  text-transform: uppercase;
  font-family: 'Globotipo', 'Open Sans', Arial, sans-serif;
}

/* .linha-fio {
  width: 100%;
  margin: 10px 0 8px 0;
  height: 2.5px;
  background: linear-gradient(90deg, #fff 55%, #ffffff66 100%);
  border-radius: 3px;
  opacity: 0.85;
} */

.card-titulo {
  width: 100%;
  min-height: 3.2em;
  max-height: 3.2em;
  background: rgba(196,23,12,1);
  color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-family: 'Globotipo', 'Open Sans', Arial, sans-serif;
  font-size: 2rem;
  letter-spacing: 0.02em;
  padding: 10px 2vw 10px 2vw;
  box-shadow: 0 8px 36px -8px #0008;
  pointer-events: auto;
  transition: opacity 0.35s, transform 0.4s, background 0.3s;
  text-align: left;
  margin-bottom: 2px;
  opacity: 1;
  transform: translateY(0);
  overflow: hidden;
}
.card-titulo.sumindo {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
  pointer-events: none;
}
.card-titulo.visivel {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.titulo {
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  line-height: 1.18;
  font-size: inherit;
  font-family: 'Globotipo', 'Open Sans', Arial, sans-serif;
    font-weight: 900;

}

/* Indicador estilo stories Instagram */
.indicador-rotativa-stories {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 4px;
  margin: 8px 0 2px 0;
  pointer-events: none;
}
.traco-story {
  flex: 1 1 0;
  height: 5px;
  background: #fff;
  opacity: 0.3;
  border-radius: 3px;
  transition: opacity 0.22s;
  min-width: 0px;
}
.traco-story.ativo {
  opacity: 0.9;
  background: #fff;
}

.loading-titulo {
  color: #fff;
  font-size: 1.3rem;
  font-family: 'Globotipo', 'Open Sans', Arial, sans-serif;
  opacity: 0.7;
  padding: 16px 5vw;
  text-align: left;
}

@media (max-width: 700px) {
  .bloco-rodape-g1 {
    width: 99vw;
    max-width: 99vw;
  }
  .header-row {
    font-size: 0.99rem;
  }
  .infos-datas {
    font-size: 0.74rem;
  }
  .card-titulo {
    font-size: 1.00rem;
    min-height: 2.25em;
    max-height: 2.25em;
    padding: 7px 2vw;
  }
  /* .linha-fio {
    margin-bottom: 7px;
  } */
}
</style>
