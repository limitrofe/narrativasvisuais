<script>
    import Tweet from './Tweet.svelte';
  
    export let tweets = []; // array com os dados dos tweets
  </script>
  
  <div class="thread">
    {#each tweets as tweet}
      <Tweet {...tweet} />
    {/each}
  </div>
  
  <style>
    .thread {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
  </style>
  