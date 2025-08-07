<script>
    import { onMount } from 'svelte';
  
    let canvas;
    let ctx;
    let width = 0;
    let height = 0;
  
    let particles = [];
    const total = 400;
  
    function createParticle() {
      return {
        x: Math.random() * width,
        y: height + Math.random() * 100,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1.5 + 0.5,
        size: Math.random() * 2 + 1,
        life: Math.random() * 100 + 60,
        color: `rgba(100, 60, 30, ${Math.random() * 0.4 + 0.4})`
      };
    }
  
    function drawParticle(p) {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size); // VISÍVEL
    }
  
    function update() {
      if (!ctx) return;
  
      ctx.clearRect(0, 0, width, height);
  
      // DEBUG VISUAL: label no canto
      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      ctx.fillRect(10, 10, 120, 30);
      ctx.fillStyle = 'white';
      ctx.font = '16px sans-serif';
      ctx.fillText("POEIRA ATIVA", 20, 30);
  
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y -= p.vy;
        p.life--;
  
        if (p.life <= 0 || p.y < 0 || p.x < 0 || p.x > width) {
          particles[i] = createParticle();
        } else {
          drawParticle(p);
        }
      }
      requestAnimationFrame(update);
    }
  
    onMount(() => {
      width = window.innerWidth;
      height = window.innerHeight;
  
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
        if (ctx) {
          particles = Array.from({ length: total }, createParticle);
          update();
        }
      }
    });
  </script>
  
  <canvas bind:this={canvas} class="poeira-canvas"></canvas>
  
  <style>
    .poeira-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 10;
      pointer-events: none;
      mix-blend-mode: screen;
      image-rendering: pixelated;
    }
  </style>
  