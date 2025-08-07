<script>
  import { onMount, onDestroy } from 'svelte';
  let container;
  let stickyArea;
  let scrollContent;

  export let slow = 1;
  export let buffer = 100;

  function isMobile() {
    return (
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth <= 820
    );
  }

  let mobile = false;
  let ticking = false;

  function updateHeight() {
    if (scrollContent && container) {
      container.style.height =
        ((scrollContent.scrollWidth - window.innerWidth + 2 * buffer) * slow) +
        window.innerHeight +
        'px';
    }
  }

  function doScrollLogic() {
    if (!container || !stickyArea || !scrollContent) return;
    const start = container.offsetTop;
    const hScroll =
      (scrollContent.scrollWidth - window.innerWidth + 2 * buffer) * slow;
    const end = start + hScroll;
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY >= start && scrollY <= end) {
      stickyArea.style.position = 'fixed';
      stickyArea.style.top = '0';
      stickyArea.style.left = '0';
      stickyArea.style.width = '100vw';
      stickyArea.style.height = '100vh';
      let x = ((scrollY - start) / slow) - buffer;
      x = Math.max(-buffer, Math.min(x, scrollContent.scrollWidth - window.innerWidth + buffer));
      scrollContent.style.transform = `translateX(-${x}px)`;
    } else if (scrollY < start) {
      stickyArea.style.position = 'absolute';
      stickyArea.style.top = '0';
      scrollContent.style.transform = `translateX(${buffer}px)`;
    } else if (scrollY > end) {
      stickyArea.style.position = 'absolute';
      stickyArea.style.top = container.offsetHeight - window.innerHeight + 'px';
      scrollContent.style.transform = `translateX(-${scrollContent.scrollWidth - window.innerWidth + buffer}px)`;
    }
  }

  function onScrollMobile() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        doScrollLogic();
        ticking = false;
      });
      ticking = true;
    }
  }

  function onScrollDesktop() {
    doScrollLogic();
  }

  let removeScrollListener = null;

  onMount(() => {
    mobile = isMobile();
    updateHeight();

    window.addEventListener('resize', updateHeight);

    // Adiciona scroll handler específico
    if (mobile) {
      window.addEventListener('scroll', onScrollMobile, { passive: true });
      // Remove transition só no mobile via JS (NÃO mexe no desktop)
      setTimeout(() => {
        if (scrollContent) scrollContent.style.transition = 'none';
      }, 0);
      removeScrollListener = () => window.removeEventListener('scroll', onScrollMobile);
    } else {
      window.addEventListener('scroll', onScrollDesktop, { passive: true });
      // Garante que transition volta no desktop
      setTimeout(() => {
        if (scrollContent) scrollContent.style.transition = '';
      }, 0);
      removeScrollListener = () => window.removeEventListener('scroll', onScrollDesktop);
    }

    doScrollLogic();

    return () => {
      window.removeEventListener('resize', updateHeight);
      if (removeScrollListener) removeScrollListener();
    };
  });
</script>

<div bind:this={container} class="scroll-h-section" style="position: relative; width: 100vw; background-color: #eddcc0; overflow: hidden;">
  <div bind:this={stickyArea} class="scroll-h-sticky" style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden;">
    <div bind:this={scrollContent} class="scroll-h-content">
      <slot />
    </div>
  </div>
</div>

<style>
  .scroll-h-content {
    display: flex;
    flex-direction: row;
    width: max-content;
    height: 100vh;
    align-items: stretch;
    background-color: #eddcc0;
    transition: transform 0.12s cubic-bezier(.1,.16,.2,1); /* Só é removido no mobile pelo JS */
    will-change: transform;
  }
</style>
