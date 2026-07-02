const STORAGE_KEY = 'app-jogos-favoritos'

/**
 * Serviço de favoritos com persistência em localStorage.
 * Mantém a mesma interface da versão com json-server
 * (listarFavoritos, adicionarFavorito, atualizarFavorito, removerFavorito),
 * pelo que os hooks e páginas não precisam de ser alterados.
 */
export class FavoritosService {

  _ler() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  }

  _guardar(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
  }

  // GET
  listarFavoritos() {
    return Promise.resolve(this._ler())
  }

  // POST
  adicionarFavorito(jogo) {
    const lista = this._ler()
    const novo = {
      id: Date.now().toString(),
      jogoId: jogo.id,
      nome: jogo.name,
      imagem: jogo.background_image,
      notaPessoal: '',
      ratingPessoal: 0,
      dataAdicionado: new Date().toISOString(),
    }
    lista.push(novo)
    this._guardar(lista)
    return Promise.resolve(novo)
  }

  // PATCH
  atualizarFavorito(favoritoId, dados) {
    const lista = this._ler()
    const idx = lista.findIndex(f => f.id === favoritoId)
    if (idx === -1) return Promise.reject(new Error('Favorito não encontrado'))
    lista[idx] = { ...lista[idx], ...dados }
    this._guardar(lista)
    return Promise.resolve(lista[idx])
  }

  // DELETE
  removerFavorito(favoritoId) {
    const lista = this._ler().filter(f => f.id !== favoritoId)
    this._guardar(lista)
    return Promise.resolve()
  }
}
