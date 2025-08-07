<script>
  export let fundo = "transparent";
  export let padding = "4rem 0";
  export let margin = "0 auto";
  export let largura = "100vw";
  export let alturaDesktop = "auto";
  export let alturaMobile = "auto";

  export let transitionDuration = "1s";
  export let transitionTiming = "ease";
  export let transitionProps = "background";

  export let id = undefined;
  export let className = "";
</script>

<div
  class="section {className}"
  {id}
  style="
    background: {fundo};
    padding: {padding};
    margin: {margin};
    width: {largura};
    height: {alturaDesktop};
    transition: {transitionProps} {transitionDuration} {transitionTiming};
    --altura-mobile: {alturaMobile};
  "
>
  <slot />
</div>

<style>
  .section {
    position: relative;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .section {
      height: var(--altura-mobile);
    }
  }
</style>
