import { useState, useEffect, useCallback } from 'react'
import { FavoritosService } from '../services/favoritos.service.js'

const service = new FavoritosService()

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const carregar = useCallback(() => {
    setLoading(true)
    service
      .listarFavoritos()
      .then(setFavoritos)
      .catch(() => setErro('Não foi possível ligar à API de favoritos. Confirma que o json-server está a correr.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  function isFavorito(jogoId) {
    return favoritos.some(f => f.jogoId === jogoId)
  }

  function adicionar(jogo) {
    setErro('')
    return service
      .adicionarFavorito(jogo)
      .then(novo => {
        setFavoritos(prev => [...prev, novo])
        return novo
      })
      .catch(e => {
        console.error('[useFavoritos] Falha ao adicionar favorito:', e)
        setErro('Não foi possível adicionar aos favoritos. Confirma que a API local está a correr (npm run api).')
        throw e
      })
  }

  function atualizar(favoritoId, dados) {
    setErro('')
    return service
      .atualizarFavorito(favoritoId, dados)
      .then(atualizado => {
        setFavoritos(prev => prev.map(f => (f.id === favoritoId ? atualizado : f)))
        return atualizado
      })
      .catch(e => {
        console.error('[useFavoritos] Falha ao atualizar favorito:', e)
        setErro('Não foi possível guardar as alterações. Confirma que a API local está a correr (npm run api).')
        throw e
      })
  }

  function remover(favoritoId) {
    setErro('')
    return service
      .removerFavorito(favoritoId)
      .then(() => {
        setFavoritos(prev => prev.filter(f => f.id !== favoritoId))
      })
      .catch(e => {
        console.error('[useFavoritos] Falha ao remover favorito:', e)
        setErro('Não foi possível remover o favorito. Confirma que a API local está a correr (npm run api).')
        throw e
      })
  }

  return { favoritos, loading, erro, isFavorito, adicionar, atualizar, remover, carregar }
}
