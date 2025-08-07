<script>
    import { onMount } from 'svelte';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
    export let numero = "1";
    export let imagem = "";
    export let altura = "100vh";
    export let posicaoTexto = "sobreposto"; // sobreposto | acima | abaixo
    export let posicaoTextoManual = "top-left"; // top-left | top-right | bottom-left | bottom-right | center
    export let layoutMobile = "horizontal"; // horizontal | vertical
    export let animarTextoPrimeiro = true;
  
    export let larguraImagem = "100%";
    export let alturaImagem = "auto";
    export let posicaoImagemManual = "center"; // center | left | right | top-left | etc
  
    export let corNumero = "var(--cor-vermelha)";
    export let corTexto = "var(--cor-preta)";
    export let tamanhoNumero = "6rem";
    export let tamanhoTexto = "1.25rem";
  
    export let animacaoTexto = {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
    };
  
    export let animacaoImagem = {
      from: { opacity: 0, scale: 0.8, y: 100 },
      to: { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'power3.out' }
    };
  
    export let startTexto = "top 80%";
    export let startImagem = "top 85%";
  
    let blocoTexto;
    let blocoImagem;
  
    onMount(() => {
      if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
  
        if (blocoTexto) {
          gsap.fromTo(
            blocoTexto,
            animacaoTexto.from,
            {
              ...animacaoTexto.to,
              scrollTrigger: {
                trigger: blocoTexto,
                start: startTexto,
                toggleActions: "play none none reverse",
                markers: false
              }
            }
          );
        }
  
        if (blocoImagem) {
          gsap.fromTo(
            blocoImagem,
            animacaoImagem.from,
            {
              ...animacaoImagem.to,
              scrollTrigger: {
                trigger: blocoImagem,
                start: startImagem,
                toggleActions: "play none none reverse",
                markers: false
              }
            }
          );
        }
      }
    });
  </script>
  
  <div
    class="etapa-visual {posicaoTexto}"
    style="
      height: {altura};
      --largura-imagem: {larguraImagem};
      --altura-imagem: {alturaImagem};
    "
  >
    {#if posicaoTexto === 'sobreposto'}
      <img bind:this={blocoImagem} class="imagem-bg {posicaoImagemManual}" src={imagem} alt="" />
      <div class="conteudo {posicaoTextoManual}" bind:this={blocoTexto}>
        <div class="linha-horizontal {layoutMobile}">
          <div class="numero" style="color: {corNumero}; font-size: {tamanhoNumero};">{numero}</div>
          <div class="texto" style="color: {corTexto}; font-size: {tamanhoTexto};"><slot /></div>
        </div>
      </div>
  
    {:else if posicaoTexto === 'acima'}
      {#if animarTextoPrimeiro}
        <div class="conteudo" bind:this={blocoTexto}>
          <div class="numero" style="color: {corNumero}; font-size: {tamanhoNumero};">{numero}</div>
          <div class="texto" style="color: {corTexto}; font-size: {tamanhoTexto};"><slot /></div>
        </div>
        <img class="imagem-livre {posicaoImagemManual}" src={imagem} alt="" bind:this={blocoImagem} style="width: {larguraImagem}; height: {alturaImagem};" />
      {:else}
        <img class="imagem-livre {posicaoImagemManual}" src={imagem} alt="" bind:this={blocoTexto} style="width: {larguraImagem}; height: {alturaImagem};" />
        <div class="conteudo" bind:this={blocoImagem}>
          <div class="numero" style="color: {corNumero}; font-size: {tamanhoNumero};">{numero}</div>
          <div class="texto" style="color: {corTexto}; font-size: {tamanhoTexto};"><slot /></div>
        </div>
      {/if}
  
    {:else if posicaoTexto === 'abaixo'}
      {#if animarTextoPrimeiro}
        <img class="imagem-livre {posicaoImagemManual}" src={imagem} alt="" bind:this={blocoImagem} style="width: {larguraImagem}; height: {alturaImagem};" />
        <div class="conteudo" bind:this={blocoTexto}>
          <div class="numero" style="color: {corNumero}; font-size: {tamanhoNumero};">{numero}</div>
          <div class="texto" style="color: {corTexto}; font-size: {tamanhoTexto};"><slot /></div>
        </div>
      {:else}
        <img class="imagem-livre {posicaoImagemManual}" src={imagem} alt="" bind:this={blocoTexto} style="width: {larguraImagem}; height: {alturaImagem};" />
        <div class="conteudo" bind:this={blocoImagem}>
          <div class="numero" style="color: {corNumero}; font-size: {tamanhoNumero};">{numero}</div>
          <div class="texto" style="color: {corTexto}; font-size: {tamanhoTexto};"><slot /></div>
        </div>
      {/if}
    {/if}
  </div>
  
  <style>
    .etapa-visual {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      overflow: hidden;
    }
  
    .etapa-visual.sobreposto .imagem-bg {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: var(--largura-imagem);
      height: var(--altura-imagem);
      object-fit: contain;
      z-index: 0;
    }
  
    .etapa-visual.sobreposto .conteudo {
      position: absolute;
      z-index: 2;
      display: flex;
      width: 100%;
      max-width: 100%;
      padding: 1rem;
      box-sizing: border-box;
    }
  
    .linha-horizontal {
      display: flex;
      flex-direction: row;
      width: 100%;
      gap: 1rem;
    }
  
    .linha-horizontal.horizontal {
      flex-direction: row;
    }
    .linha-horizontal.vertical {
      flex-direction: column;
    }
  
    .numero {
      flex: 0 0 20%;
      text-align: right;
      font-family: var(--fonte-primaria);
      font-weight: 700;
      line-height: 1;
      margin: 0;
    }
  
    .texto {
      flex: 1;
      font-family: var(--fonte-primaria);
      line-height: 1.6;
      margin-top: 0.5rem;
      padding-right: 20%;
    }
  
    .top-left     { top: 10%; left: 10%; }
    .top-right    { top: 10%; right: 10%; }
    .bottom-left  { bottom: 10%; left: 10%; }
    .bottom-right { bottom: 10%; right: 10%; }
    .center       { top: 50%; left: 50%; transform: translate(-50%, -50%); }
  
    .imagem-livre {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      height: auto;
    }
  
    .imagem-livre.left { margin-left: 0; margin-right: auto; }
    .imagem-livre.right { margin-right: 0; margin-left: auto; }
    .imagem-livre.center { margin: 0 auto; }
  
    @media (max-width: 768px) {
      .numero {
        font-size: 3rem;
      }
      .texto {
        font-size: 1rem;
      }
    }
  </style>
  