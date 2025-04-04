import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/site.css';

const Layout = ({ children, user }) => {
  return (
    <div>
      {/* Barra superior */}
      <div className="top-bar">
        <h3>DASHBOARD FINANCIERO</h3>
        <h2>INICIO</h2>

        {user ? (
          <div className="user-login-container" title={`${user.name} - ${user.role}`}>
            <p>{user.name}</p>
            <span>{user.initials}</span>
          </div>
        ) : (
          <Link className="inicio-sesion" to="/login">INICIAR SESIÓN</Link>
        )}
      </div>

      {/* Barra lateral */}
      <header>
        <div className="logo-container">
          <Link to="/">
            <img src="/img/logo-proyecto.png" alt="logo" />
          </Link>
        </div>

        <nav>
          <ul>
            <li><Link to="/usuarios">Usuarios</Link></li>
            <li><Link to="/agencias">Agencias</Link></li>
          </ul>
        </nav>

        <Link className="log-out" to="/logout">Salir</Link>
      </header>

      {/* Contenido dinámico */}
      <main>
        <div className="main-container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
