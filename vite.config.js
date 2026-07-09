import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todos os pedidos a /steam/* são redirecionados para store.steampowered.com/*
      // (endpoints da loja: pesquisa e detalhes de jogos — só aceitam GET)
      // A Steam não devolve cabeçalhos CORS, por isso é preciso este proxy
      // para conseguir chamar a API a partir do browser. Não precisa de chave.
      '/steam': {
        target: 'https://store.steampowered.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/steam/, ''),
      },
      // Todos os pedidos a /steamapi/* são redirecionados para api.steampowered.com/*
      // (Web API oficial da Steam — aceita GET e POST; usamos POST para as notícias)
      '/steamapi': {
        target: 'https://api.steampowered.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/steamapi/, ''),
      },
    },
  },
})
