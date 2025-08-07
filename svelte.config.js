import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      pages: 'build',    // pasta de saída das páginas
      assets: 'build',   // pasta de saída dos assets
      fallback: null     // se quiser SPA, coloque 'index.html'
    })
  }
};
