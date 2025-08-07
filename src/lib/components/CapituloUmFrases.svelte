<script>
    import { onMount } from 'svelte';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
    gsap.registerPlugin(ScrollTrigger);
  
    let frase1, frase2;
  
    onMount(() => {
      [frase1, frase2].forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { x: -100, y: 0, opacity: 0, rotate: -5 },
          {
            x: 100,
            y: -50,
            rotate: 10,
            opacity: 1,
            duration: 3,
            delay: i * 0.5,
            scrollTrigger: {
              trigger: el,
              start: 'top center'
            }
          }
        );
      });
    });
  </script>
  
  <div class="frases">
    <div class="frase" bind:this={frase1} style="top: 40px; left: 200px">
      “É uma história muito brasileira e que pode ser recontada.” – George Moura
    </div>
    <div class="frase" bind:this={frase2} style="top: 60px; left: 300px">
      “Não é o Cangaço que foi, é o que poderia ter sido.” – Sergio Goldenberg
    </div>
  </div>
  
  <style>
    .frases {
      position: absolute;
      z-index: 3;
      top: 0;
      left: 0;
      pointer-events: none;
    }
  
    .frase {
      position: absolute;
      font-size: 1rem;
      font-style: italic;
      white-space: nowrap;
      color: rgba(255,255,255,0.8);
    }
  </style>
  