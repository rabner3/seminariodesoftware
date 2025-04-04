// client/src/pages/Usuarios.jsx
import { useEffect, useContext } from 'react';
import { TitleContext } from '../context/TitleContext';

function Usuarios() {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("USUARIOS");
  }, []);

  return (
    <div className="contenedor-padre" id="contenedor-padre">
      <h1>Pagina de Usuarios</h1>
    </div>
  );
}

export default Usuarios;