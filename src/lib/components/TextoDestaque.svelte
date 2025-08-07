<script>
    export let texto;
    import { fly } from 'svelte/transition';
  </script>
  
  <div class="story-destaque" in:fly={{ y: 40, duration: 600 }}>
    {texto}
  </div>
  
  <style>
    .story-destaque {
      font-size: 1.8rem;
      font-weight: 400;
      color: var(--cor-vermelha);
      background: var(--cor-branca);
      padding: 1rem 0;
      border-left: 4px solid var(--cor-vermelha);
      margin: 2rem 0;
      max-width: 600px;
    }
  </style>
  