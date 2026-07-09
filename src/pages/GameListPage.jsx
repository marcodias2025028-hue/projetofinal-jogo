import { useState, useEffect } from 'react'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonLoading, IonToast,
} from '@ionic/react'

import { useJogos } from '../hooks/useJogos.js'
import { useFavoritos } from '../hooks/useFavoritos.js'
import { RawgService } from '../services/rawg.service.js'
import FiltrosBar from '../components/FiltrosBar.jsx'
import JogoCard from '../components/JogoCard.jsx'

const rawgService = new RawgService()

function GameListPage() {
  const {
    jogos, loading, erro,
    search, setSearch,
    ordering, setOrdering,
    genero, setGenero,
  } = useJogos()

  const { isFavorito, adicionar, favoritos, remover, erro: erroFavoritos } = useFavoritos()

  const [generos, setGeneros] = useState([])

  useEffect(() => {
    rawgService.listarGeneros().then(data => setGeneros(data.results ?? []))
  }, [])

  function handleToggleFavorito(jogo) {
    if (isFavorito(jogo.id)) {
      const existente = favoritos.find(f => f.jogoId === jogo.id)
      if (existente) remover(existente.id).catch(() => {})
    } else {
      adicionar(jogo).catch(() => {})
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Jogos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <FiltrosBar
          search={search}
          setSearch={setSearch}
          ordering={ordering}
          setOrdering={setOrdering}
          genero={genero}
          setGenero={setGenero}
          generos={generos}
        />

        <IonLoading isOpen={loading} message="A carregar..." />

        <IonToast
          isOpen={erro !== ''}
          message={erro}
          duration={4000}
          color="danger"
        />

        <IonToast
          isOpen={erroFavoritos !== ''}
          message={erroFavoritos}
          duration={4000}
          color="danger"
        />

        {jogos.length === 0 && !loading && (
          <div className="estado-vazio">
            <p>🎮</p>
            <p>{erro || 'Pesquisa um jogo para começares.'}</p>
          </div>
        )}

        <div className="jogos-grid">
          {jogos.map(jogo => (
            <JogoCard
              key={jogo.id}
              jogo={jogo}
              favorito={isFavorito(jogo.id)}
              onToggleFavorito={handleToggleFavorito}
            />
          ))}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default GameListPage
