<style>
    .video {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
      filter: sepia(0.2);
    }
  
    .overlay {
      position: absolute;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
      width: 100%;
      height: 100%;
    }
  </style>
  
  <video class="video" autoplay muted loop src="/videos/2.mp4"></video>
  <div class="overlay"></div>
  