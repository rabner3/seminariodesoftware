// client/src/App.jsx (actualizado)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Usuarios from './pages/Usuarios';
import Equipos from './pages/Equipos';
import Login from './pages/Login';
// Nuevas importaciones para vistas de técnicos
import TecnicoDashboard from './pages/TecnicoDashboard';
import TecnicoReparaciones from './pages/TecnicoReparaciones';
import TecnicoReparacionDetalle from './pages/TecnicoReparacionDetalle';
import TecnicoAgregarParte from './pages/TecnicoAgregarParte';
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
  const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    if (!usuario) {
      // Redirigir al login si no hay usuario
      return <Navigate to="/login" replace />;
    }

    // Si se especifican roles requeridos, verificar que el usuario tenga uno de ellos
    if (requiredRoles.length > 0 && !requiredRoles.includes(usuario.rol)) {
      return <Navigate to="/" replace />;
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
              {usuario?.rol === 'tecnico' ? <TecnicoDashboard /> : <Home />}
            </ProtectedRoute>
          } />

          {/* Rutas para administradores */}
          <Route path="/usuarios" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <Usuarios />
            </ProtectedRoute>
          } />

          <Route path="/equipos" element={
            <ProtectedRoute requiredRoles={['admin', 'tecnico']}>
              <Equipos />
            </ProtectedRoute>
          } />

          <Route path="/departamentos" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <Departamentos />
            </ProtectedRoute>
          } />
          {/* Rutas para técnicos */}
          <Route path="/tecnico/dashboard" element={
            <ProtectedRoute requiredRoles={['tecnico']}>
              <TecnicoDashboard />
            </ProtectedRoute>
          } />

          <Route path="/tecnico/reparaciones" element={
            <ProtectedRoute requiredRoles={['tecnico']}>
              <TecnicoReparaciones />
            </ProtectedRoute>
          } />

          <Route path="/tecnico/reparaciones/:id" element={
            <ProtectedRoute requiredRoles={['tecnico']}>
              <TecnicoReparacionDetalle />
            </ProtectedRoute>
          } />

          <Route path="/tecnico/reparaciones/:id/partes/nueva" element={
            <ProtectedRoute requiredRoles={['tecnico']}>
              <TecnicoAgregarParte />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;