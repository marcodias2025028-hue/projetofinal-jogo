import { IonIcon } from '@ionic/react'
import { star, starOutline } from 'ionicons/icons'
import { IMG_FALLBACK } from '../services/rawg.service.js'

function JogoCard({ jogo, favorito, onToggleFavorito }) {
  return (
    <a className="jogo-card" href={`/jogos/${jogo.id}`}>
      <div className="jogo-card-imagem-wrap">
        <img
          src={jogo.background_image || IMG_FALLBACK}
          alt={jogo.name}
          loading="lazy"
        />

        {jogo.rating != null && (
          <span className="jogo-card-rating">★ {jogo.rating}</span>
        )}

        <button
          className="jogo-card-fav"
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onToggleFavorito(jogo)
          }}
          aria-label={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <IonIcon icon={favorito ? star : starOutline} color={favorito ? 'warning' : 'light'} />
        </button>
      </div>

      <div className="jogo-card-corpo">
        <p className="jogo-card-titulo">{jogo.name}</p>
        <p className="jogo-card-meta">{jogo.released?.split('-')[0] || 'Sem data'}</p>

        {jogo.genres?.length > 0 && (
          <div className="jogo-card-generos">
            {jogo.genres.slice(0, 2).map(g => (
              <span className="jogo-card-genero-tag" key={g.id}>{g.name}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}

export default JogoCard
