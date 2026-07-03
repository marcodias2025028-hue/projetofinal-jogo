import { useState } from 'react'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonThumbnail, IonLabel, IonButton, IonIcon,
  IonToast, IonTextarea,
} from '@ionic/react'
import { trash, save, star, starOutline } from 'ionicons/icons'

import { useFavoritos } from '../hooks/useFavoritos'
import { IMG_FALLBACK } from '../services/rawg.service'

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  const current = hover || value || 0

  return (
      <div className="star-rating">
        <span className="star-label">A minha nota</span>
        <div className="star-row">
          {[1, 2, 3, 4, 5].map(n => (
              <button
                  key={n}
                  className="star-btn"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => onChange(n === value ? 0 : n)}
                  aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
              >
                <IonIcon
                    icon={n <= current ? star : starOutline}
                    className={n <= current ? 'star-filled' : 'star-empty'}
                />
              </button>
          ))}
          {value > 0 && (
              <span className="star-valor">{value}/5</span>
          )}
        </div>
      </div>
  )
}

function FavoritesPage() {
  const { favoritos, erro, atualizar, remover } = useFavoritos()
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
    atualizar(favorito.id, alteracoes)
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
          <IonToast isOpen={erro !== ''} message={erro} duration={4000} color="danger" />

          {favoritos.length === 0 && (
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

                    <StarRating
                        value={edicoes[fav.id]?.ratingPessoal ?? fav.ratingPessoal}
                        onChange={val => handleEditarCampo(fav.id, 'ratingPessoal', val)}
                    />
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
