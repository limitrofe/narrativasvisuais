<script>
  export let titulo = "Mansão de Candinho";
  export let cards = [
    {
      imagem: "/img/ze-dos-porcos.jpg",
      nome: "ZÉ DOS PORCOS",
      ator: "ATOR",
      descricao: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim"
    },
    {
      imagem: "/img/ze-dos-porcos.jpg",
      nome: "CUNEGUNDES",
      ator: "ATOR",
      descricao: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim"
    },
    {
      imagem: "/img/ze-dos-porcos.jpg",
      nome: "JUNIOR/SAMIR",
      ator: "ATOR",
      descricao: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim"
    },
    {
      imagem: "/img/ze-dos-porcos.jpg",
      nome: "PERSONAGEM",
      ator: "ATOR",
      descricao: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim"
    },
    {
      imagem: "/img/ze-dos-porcos.jpg",
      nome: "PERSONAGEM",
      ator: "ATOR",
      descricao: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim"
    }
  ];
</script>

<div class="slider-bloco">
  <h2 class="titulo">{titulo}</h2>
  <div class="slider-cards">
    {#each cards as card}
      <div class="card-personagem">
        <div class="imagem-wrapper">
          <img src={card.imagem} alt={card.nome} class="imagem-card" draggable="false"/>
          <div class="legenda">
            <span class="nome">{card.nome}</span>
            <span class="ator">{card.ator}</span>
          </div>
        </div>
        <div class="descricao">
          {card.descricao}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
.slider-bloco {
  width: 100vw;
  background: #6eb4a3;
  padding: 32px 0;
  overflow-x: hidden;
}

.titulo {
  font-size: 2.3rem;
  font-weight: 700;
  color: #fff;
  text-align: left;
  margin-left: 4vw;
  margin-bottom: 4px;
}

.slider-cards {
  display: flex;
  flex-direction: row;
  gap: 2vw;
  width: 92vw;
  margin: 0 auto;
  overflow-x: auto;
  padding-bottom: 16px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.card-personagem {
  min-width: 260px;
  max-width: 270px;
  flex: 0 0 270px;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  scroll-snap-align: start;
}

.imagem-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4.3;
  border-radius: 25px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 6px 0 0 #534a7c;
  background: transparent;
}

.imagem-card {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 25px;
}

.legenda {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ad71b4d6;
  color: #fff;
  padding: 10px 14px 6px 14px;
  font-weight: bold;
  font-size: 1.38rem;
  letter-spacing: 0.5px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  display: flex;
  flex-direction: column;
}

.nome {
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1;
}
.ator {
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.85;
  margin-top: 0.12em;
}

.descricao {
  color: #fff;
  font-size: 1.2rem;
  line-height: 1.27;
  text-align: left;
  margin-top: 4px;
  padding: 0 4px;
}

@media (max-width: 1000px) {
  .slider-cards {
    width: 98vw;
    gap: 4vw;
  }
  .titulo {
    font-size: 2.1rem;
    margin-left: 4vw;
  }
}

@media (max-width: 700px) {
  .slider-bloco {
    padding: 18px 0;
  }
  .slider-cards {
    width: 100vw;
    gap: 18px;
    padding-left: 10px;
  }
  .card-personagem {
    min-width: 72vw;
    max-width: 82vw;
    flex: 0 0 82vw;
  }
  .imagem-wrapper {
    aspect-ratio: 3/4.3;
    border-radius: 16px;
    margin-bottom: 8px;
    box-shadow: 0 4px 0 0 #534a7c;
  }
  .imagem-card {
    border-radius: 16px;
  }
  .legenda {
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    font-size: 1.2rem;
    padding: 7px 8px 4px 10px;
  }
  .descricao {
    font-size: 1.2rem;
    padding: 8px;
  }

}

.slider-cards {
  /* ...seus estilos já existentes */
  scrollbar-width: thin;
  scrollbar-color: #ad71b4d6 #ffffff44; /* thumb laranja, track branquinho */
}

/* Chrome, Edge, Safari */
.slider-cards::-webkit-scrollbar {
  height: 6px;
  background: transparent;
}

.slider-cards::-webkit-scrollbar-track {
  background: #fff;         /* trilho branco */
  border-radius: 3px;
}

.slider-cards::-webkit-scrollbar-thumb {
  background: #ad71b4d6;      /* polegar laranja */
  border-radius: 3px;
  transition: background 0.2s;
}

.slider-cards::-webkit-scrollbar-thumb:hover {
  background: #ad71b4d6;
}

.slider-cards::-webkit-scrollbar-corner {
  background: transparent;
}

/* Firefox */
.slider-cards {
  scrollbar-width: thin;
  scrollbar-color: #ad71b4d6 #fff;
}

</style>
