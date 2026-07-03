import { useState, useMemo } from 'react'
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonThumbnail, IonLabel, IonButton, IonIcon,
    IonToast, IonTextarea, IonSkeletonText, IonCard, IonCardContent, IonAlert,
} from '@ionic/react'
import { trash, save, star, starOutline } from 'ionicons/icons'

import { useFavoritos } from '../hooks/useFavoritos'
import { IMG_FALLBACK } from '../services/rawg.service'

/* ── Star Rating ── */
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
                {value > 0 && <span className="star-valor">{value}/5</span>}
            </div>
        </div>
    )
}

/* ── Skeleton para um item ── */
function FavoritoSkeleton() {
    return (
        <IonItem lines="full">
            <IonThumbnail slot="start">
                <IonSkeletonText animated style={{ width: '100%', height: '100%', borderRadius: 6 }} />
            </IonThumbnail>
            <IonLabel>
                <IonSkeletonText animated style={{ width: '60%', height: 16, marginBottom: 8 }} />
                <IonSkeletonText animated style={{ width: '90%', height: 12, marginBottom: 6 }} />
                <IonSkeletonText animated style={{ width: '40%', height: 12 }} />
            </IonLabel>
        </IonItem>
    )
}

/* ── Estatísticas ── */
function EstatisticasFavoritos({ favoritos }) {
    const stats = useMemo(() => {
        const comNota = favoritos.filter(f => f.ratingPessoal > 0)
        const media = comNota.length > 0
            ? (comNota.reduce((acc, f) => acc + f.ratingPessoal, 0) / comNota.length).toFixed(1)
            : null
        return { total: favoritos.length, media }
    }, [favoritos])

    return (
        <IonCard className="stats-card">
            <IonCardContent className="stats-row">
                <div className="stat">
                    <span className="stat-valor">{stats.total}</span>
                    <span className="stat-label">jogos guardados</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
          <span className="stat-valor">
            {stats.media ? `${stats.media} / 5` : '—'}
          </span>
                    <span className="stat-label">média das notas</span>
                </div>
            </IonCardContent>
        </IonCard>
    )
}

/* ══ Página principal ══ */
function FavoritesPage() {
    const { favoritos, loading, erro, atualizar, remover } = useFavoritos()
    const [edicoes, setEdicoes] = useState({})
    const [toastSucesso, setToastSucesso] = useState(false)
    const [confirmarRemover, setConfirmarRemover] = useState(null) // id do favorito a remover

    function temAlteracoes(fav) {
        const ed = edicoes[fav.id]
        if (!ed) return false
        return (
            ('notaPessoal'  in ed && ed.notaPessoal  !== fav.notaPessoal)  ||
            ('ratingPessoal' in ed && ed.ratingPessoal !== fav.ratingPessoal)
        )
    }

    function handleEditarCampo(favoritoId, campo, valor) {
        setEdicoes(prev => ({
            ...prev,
            [favoritoId]: { ...prev[favoritoId], [campo]: valor },
        }))
    }

    function handleGuardar(favorito) {
        const alteracoes = edicoes[favorito.id]
        if (!alteracoes) return
        atualizar(favorito.id, alteracoes).then(() => {
            setEdicoes(prev => ({ ...prev, [favorito.id]: undefined }))
            setToastSucesso(true)
        })
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Favoritos</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {/* Confirmação de remoção */}
                <IonAlert
                    isOpen={confirmarRemover !== null}
                    header="Remover favorito"
                    message="Tens a certeza que queres remover este jogo dos favoritos?"
                    buttons={[
                        {
                            text: 'Cancelar',
                            role: 'cancel',
                            handler: () => setConfirmarRemover(null),
                        },
                        {
                            text: 'Remover',
                            role: 'destructive',
                            handler: () => {
                                remover(confirmarRemover)
                                setConfirmarRemover(null)
                            },
                        },
                    ]}
                    onDidDismiss={() => setConfirmarRemover(null)}
                />
                <IonToast isOpen={erro !== ''} message={erro} duration={4000} color="danger" />

                {/* Toast de sucesso */}
                <IonToast
                    isOpen={toastSucesso}
                    message="Alterações guardadas com sucesso!"
                    duration={2500}
                    color="success"
                    onDidDismiss={() => setToastSucesso(false)}
                />

                {/* Skeleton */}
                {loading && (
                    <IonList>
                        {[1, 2, 3].map(i => <FavoritoSkeleton key={i} />)}
                    </IonList>
                )}

                {/* Estado vazio */}
                {!loading && favoritos.length === 0 && (
                    <div className="estado-vazio">
                        <p>⭐</p>
                        <p>Ainda não tens favoritos. Adiciona jogos a partir da página Jogos.</p>
                    </div>
                )}

                {/* Estatísticas */}
                {!loading && favoritos.length > 0 && (
                    <EstatisticasFavoritos favoritos={favoritos} />
                )}

                {/* Lista */}
                {!loading && (
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

                                <IonButton
                                    slot="end"
                                    fill="clear"
                                    disabled={!temAlteracoes(fav)}
                                    onClick={() => handleGuardar(fav)}
                                >
                                    <IonIcon icon={save} color={temAlteracoes(fav) ? 'primary' : 'medium'} />
                                </IonButton>

                                <IonButton slot="end" fill="clear" onClick={() => setConfirmarRemover(fav.id)}>
                                    <IonIcon icon={trash} color="danger" />
                                </IonButton>
                            </IonItem>
                        ))}
                    </IonList>
                )}
            </IonContent>
        </IonPage>
    )
}

export default FavoritesPage
