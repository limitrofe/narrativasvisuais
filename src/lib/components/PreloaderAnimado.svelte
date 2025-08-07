<script>
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { createEventDispatcher } from 'svelte';
  
    export let imagem = '';
    export let corFundo = '#f9e8ca';
  
    export let larguraImagemDesk = 150;
    export let alturaImagemDesk = 150;
    export let larguraImagemMob = 100;
    export let alturaImagemMob = 100;
  
    export let mostrar = true;
  
    const progresso = tweened(0, {
      duration: 300,
      easing: cubicOut
    });
  
    let carregando = true;
    let total = 0;
    let carregadas = 0;
  
    let isMobile = false;
    const dispatch = createEventDispatcher();
  
    function atualizarProgresso() {
      const alvo = Math.round((carregadas / total) * 100);
      progresso.set(alvo);
    }
  
    onMount(() => {
      isMobile = window.innerWidth < 768;
  
      const imagens = Array.from(document.images);
      total = imagens.length;
      if (total === 0) finalizar();
  
      imagens.forEach(img => {
        if (img.complete) {
          carregadas++;
          atualizarProgresso();
          if (carregadas === total) finalizar();
        } else {
          img.onload = img.onerror = () => {
            carregadas++;
            atualizarProgresso();
            if (carregadas === total) finalizar();
          };
        }
      });
  
      // Timeout de segurança (8s)
      setTimeout(finalizar, 8000);
    });
  
    function finalizar() {
      progresso.set(100);
      carregando = false;
      setTimeout(() => {
        mostrar = false;
        window.scrollTo(0, 0);
        dispatch('finalizado');
      }, 600);
    }
  </script>
  
  {#if mostrar}
    <div class="preloader" style="background-color: {corFundo}">
      <div
        class="barra"
        style="transform: translateX({$progresso}vw) translateY({Math.sin($progresso / 5) * 20}px);"
      >
        <img
          src="{imagem}"
          alt="Preloader"
          style="
            width: {isMobile ? larguraImagemMob : larguraImagemDesk}px;
            height: {isMobile ? alturaImagemMob : alturaImagemDesk}px;
          "
        />
      </div>
      <div class="porcentagem">{$progresso.toFixed(0)}%</div>
    </div>
  {/if}
  
  <style>
    .preloader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-direction: column;
      transition: opacity 0.5s ease;
      pointer-events: none;
    }
  
    .barra {
      position: absolute;
      top: 40%;
      left: -150px;
      transform: translateX(0) translateY(0);
      transition: transform 0.1s linear;
    }
  
    .porcentagem {
      position: absolute;
      bottom: 2rem;
      font-size: 1.2rem;
      font-weight: bold;
      color: #000;
      font-family: sans-serif;
    }
  </style>
  