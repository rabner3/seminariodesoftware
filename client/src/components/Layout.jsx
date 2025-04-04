import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/site.css';

const Layout = ({ children, user }) => {
  return (
    <div>
      {/* Barra superior */}
      <div className="top-bar">
        <h3>PROYECTO SEMINARIO</h3>
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
          <Link to="/" title="Inicio">
            <img src="/img/logo-proyecto.png" alt="logo" />
          </Link>
        </div>

        <nav>
          <ul>
            <li>
              <Link to="/usuarios" title="Usuarios">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                  <path d="M309-390h342v-25q0-43-45.5-68.5T480-509q-80 0-125.5 25.5T309-415v25Zm170.88-185Q514-575 537-597.38q23-22.37 23-56.5Q560-688 537.12-711q-22.87-23-57-23Q446-734 423-711.12q-23 22.87-23 57 0 34.12 22.88 56.62 22.87 22.5 57 22.5ZM215-215l-79 79q-23 23-52 11.31T55-168v-643q0-39.46 27.47-67.23Q109.95-906 149-906h662q39.46 0 67.23 27.77Q906-850.46 906-811v502q0 39.05-27.77 66.52Q850.46-215 811-215H215Z" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>

        <Link className="log-out" to="/logout" title="Salir">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
          </svg>
        </Link>
      </header>

      {/* Contenido dinámico */}
      <main>
        <div id="main-container" className="main-container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
