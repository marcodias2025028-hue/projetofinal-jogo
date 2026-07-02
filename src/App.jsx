import { IonApp } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Route, Switch } from 'react-router-dom'

import Layout from './Layouts.jsx'

import HomePage from './pages/HomePage.jsx'
import GameListPage from './pages/GameListPage.jsx'
import GameDetailsPage from './pages/GameDetailsPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <Layout>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>

            <Route exact path="/jogos">
              <GameListPage />
            </Route>

            <Route exact path="/jogos/:id">
              <GameDetailsPage />
            </Route>

            <Route exact path="/favoritos">
              <FavoritesPage />
            </Route>
          </Switch>
        </Layout>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
