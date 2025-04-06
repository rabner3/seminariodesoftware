// client/src/pages/Usuarios.jsx
import { useEffect, useContext, useState } from 'react';
import { TitleContext } from '../context/TitleContext';
import UsuariosList from '../components/usuarios/UsuariosList';
import UsuarioDetalle from '../components/usuarios/UsuarioDetalle';
import UsuarioForm from '../components/usuarios/UsuarioForm';
import '../assets/usuarios.css';

function Usuarios() {
  const { setTitle } = useContext(TitleContext);
  const [vista, setVista] = useState('lista'); // 'lista', 'detalle', 'form'
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    setTitle("USUARIOS");
  }, [setTitle]);

  const handleVerUsuario = (id) => {
    setUsuarioSeleccionado(id);
    setVista('detalle');
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setVista('form');
  };

  const handleNuevoUsuario = () => {
    setUsuarioSeleccionado(null);
    setVista('form');
  };

  const handleVolverLista = () => {
    setVista('lista');
    setUsuarioSeleccionado(null);
  };

  const handleGuardarUsuario = () => {
    // Volver a la lista después de guardar
    setVista('lista');
  };

  const handleEliminarUsuario = () => {
    // Volver a la lista después de eliminar
    setVista('lista');
  };

  // Renderizado condicional según la vista actual
  if (vista === 'detalle' && usuarioSeleccionado) {
    return (
      <div className="contenedor-padre" id="contenedor-padre">
        <UsuarioDetalle
          id={usuarioSeleccionado}
          onClose={handleVolverLista}
          onEdit={handleEditarUsuario}
          onDelete={handleEliminarUsuario}
        />
      </div>
    );
  }

  if (vista === 'form') {
    return (
      <div className="contenedor-padre" id="contenedor-padre">
        <UsuarioForm
          usuario={usuarioSeleccionado}
          onSave={handleGuardarUsuario}
          onCancel={handleVolverLista}
        />
      </div>
    );
  }

  // Vista por defecto (lista)
  return (
    <div className="contenedor-padre" id="contenedor-padre">
      <div className="container-widgets">
        <div className="container-botones">
          <button
            className="button azul-claro"
            onClick={handleNuevoUsuario}
          >
            Nuevo Usuario
          </button>
        </div>

        <UsuariosList
          onView={handleVerUsuario}
          onEdit={handleEditarUsuario}
          onDelete={handleEliminarUsuario}
        />
      </div>
    </div>
  );
}

export default Usuarios;