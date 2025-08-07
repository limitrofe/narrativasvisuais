<script>
  export let titulo = "Galeria de Destaques";
  export let cards = [
    {
      imagem: "/img/ze-dos-porcos.jpg",
      descricao: "Descrição do item 1."
    },
    {
      imagem: "/img/ze-dos-porcos.jpg",
      descricao: "Descrição do item 2."
    },
    {
      imagem: "/img/ze-dos-porcos.jpg",
      descricao: "Descrição do item 3."
    },
    {
      imagem: "/img/ze-dos-porcos.jpg",
      descricao: "Descrição do item 4."
    },
    {
      imagem: "/img/ze-dos-porcos.jpg",
      descricao: "Descrição do item 5."
    }
  ];
</script>

<div class="galeria-bloco">
  <h2 class="titulo">{titulo}</h2>
  <div class="galeria-cards">
    {#each cards as card}
      <div class="card-img">
        <div class="imagem-wrapper">
          <img src={card.imagem} alt="" class="imagem-card" draggable="false" />
        </div>
        <div class="descricao">{card.descricao}</div>
      </div>
    {/each}
  </div>
</div>

<style>
.galeria-bloco {
  width: 100vw;
  /* background: #6eb4a3; */
  padding: 32px 0;
  overflow-x: hidden;
}

.titulo {
  font-size: 2.3rem;
  font-weight: 700;
  color: #fff;
  text-align: left;
  margin-left: 4vw;
  margin-bottom: 8px;
}

/* DESKTOP: Grid 5 colunas */
.galeria-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2vw;
  width: 60vw;
  margin: 0 auto;
  padding-bottom: 20px;
}

.card-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.imagem-wrapper {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 20px;
  overflow: hidden;
  background: transparent;
    box-shadow: 0 4px 0 0 #cd670d;
    border: 2px solid #cd670d;
}

.imagem-card {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
    object-position: top;

  border-radius: 20px;
}

.descricao {
  color: #fff;
  font-size: 1.5rem;
  line-height: 1.27;
  text-align: left;
  margin-top: 10px;
  padding: 0 4px;
  width: 100%;
}

/* MOBILE: Slider horizontal */
@media (max-width: 800px) {
  .galeria-cards {
    display: flex;
    flex-direction: row;
    gap: 16px;
    width: 100vw;
    overflow-x: auto;
    padding-left: 10px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
  .card-img {
    min-width: 72vw;
    max-width: 82vw;
    flex: 0 0 82vw;
    scroll-snap-align: start;
  }
  .imagem-wrapper {
    border-radius: 14px;
    box-shadow: 0 2px 0 0 #cd670d;
  }
  .imagem-card {
    border-radius: 14px;
  }
  .descricao {
    font-size: 1.3rem;
    padding: 2px 8px 2px 8px;
  }
  .titulo {
    font-size: 2rem;
    margin-left: 4vw;
  }
}
</style>
