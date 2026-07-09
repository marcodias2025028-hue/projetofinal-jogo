import { useState, useCallback } from 'react'
import { SteamService } from '../services/steam.service.js'

const service = new SteamService()

/**
 * Hook que encapsula o estado da pesquisa na Steam.
 * Os componentes só conhecem este hook — não chamam o service diretamente.
 */
export function useSteam() {
  const [resultados, setResultados] = useState([])
  const [loading, setLoading]       = useState(false)
  const [erro, setErro]             = useState('')
  const [termoPesquisa, setTermoPesquisa] = useState('')

  const pesquisar = useCallback((termo) => {
    if (!termo.trim()) return
    setLoading(true)
    setErro('')
    setTermoPesquisa(termo)

    service
      .pesquisarJogos(termo)
      .then(data => {
        if (!data || data.length === 0) {
          setResultados([])
          setErro('Nenhum resultado encontrado para "' + termo + '".')
        } else {
          setResultados(data)
        }
      })
      .catch(e => {
        console.error('[useSteam]', e)
        setErro(e.message || 'Erro ao pesquisar na Steam.')
        setResultados([])
      })
      .finally(() => setLoading(false))
  }, [])

  return { resultados, loading, erro, termoPesquisa, pesquisar }
}
