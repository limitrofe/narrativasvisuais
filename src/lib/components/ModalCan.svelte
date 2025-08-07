<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let participante;
  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="overlay" on:click={closeModal} transition:fade>
  <div class="modal" on:click|stopPropagation transition:scale={{ duration: 250 }}>
    <button class="close" on:click={closeModal} aria-label="Fechar modal">&times;</button>

    <div class="content">
      <div class="photo">
        <img src={participante.foto} alt="Foto de {participante.NOME}" />
      </div>

      <div class="info">
        <h1>{participante.NOME}</h1>
        <p><strong>Idade:</strong> {participante.IDADE} anos</p>
        <p><strong>Ocupação:</strong> {participante.OCUPAÇÃO}</p>
        <p><strong>Equipe:</strong> <span class="badge">{participante.EQUIPE}</span></p>

        <p class="description">{participante.DESCRIÇÃO}</p>

        {#if participante.INSTAGRAM}
          <a class="instagram" href={participante.INSTAGRAM} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.5.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.4-.2.6-.5 1-.9 1.5-.5.5-.9.8-1.5 1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.4.2-.6.5-1 .9-1.5.5-.5.9-.8 1.5-1 .5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.5.2-1.9.4-.5.2-.8.4-1.2.8s-.6.7-.8 1.2c-.2.4-.3.9-.4 1.9-.1 1.1-.1 1.5-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.5.4 1.9.2.5.4.8.8 1.2.4.4.7.6 1.2.8.4.2.9.3 1.9.4 1.1.1 1.5.1 4.7.1s3.5 0 4.7-.1c1-.1 1.5-.2 1.9-.4.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-.9.4-1.9.1-1.1.1-1.5.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.5-.4-1.9-.2-.5-.4-.8-.8-1.2s-.7-.6-1.2-.8c-.4-.2-.9-.3-1.9-.4-1.1-.1-1.5-.1-4.7-.1zm0 3.4a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2zm0 1.8a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6zm5.8-.9a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0z"/></svg>
            Ver no Instagram
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    /* Alterado para alinhar no topo e permitir scroll */
    align-items: flex-start; 
    padding: 5vh 0; /* Adiciona um espaço no topo/baixo */
    z-index: 999;
  }

  .modal {
    background: #fff;
    border-radius: 16px;
    max-width: 720px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    position: relative;
    font-family: 'Globotipo', sans-serif; 
margin-top: 100px;    
    /* Novas propriedades para permitir o scroll */
    overflow-y: auto;
    max-height: 90vh;
  }

  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    color: #999;
    cursor: pointer;
    transition: color 0.2s;
  }

  .close:hover {
    color: #333;
  }

  .content {
    display: flex;
    flex-direction: column;
  }

  @media(min-width: 768px) {
    .content {
      flex-direction: row;
    }
  }

  .photo img {
    width: 100%;
    object-fit: cover;
    height: 240px;
    object-position: top;

  }

  @media(min-width: 768px) {
    .photo img {
      /* Estilos de desktop mantidos */
      height: 100%;
      width: 300px;
    }
  }

  .info {
    padding: 2rem;
    flex: 1;
    color: #232323;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: #1a1a1a;
  }

  .description {
    margin-top: 1rem;
    color: #444;
    line-height: 1.6;
  }

  .badge {
    background: transparent;
    color: #d1263d;
    padding: 0;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .instagram {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
    background: #E1306C;
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    transition: background 0.2s;
  }

  .instagram:hover {
    background: #c92b5f;
  }
</style>