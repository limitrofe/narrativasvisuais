<script>
  export let srcDesk = '';
  export let srcMob = '';
  export let alt = '';
</script>

<style>
  .container {
    position: relative;
    width: 100%;
    max-width: 100vw;
    margin: 0 auto;
  }

  .imagem-base {
    width: 100%;
    height: auto;
    display: block;
  }
</style>

<div class="container">
  <picture>
    <source srcset={srcMob} media="(max-width: 768px)" />
    <source srcset={srcDesk} media="(min-width: 769px)" />
    <img class="imagem-base" src={srcDesk} alt={alt} />
  </picture>

  <slot />
</div>
