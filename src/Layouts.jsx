import { NavLink } from 'react-router-dom'
import './Layouts.css'

function Layout({ children }) {
  return (
    <div className="layout">
      <nav className="sidebar">
        <p className="sidebar-title">🎮 App Jogos</p>

        <NavLink className="sidebar-link" activeClassName="active" exact to="/">
          Início
        </NavLink>
        <NavLink className="sidebar-link" activeClassName="active" to="/jogos">
          Jogos
        </NavLink>
        <NavLink className="sidebar-link" activeClassName="active" to="/favoritos">
          Favoritos
        </NavLink>
      </nav>

      <main className="content">
        {children}
      </main>

      <nav className="tabbar">
        <NavLink className="tab" activeClassName="active" exact to="/">
          <span>🏠</span>
          <span>Início</span>
        </NavLink>
        <NavLink className="tab" activeClassName="active" to="/jogos">
          <span>🎮</span>
          <span>Jogos</span>
        </NavLink>
        <NavLink className="tab" activeClassName="active" to="/favoritos">
          <span>⭐</span>
          <span>Favoritos</span>
        </NavLink>
      </nav>
    </div>
  )
}

export default Layout
