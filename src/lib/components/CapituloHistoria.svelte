<script>
  import CapituloUmVideoFundo from './CapituloUmVideoFundo.svelte';
  import CapituloUmFrases from './CapituloUmFrases.svelte';
  import CapituloUmTexto from './CapituloUmTexto.svelte';
</script>

<div class="capitulo" id="capitulo1">
  <CapituloUmVideoFundo />
  <CapituloUmFrases />
  <CapituloUmTexto />
</div>

<style>
  .capitulo {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }
</style>
