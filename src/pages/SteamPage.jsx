import { useState } from 'react'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonLoading, IonToast,
  IonSkeletonText, IonSpinner,
} from '@ionic/react'

import { useSteam } from '../hooks/useSteam.js'
import { steamPrecoFormatado, steamService } from '../services/steam.service.js'

const IMG_FALLBACK = 'https://placehold.co/460x215?text=Sem+Imagem'

function SteamCardSkeleton() {
  return (
    <div className="steam-card">
      <IonSkeletonText animated style={{ width: '100%', height: '100%', borderRadius: 10, position: 'absolute', inset: 0 }} />
    </div>
  )
}

function SteamCard({ jogo }) {
  const capa   = jogo.header_image || IMG_FALLBACK
  const ano    = jogo.release_date?.date || '—'
  const nota   = jogo.metacritic?.score
  const preco  = steamPrecoFormatado(jogo)

  const [mostrarNoticias, setMostrarNoticias] = useState(false)
  const [noticias, setNoticias]               = useState(null)
  const [loadingNoticias, setLoadingNoticias]  = useState(false)
  const [erroNoticias, setErroNoticias]        = useState('')

  async function handleNoticias(e) {
    e.stopPropagation()

    if (mostrarNoticias) {
      setMostrarNoticias(false)
      return
    }
    setMostrarNoticias(true)

    if (noticias) return // já foram carregadas, não voltar a pedir

    setLoadingNoticias(true)
    setErroNoticias('')
    try {
      const lista = await steamService.obterNoticias(jogo.steam_appid)
      setNoticias(lista)
    } catch (err) {
      setErroNoticias(err.message || 'Erro ao ir buscar notícias.')
    } finally {
      setLoadingNoticias(false)
    }
  }

  return (
    <div className="steam-card-wrap">
      <div className="steam-card">
        <img src={capa} alt={jogo.name} className="steam-card-img" loading="lazy" />
        <div className="steam-card-overlay">
          <p className="steam-card-titulo">{jogo.name}</p>
          <div className="steam-card-meta">
            <span>{ano}</span>
            {nota && <span className="steam-card-rating">★ {nota}/100</span>}
          </div>
          <div className="steam-card-preco">{preco}</div>
          {jogo.genres && (
            <div className="steam-card-generos">
              {jogo.genres.slice(0, 2).map(g => (
                <span key={g.id} className="steam-genero-tag">{g.description}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="steam-noticias-btn" onClick={handleNoticias}>
        {mostrarNoticias ? 'Fechar notícias' : '📰 Notícias'}
      </button>

      {mostrarNoticias && (
        <div className="steam-noticias-painel">
          {loadingNoticias && <IonSpinner name="dots" />}
          {erroNoticias && <p className="steam-noticias-erro">{erroNoticias}</p>}
          {!loadingNoticias && noticias && noticias.length === 0 && (
            <p className="steam-noticias-vazio">Sem notícias recentes.</p>
          )}
          {!loadingNoticias && noticias && noticias.length > 0 && (
            <ul className="steam-noticias-lista">
              {noticias.slice(0, 3).map(n => (
                <li key={n.gid}>
                  <a href={n.url} target="_blank" rel="noreferrer">{n.title}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function SteamPage() {
  const { resultados, loading, erro, termoPesquisa, pesquisar } = useSteam()
  const [input, setInput] = useState('')

  function handlePesquisar() {
    if (input.trim()) pesquisar(input.trim())
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pesquisa Steam</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={loading} message="A pesquisar na Steam..." />

        <IonToast
          isOpen={erro !== ''}
          message={erro}
          duration={4000}
          color="danger"
        />

        <div className="steam-search-wrap">
          <IonSearchbar
            value={input}
            onIonInput={e => setInput(e.detail.value ?? '')}
            onKeyDown={e => e.key === 'Enter' && handlePesquisar()}
            placeholder="Pesquisar jogos na Steam..."
            showCancelButton="never"
          />
          <button className="steam-search-btn" onClick={handlePesquisar}>
            Pesquisar
          </button>
        </div>

        {/* Estado inicial */}
        {!loading && resultados.length === 0 && !termoPesquisa && (
          <div className="steam-estado-inicial">
            <p className="steam-emoji">🕹️</p>
            <p className="steam-hint">Pesquisa qualquer jogo na loja Steam</p>
          </div>
        )}

        {/* Sem resultados */}
        {!loading && resultados.length === 0 && termoPesquisa && !erro && (
          <div className="steam-estado-inicial">
            <p className="steam-emoji">🔍</p>
            <p className="steam-hint">Sem resultados para "{termoPesquisa}"</p>
          </div>
        )}

        {/* Skeleton durante loading */}
        {loading && (
          <div className="steam-grid">
            {[...Array(8)].map((_, i) => <SteamCardSkeleton key={i} />)}
          </div>
        )}

        {/* Resultados */}
        {!loading && resultados.length > 0 && (
          <>
            <p className="steam-resultados-label">
              {resultados.length} resultados para "{termoPesquisa}"
            </p>
            <div className="steam-grid">
              {resultados.map(jogo => (
                <SteamCard key={jogo.steam_appid} jogo={jogo} />
              ))}
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  )
}

export default SteamPage
