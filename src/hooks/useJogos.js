import { useState, useEffect, useCallback } from 'react'
import { RawgService } from '../services/rawg.service.js'

const service = new RawgService()

/**
 * Hook que encapsula o estado e a lógica de pesquisa, ordenação e
 * filtragem de jogos. As páginas apenas consomem este hook,
 * sem conhecerem detalhes da API RAWG.
 */
export function useJogos() {
  const [jogos, setJogos] = useState([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState('-rating')
  const [genero, setGenero] = useState('')
  const [plataforma, setPlataforma] = useState('')

  const pesquisar = useCallback(() => {
    setLoading(true)
    setErro('')

    service
      .listarJogos({ search, ordering, genres: genero, platforms: plataforma })
      .then(data => {
        if (!data.results || data.results.length === 0) {
          setJogos([])
          setErro('Nenhum jogo encontrado.')
          return
        }
        setJogos(data.results)
      })
      .catch(err => {
        console.error('[useJogos] Falha ao carregar jogos:', err)
        setErro(err.message || 'Erro ao carregar jogos.')
      })
      .finally(() => setLoading(false))
  }, [search, ordering, genero, plataforma])

  useEffect(() => {
    const timer = setTimeout(pesquisar, 350) // debounce: evita um pedido a cada letra
    return () => clearTimeout(timer)
  }, [search, ordering, genero, plataforma])

  return {
    jogos,
    loading,
    erro,
    search,
    setSearch,
    ordering,
    setOrdering,
    genero,
    setGenero,
    plataforma,
    setPlataforma,
    pesquisar,
  }
}
