<script>
  import { onMount } from 'svelte';
  let seed = 0;
  let raf;
  let running = true;
  export let opacity = 0.16; // Fica sutil, pode aumentar!
  export let z = 9;
  export let fill = "#fff";
  export let frequency = 0.80; // pode brincar entre 0.2 e 1.3

  function animateNoise() {
    // Anima rapidinho, parece grão real
    seed = Math.floor(Math.random() * 10000);
    if (running) raf = requestAnimationFrame(animateNoise);
  }

  onMount(() => {
    running = true;
    animateNoise();
    return () => { running = false; cancelAnimationFrame(raf); }
  });
</script>

<svg
  style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:{z};pointer-events:none;mix-blend-mode:overlay;"
  width="100vw"
  height="100vh"
  viewBox="0 0 1920 1080"
  aria-hidden="true"
>
  <defs>
    <filter id="noiseFilter" x="0" y="0" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency={frequency}
        numOctaves="4"
        seed={seed}
        stitchTiles="stitch"
      />
    </filter>
  </defs>
  <rect
    x="0" y="0"
    width="1920"
    height="1080"
    filter="url(#noiseFilter)"
    fill={fill}
    opacity={opacity}
  />
</svg>
