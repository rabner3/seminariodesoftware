// client/src/components/Layout.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { TitleContext } from '../context/TitleContext';
import { Link } from 'react-router-dom';
import '../assets/site.css';

const Layout = ({ children, user, onLogout }) => {
  const { title } = useContext(TitleContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejar clic en el avatar de usuario
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <div>
      {/* Barra superior */}
      <div className="top-bar">
        <h3>PROYECTO SEMINARIO</h3>
        <h2>{title}</h2>

        {user ? (
          <div className="user-login-container" ref={userMenuRef}>
            <p>{user.nombre}</p>
            <span onClick={toggleUserMenu} className="user-avatar" title={`${user.nombre} - ${user.rol}`}>
              {user.nombre.charAt(0)}
            </span>

            {/* Menú desplegable del usuario */}
            {showUserMenu && (
              <div className="user-menu">
                <div className="user-menu-header">
                  <h4>{user.nombre} {user.apellido}</h4>
                  <p className="user-email">{user.email}</p>
                  <span className={`rol-badge rol-${user.rol}`}>{user.rol}</span>
                </div>
                <div className="user-menu-content">
              
                  <hr className="user-menu-divider" />
                  <button className="user-menu-item logout-btn" onClick={onLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
                <div className="user-menu-footer">
                  <p>Último acceso: {user.ultimo_login ? new Date(user.ultimo_login).toLocaleString() : 'No disponible'}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link className="inicio-sesion" to="/login">INICIAR SESIÓN</Link>
        )}
      </div>

      {/* Barra lateral */}
      <header>
        <div>
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
                    <path d="M15-243q0-42 21.5-76T97-371q75-32 136.5-47T360-433q67 0 127.5 14.5T623-371q39 17 61 51t22 77v27q0 39-27.5 66.5T611-122H109q-39 0-66.5-27.5T15-216v-27Zm721 121q13-22 21.5-45t8.5-49v-21q0-68-29-116t-98-82q64 9 126.5 25T866-375q36 19 57.5 55t21.5 82v22q0 39-27.5 66.5T851-122H736ZM360-494q-72 0-117-45t-45-118q0-72 45-117t117-45q72 0 117.5 45T523-657q0 73-45.5 118T360-494Zm397-163q0 72-45.5 117.5T594-494q-12 0-24.5-2t-26.5-7q26-27 38.5-66t12.5-88q0-48-12.5-85.5T543-810q12-4 25-6.5t26-2.5q72 0 117.5 45.5T757-657Z" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link to="/equipos" title="Equipos">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h640v-400H160v400Zm20-40h600v-320H180v320Zm100-60q-17 0-28.5-11.5T240-420q0-17 11.5-28.5T280-460q17 0 28.5 11.5T320-420q0 17-11.5 28.5T280-380Zm200 0q-17 0-28.5-11.5T440-420q0-17 11.5-28.5T480-460q17 0 28.5 11.5T520-420q0 17-11.5 28.5T480-380Zm200 0q-17 0-28.5-11.5T640-420q0-17 11.5-28.5T680-460q17 0 28.5 11.5T720-420q0 17-11.5 28.5T680-380ZM160-280v-400 400Z"/>
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {user && (
          <button className="log-out" onClick={onLogout} title="Cerrar Sesión">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
            </svg>
          </button>
        )}
      </header>

      {/* Contenido dinámico */}
      <main>
        <div id="main-container" className="main-container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;