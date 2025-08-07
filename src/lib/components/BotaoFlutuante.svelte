<script>

  export let backgroundColor = '#007bff';

  export let width = '3.5rem'; // ~56px

  export let height = '3.5rem'; // ~56px

  export let borderRadius = '0.625rem'; // ~10px

  export let href = null;

  export let ariaLabel = 'Ação Rápida';
</script>

{#if href}
  <a
    {href}
    target="_blank"
    rel="noopener noreferrer"
    class="fab"
    aria-label={ariaLabel}
    style="
      --bg-color: {backgroundColor};
      --width: {width};
      --height: {height};
      --radius: {borderRadius};
    "
  >
    <slot />
  </a>
{:else}
  <button
    on:click
    class="fab"
    aria-label={ariaLabel}
    style="
      --bg-color: {backgroundColor};
      --width: {width};
      --height: {height};
      --radius: {borderRadius};
    "
  >
    <slot />
  </button>
{/if}

<style>
  .fab {
    position: fixed;
    z-index: 99999999;
    bottom: 2rem; /* Ótimo, já está em rem! */
    right: 2rem;  /* Ótimo, já está em rem! */
    cursor: pointer;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease-in-out;
    color: white;
    text-decoration: none;

    /* As propriedades CSS são preenchidas pelas variáveis que definimos no 'style' do elemento */
    background-color: var(--bg-color);
    width: var(--width);
    height: var(--height);
    border-radius: var(--radius);
  }

  .fab:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  /* REMOVEMOS a media query que forçava um tamanho fixo.
    Agora, o componente se adapta ao tamanho passado via props.
    Se precisar de um botão menor no mobile, você deve passar uma prop menor.
    Ex: <BotaoFlutuante width="3rem" height="3rem" />
    
    Ainda podemos usar a media query para ajustar o posicionamento, o que é uma boa prática.
  */
  @media (max-width: 768px) {
    .fab {
      bottom: 1.5rem; /* Ajuste de posicionamento para mobile é perfeito */
      right: 1.5rem;
    }
  }
</style>