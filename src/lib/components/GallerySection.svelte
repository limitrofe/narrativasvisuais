<script>
    import { onMount } from 'svelte';
  
    let itens = [];
  
    onMount(() => {
      // Captura todos os elementos do slot
      itens = Array.from(document.querySelectorAll('.galeria-item'));
    });
  </script>
  
  <style>
    .galeria {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      width: 100%;
    }
  
    .galeria-item {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
    }
  
    .galeria-item img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.3s ease;
    }
  
    .galeria-item:hover img {
      transform: scale(1.05);
    }
  
    .galeria-legenda {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
      color: white;
      padding: 1rem;
      font-size: 1rem;
      box-sizing: border-box;
    }
  </style>
  
  <div class="galeria">
    <slot />
  </div>
  