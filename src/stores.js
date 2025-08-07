// src/stores.js
import { writable } from 'svelte/store';

// Criamos um store "escrevível" (writable).
// Ele guardará o caminho (src) da imagem do snippet que deve estar visível.
export const snippetStore = writable('');