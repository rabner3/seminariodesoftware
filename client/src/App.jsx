import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Usuarios from './pages/Usuarios';
import axios from 'axios';

const user = {
  name: 'LAGOS343',
  initials: 'L',
  role: 'Administrador'
};

function App() {
  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/equipos" element={<Equipos />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;