const API_KEY = import.meta.env.VITE_RAWG_API_KEY
const BASE_URL = 'https://api.rawg.io/api'

export const IMG_FALLBACK = 'https://placehold.co/300x170?text=Sem+Imagem'

if (!API_KEY || API_KEY === 'coloca_aqui_a_tua_chave_rawg') {
  console.warn(
    '[RawgService] VITE_RAWG_API_KEY não está definida (ou ainda tem o valor de exemplo). ' +
    'Cria um ficheiro .env na raiz do projeto com a tua chave da RAWG (https://rawg.io/apidocs).'
  )
}

async function fetchComErro(url) {
  let resposta
  try {
    resposta = await fetch(url)
  } catch (e) {
    throw new Error('Não foi possível contactar a API da RAWG. Verifica a tua ligação à internet.')
  }

  if (!resposta.ok) {
    if (resposta.status === 401 || resposta.status === 403) {
      throw new Error('Chave da API RAWG inválida ou em falta. Confirma o VITE_RAWG_API_KEY no .env.')
    }
    throw new Error(`Erro da API RAWG (HTTP ${resposta.status}).`)
  }

  return resposta.json()
}

export class RawgService {

  listarJogos({ search = '', ordering = '', genres = '', platforms = '', page = 1 } = {}) {
    const params = new URLSearchParams({
      key: API_KEY,
      page,
      page_size: 20,
    })

    if (search) params.append('search', search)
    if (ordering) params.append('ordering', ordering)
    if (genres) params.append('genres', genres)
    if (platforms) params.append('platforms', platforms)

    const url = `${BASE_URL}/games?${params.toString()}`
    return fetchComErro(url)
  }

  obterDetalhes(id) {
    const url = `${BASE_URL}/games/${id}?key=${API_KEY}`
    return fetchComErro(url)
  }

  listarGeneros() {
    const url = `${BASE_URL}/genres?key=${API_KEY}`
    return fetchComErro(url)
  }

  listarPlataformas() {
    const url = `${BASE_URL}/platforms?key=${API_KEY}`
    return fetchComErro(url)
  }
}
