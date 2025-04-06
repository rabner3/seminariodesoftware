// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Usuarios from './pages/Usuarios';
import Equipos from './pages/Equipos';
import Login from './pages/Login';
import Departamentos from './pages/Departamentos';


function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Verificar si hay un usuario logueado al cargar la app
    const usuarioLogueado = localStorage.getItem('usuario');
    if (usuarioLogueado) {
      setUsuario(JSON.parse(usuarioLogueado));
    }
  }, []);

  // Componente para rutas protegidas
  const ProtectedRoute = ({ children }) => {
    if (!usuario) {
      // Redirigir al login si no hay usuario
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const handleLogout = () => {
    // Eliminar usuario del localStorage
    localStorage.removeItem('usuario');
    setUsuario(null);
    // Redirigir al login
    window.location.href = '/login';
  };

  return (
    <Router>
      <Layout user={usuario} onLogout={handleLogout}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={
            usuario ? <Navigate to="/" replace /> : <Login />
          } />

          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/usuarios" element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          } />
          <Route path="/equipos" element={
            <ProtectedRoute>
              <Equipos />
            </ProtectedRoute>
          } />
          <Route path="/departamentos" element={
            <ProtectedRoute>
              <Departamentos />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;