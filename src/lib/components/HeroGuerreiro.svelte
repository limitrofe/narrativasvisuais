<script>
    import { onMount } from 'svelte';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import PoeiraReal from './PoeiraReal.svelte';
  
    gsap.registerPlugin(ScrollTrigger);
  
    let videoSrc = '/videos/guerreiros-header.mp4';
    let audioSrc = '/audio/audio-sanfona.mp3';
  
    onMount(() => {
      gsap.from(".titulo", {
        opacity: 0,
        y: 40,
        duration: 1.5,
        delay: 0.5,
        ease: "power3.out"
      });
  
      gsap.from(".linha-fina", {
        opacity: 0,
        y: 20,
        duration: 1.5,
        delay: 1,
        ease: "power3.out"
      });
  
      gsap.to(".camada-marrom", {
        scrollTrigger: {
          trigger: "#inicio",
          start: "top bottom",
          end: "top top",
          scrub: true
        },
        opacity: 1,
        duration: 2
      });
    });
  </script>
  
  <style>
    .hero {
      height: 100vh;
      position: relative;
      overflow: hidden;
    }
  
    video {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }
  
    .overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
      z-index: 1;
    }
  
    .poeira-textura {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('/img/poeira-textura.png') repeat;
      background-size: cover;
      opacity: 0.15;
      mix-blend-mode: multiply;
      z-index: 4;
      pointer-events: none;
      animation: mexePoeira 12s infinite linear alternate;
    }
  
    @keyframes mexePoeira {
      0% { transform: translate(0, 0); }
      100% { transform: translate(-30px, -20px); }
    }
  
    .camada-marrom {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(80, 50, 30, 0.6);
      backdrop-filter: blur(2px);
      opacity: 0;
      z-index: 9;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
  
    .titulo-container {
      position: relative;
      z-index: 6;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
    }
  
    .titulo {
      font-size: 3rem;
      letter-spacing: 2px;
    }
  
    .linha-fina {
      margin-top: 1rem;
      font-size: 1.2rem;
      opacity: 0.85;
    }
  
    .botao-entrar {
      margin-top: 2rem;
      background: white;
      color: black;
      font-weight: bold;
      padding: 1rem 2rem;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      transition: transform 0.3s ease;
    }
  
    .botao-entrar:hover {
      transform: scale(1.05);
    }
  </style>
  
  <div class="hero">
    <video autoplay muted loop playsinline src={videoSrc}></video>
    <div class="overlay"></div>
    <div class="poeira-textura"></div>
    <div class="camada-marrom"></div>
    <PoeiraReal />
  
    <div class="titulo-container">
      <div class="titulo">Guerreiros do Sol</div>
      <div class="linha-fina">Uma história de amor, vingança e liberdade no coração do Sertão</div>
    </div>
  
    <audio autoplay loop src={audioSrc}></audio>
  </div>
  
  <div id="inicio"></div>
  