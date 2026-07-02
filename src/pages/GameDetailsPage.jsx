import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonImg, IonLoading, IonBackButton, IonButtons, IonButton, IonIcon, IonChip, IonToast,
} from '@ionic/react'
import { star, starOutline } from 'ionicons/icons'

import { RawgService, IMG_FALLBACK } from '../services/rawg.service.js'
import { useFavoritos } from '../hooks/useFavoritos.js'

const service = new RawgService()

function GameDetailsPage() {
  const { id } = useParams()
  const [jogo, setJogo] = useState(null)
  const [loading, setLoading] = useState(false)

  const { isFavorito, adicionar, remover, favoritos, erro: erroFavoritos } = useFavoritos()

  useEffect(() => {
    setLoading(true)
    service
      .obterDetalhes(id)
      .then(setJogo)
      .finally(() => setLoading(false))
  }, [id])

  function handleToggleFavorito() {
    if (!jogo) return
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
          <IonButtons slot="start">
            <IonBackButton defaultHref="/jogos" />
          </IonButtons>
          <IonTitle>{jogo?.name || 'Detalhes do Jogo'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={loading} message="A carregar..." />

        <IonToast
          isOpen={erroFavoritos !== ''}
          message={erroFavoritos}
          duration={4000}
          color="danger"
        />

        {jogo && (
          <IonCard>
            <IonImg src={jogo.background_image || IMG_FALLBACK} />

            <IonCardHeader>
              <IonCardTitle>{jogo.name}</IonCardTitle>
              <IonCardSubtitle>
                {jogo.released?.split('-')[0]} • ⭐ {jogo.rating}
              </IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              {jogo.genres?.map(g => (
                <IonChip key={g.id}>{g.name}</IonChip>
              ))}

              <p dangerouslySetInnerHTML={{ __html: jogo.description || '' }} />

              <IonButton
                expand="block"
                color={isFavorito(jogo.id) ? 'warning' : 'primary'}
                onClick={handleToggleFavorito}
              >
                <IonIcon slot="start" icon={isFavorito(jogo.id) ? star : starOutline} />
                {isFavorito(jogo.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  )
}

export default GameDetailsPage
