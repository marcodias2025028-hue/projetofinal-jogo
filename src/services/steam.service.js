/**
 * Serviço Steam — Steam Store API + Steam Web API
 *
 * A Steam não devolve cabeçalhos CORS, por isso os pedidos passam
 * pelo proxy do Vite para contornar essa restrição.
 *
 *  - store.steampowered.com (proxy /steam)    → só aceita GET, sem chave.
 *    Usado para pesquisar jogos e obter os seus detalhes.
 *
 *  - api.steampowered.com (proxy /steamapi)   → Web API oficial da Steam,
 *    aceita GET e POST, mas exige uma API Key. Usamos POST para ir
 *    buscar as notícias de um jogo.
 *
 * Credencial necessária no .env:
 *   VITE_STEAM_API_KEY → obtém-se grátis em https://steamcommunity.com/dev/apikey
 */

// DEPOIS
const BASE_URL     = '/api/steam-store'
const API_BASE_URL = '/api/steam-web'
const API_KEY       = import.meta.env.VITE_STEAM_API_KEY

if (!API_KEY || API_KEY === 'coloca_aqui_a_tua_chave_steam') {
  console.warn(
    '[SteamService] VITE_STEAM_API_KEY não está definida (ou ainda tem o valor de exemplo). ' +
    'As notícias (POST) vão falhar. Obtém uma chave grátis em https://steamcommunity.com/dev/apikey ' +
    'e coloca-a no ficheiro .env.'
  )
}

async function getSteam(path) {
  let resposta
  try {
    resposta = await fetch(`${BASE_URL}${path}`)
  } catch {
    throw new Error('Não foi possível contactar a API da Steam. Verifica a ligação à internet.')
  }

  if (!resposta.ok) {
    throw new Error(`Erro da API Steam (HTTP ${resposta.status}).`)
  }

  return resposta.json()
}

// DEPOIS
async function getSteamApi(path, dados) {
  const params = new URLSearchParams(dados)
  let resposta
  try {
    resposta = await fetch(`${API_BASE_URL}${path}?${params.toString()}`)
  } catch {
    throw new Error('Não foi possível contactar a Web API da Steam. Verifica a ligação à internet.')
  }

  if (!resposta.ok) {
    if (resposta.status === 401 || resposta.status === 403) {
      throw new Error('Chave da Steam Web API inválida ou em falta. Confirma o VITE_STEAM_API_KEY no .env.')
    }
    throw new Error(`Erro da Web API Steam (HTTP ${resposta.status}).`)
  }

  return resposta.json()
}

/** Formata o preço devolvido pela Steam (vem em cêntimos) */
export function steamPrecoFormatado(jogo) {
  if (jogo.is_free) return 'Grátis'
  if (!jogo.price_overview) return '—'
  return (jogo.price_overview.final / 100).toFixed(2) + ' ' + jogo.price_overview.currency
}

export class SteamService {

  /**
   * GET /api/storesearch — pesquisar jogos por nome.
   * A pesquisa só devolve id/nome/imagem, por isso vamos depois
   * buscar os detalhes de cada resultado (género, ano, nota, preço).
   */
  async pesquisarJogos(termo) {
    const params = new URLSearchParams({ term: termo, l: 'portuguese', cc: 'pt' })
    const data = await getSteam(`/api/storesearch/?${params.toString()}`)
    const items = data.items || []

    const detalhes = await Promise.all(
      items.slice(0, 12).map(item => this.obterDetalhes(item.id).catch(() => null))
    )

    return detalhes.filter(Boolean)
  }

  /**
   * GET /api/appdetails — detalhes de um jogo específico por appid.
   */
  async obterDetalhes(appid) {
    const params = new URLSearchParams({ appids: appid, l: 'portuguese', cc: 'pt' })
    const data = await getSteam(`/api/appdetails?${params.toString()}`)
    const entrada = data[appid]

    if (!entrada || !entrada.success) return null

    return entrada.data
  }

  /**
   * POST /ISteamNews/GetNewsForApp/v2/ — notícias mais recentes de um jogo.
   * Este endpoint faz parte da Web API oficial da Steam e é chamado com POST.
   */
  async obterNoticias(appid, count = 5) {
    const data = await postSteamApi('/ISteamNews/GetNewsForApp/v2/', {
      key: API_KEY,
      appid,
      count,
      maxlength: 300,
      format: 'json',
    })

    return data.appnews?.newsitems || []
  }
}

export const steamService = new SteamService()
