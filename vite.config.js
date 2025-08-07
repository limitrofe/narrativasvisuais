// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite'; // Para SvelteKit
import { defineConfig } from 'vite';           // Para Vite puro (se não usar SvelteKit)

// Se estiver usando SvelteKit, use esta configuração:
/** @type {import('vite').UserConfig} */
const config = {
    plugins: [sveltekit()],
    server: {
        proxy: {
            // Este proxy intercepta as requisições que o player da Globo faz para
            // 'https://origin-schemas.globo.com' e as redireciona através do seu servidor de desenvolvimento (localhost).
            // Isso evita o erro de CORS no navegador.
            '^/schemas': { // Intercepta qualquer URL que comece com /schemas
                target: 'https://origin-schemas.globo.com',
                changeOrigin: true, // Importante para que o host da requisição seja o target
                secure: true,       // Para targets HTTPS
                rewrite: (path) => path, // Não precisa reescrever o caminho, apenas proxy
            },
            // Você pode precisar de proxies adicionais dependendo dos recursos que o player tenta carregar.
            // Observe o console do navegador para quaisquer novos erros de CORS.
            // Exemplo de proxy mais genérico para s3.glbimg.com se necessário (usar com cautela):
            // '^/v1/AUTH_e1b09a2d222b4900a437a46914be81e5': {
            //     target: 'https://s3.glbimg.com',
            //     changeOrigin: true,
            //     secure: true,
            //     rewrite: (path) => path
            // }
        }
    }
};
export default config;

// Se estiver usando Vite puro (sem SvelteKit), use esta configuração:
/*
export default defineConfig({
    plugins: [svelte()], // ou svelte() se você não renomeou no projeto original
    server: {
        proxy: {
            '^/schemas': {
                target: 'https://origin-schemas.globo.com',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path,
            }
        }
    }
});
*/