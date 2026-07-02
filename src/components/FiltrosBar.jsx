import { IonSearchbar, IonSelect, IonSelectOption } from '@ionic/react'

function FiltrosBar({
  search, setSearch,
  ordering, setOrdering,
  genero, setGenero,
  generos = [],
}) {
  return (
    <div className="filtros-bar">
      <IonSearchbar
        value={search}
        onIonInput={e => setSearch(e.detail.value ?? '')}
        placeholder="Pesquisar jogos..."
      />

      <div className="filtros-row">
        <IonSelect
          interface="popover"
          value={ordering}
          placeholder="Ordenar por"
          onIonChange={e => setOrdering(e.detail.value)}
        >
          <IonSelectOption value="-rating">Melhor avaliados</IonSelectOption>
          <IonSelectOption value="-released">Mais recentes</IonSelectOption>
          <IonSelectOption value="name">Nome (A-Z)</IonSelectOption>
          <IonSelectOption value="-added">Mais populares</IonSelectOption>
        </IonSelect>

        <IonSelect
          interface="popover"
          value={genero}
          placeholder="Género"
          onIonChange={e => setGenero(e.detail.value)}
        >
          <IonSelectOption value="">Todos os géneros</IonSelectOption>
          {generos.map(g => (
            <IonSelectOption key={g.id} value={g.slug}>{g.name}</IonSelectOption>
          ))}
        </IonSelect>
      </div>
    </div>
  )
}

export default FiltrosBar
