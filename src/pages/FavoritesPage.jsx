import { useState } from 'react'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonThumbnail, IonLabel, IonButton, IonIcon,
  IonLoading, IonToast, IonTextarea, IonRange,
} from '@ionic/react'
import { trash, save } from 'ionicons/icons'

import { useFavoritos } from '../hooks/useFavoritos.js'
import { IMG_FALLBACK } from '../services/rawg.service.js'

function FavoritesPage() {
  const { favoritos, loading, erro, atualizar, remover } = useFavoritos()
  const [edicoes, setEdicoes] = useState({})

  function handleEditarCampo(favoritoId, campo, valor) {
    setEdicoes(prev => ({
      ...prev,
      [favoritoId]: { ...prev[favoritoId], [campo]: valor },
    }))
  }

  function handleGuardar(favorito) {
    const alteracoes = edicoes[favorito.id]
    if (!alteracoes) return
    atualizar(favorito.id, alteracoes) // PATCH
    setEdicoes(prev => ({ ...prev, [favorito.id]: undefined }))
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Favoritos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={loading} message="A carregar..." />
        <IonToast isOpen={erro !== ''} message={erro} duration={4000} color="danger" />

        {favoritos.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            <p style={{ fontSize: '2rem' }}>⭐</p>
            <p>Ainda não tens favoritos. Adiciona jogos a partir da página Jogos.</p>
          </div>
        )}

        <IonList>
          {favoritos.map(fav => (
            <IonItem key={fav.id} lines="full">
              <IonThumbnail slot="start">
                <img src={fav.imagem || IMG_FALLBACK} alt={fav.nome} />
              </IonThumbnail>

              <IonLabel className="ion-text-wrap">
                <h2>{fav.nome}</h2>

                <IonTextarea
                  placeholder="A tua nota pessoal sobre este jogo..."
                  value={edicoes[fav.id]?.notaPessoal ?? fav.notaPessoal}
                  onIonInput={e => handleEditarCampo(fav.id, 'notaPessoal', e.detail.value)}
                  autoGrow
                />

                <IonRange
                  min={0}
                  max={10}
                  pin
                  value={edicoes[fav.id]?.ratingPessoal ?? fav.ratingPessoal}
                  onIonChange={e => handleEditarCampo(fav.id, 'ratingPessoal', e.detail.value)}
                >
                  <div slot="label">A minha nota</div>
                </IonRange>
              </IonLabel>

              <IonButton slot="end" fill="clear" onClick={() => handleGuardar(fav)}>
                <IonIcon icon={save} color="primary" />
              </IonButton>

              <IonButton slot="end" fill="clear" onClick={() => remover(fav.id)}>
                <IonIcon icon={trash} color="danger" />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default FavoritesPage
