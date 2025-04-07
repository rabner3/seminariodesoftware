// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Usuarios from './pages/Usuarios';
import Equipos from './pages/Equipos';
import Login from './pages/Login';
import Solicitudes from './pages/Solicitudes';
import UsuarioDashboard from './pages/UsuarioDashboard';
import EquipoDetalle from './pages/EquipoDetalle';
import SolicitudFormPage from './pages/SolicitudFormPage';
// Importaciones para vistas de técnicos
import TecnicoDashboard from './pages/TecnicoDashboard';
import TecnicoReparaciones from './pages/TecnicoReparaciones';
import TecnicoReparacionDetalle from './pages/TecnicoReparacionDetalle';
import TecnicoAgregarParte from './pages/TecnicoAgregarParte';
import TecnicoBitacoras from './pages/TecnicoBitacoras';
import TecnicoDiagnosticos from './pages/TecnicoDiagnosticos';
import TecnicoPartes from './pages/TecnicoPartes';
import Departamentos from './pages/Departamentos';
import AdminDashboard from './pages/AdminDashboard';

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
              {usuario?.rol === 'tecnico' ? <TecnicoDashboard /> : 
               (usuario?.rol === 'admin' ? <AdminDashboard /> :
               (usuario?.rol === 'usuario' ? <UsuarioDashboard /> : <Home />))}
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

          {/* Rutas para equipos y solicitudes */}
          <Route path="/equipos/detalle/:id" element={
            <ProtectedRoute>
              <EquipoDetalle />
            </ProtectedRoute>
          } />

          <Route path="/solicitudes" element={
            <ProtectedRoute>
              <Solicitudes />
            </ProtectedRoute>
          } />

          <Route path="/solicitudes/nueva" element={
            <ProtectedRoute>
              <SolicitudFormPage />
            </ProtectedRoute>
          } />

          <Route path="/solicitudes/nueva/:id" element={
            <ProtectedRoute>
              <SolicitudFormPage />
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

          <Route path="/tecnico/bitacoras" element={
            <ProtectedRoute requiredRoles={['tecnico']}>
              <TecnicoBitacoras />
            </ProtectedRoute>
          } />

          <Route path="/tecnico/diagnosticos" element={
            <ProtectedRoute requiredRoles={['tecnico']}>
              <TecnicoDiagnosticos />
            </ProtectedRoute>
          } />

          <Route path="/tecnico/partes" element={
            <ProtectedRoute requiredRoles={['tecnico']}>
              <TecnicoPartes />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;