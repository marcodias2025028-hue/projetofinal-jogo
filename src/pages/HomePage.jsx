import { useState, useEffect } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/react'
import { arrowForward, star } from 'ionicons/icons'

import { RawgService, IMG_FALLBACK } from '../services/rawg.service.js'

const service = new RawgService()

function HomePage() {
  const [destaques, setDestaques] = useState([])

  useEffect(() => {
    service
      .listarJogos({ ordering: '-rating', page: 1 })
      .then(data => setDestaques((data.results ?? []).slice(0, 6)))
      .catch(() => setDestaques([]))
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Início</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <section className="hero">
          <p className="hero-eyebrow">Catálogo RAWG</p>
          <h1 className="hero-titulo">
            Descobre o teu<br />próximo jogo favorito
          </h1>
          <p className="hero-subtitulo">
            Pesquisa, filtra e guarda jogos numa biblioteca pessoal com a tua nota.
          </p>

          <a className="hero-cta" href="/jogos">
            Explorar jogos
            <IonIcon icon={arrowForward} />
          </a>
        </section>

        {destaques.length > 0 && (
          <section className="destaques">
            <h2 className="destaques-titulo">Melhor avaliados</h2>

            <div className="destaques-grid">
              {destaques.map(jogo => (
                <a className="destaque-card" key={jogo.id} href={`/jogos/${jogo.id}`}>
                  <img
                    src={jogo.background_image || IMG_FALLBACK}
                    alt={jogo.name}
                    loading="lazy"
                  />
                  <div className="destaque-overlay">
                    <p className="destaque-nome">{jogo.name}</p>
                    <span className="destaque-rating">
                      <IonIcon icon={star} /> {jogo.rating}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </IonContent>
    </IonPage>
  )
}

export default HomePage
