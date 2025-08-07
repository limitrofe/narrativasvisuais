<script>
    export let current = 1;
    export let total = 1;
  </script>
  
  <div class="progress-wrapper">
    <div class="progress-text">Pergunta {current} de {total}</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: {(current / total) * 100}%"></div>
    </div>
  </div>
  
  <style>
    .progress-wrapper {
      width: 100%;
      margin: 1rem 0 2rem;
    }
  
    .progress-text {
      font-size: 1rem;
      text-align: center;
      margin-bottom: 0.5rem;
      color: #444;
      font-weight: 600;
    }
  
    .progress-bar {
      width: 100%;
      height: 10px;
      background-color: #eee;
      border-radius: 5px;
      overflow: hidden;
    }
  
    .progress-fill {
      height: 100%;
      background-color: #c4170c;
      transition: width 0.3s ease;
    }
  </style>
  