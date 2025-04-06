// client/src/pages/Home.jsx
import { useEffect, useContext } from 'react';
import { TitleContext } from '../context/TitleContext';

function Home() {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("INICIO");
  }, []);

  return (
    <div className="contenedor-padre" id="contenedor-padre">
      <h1>Bienvenido al Proyecto Seminario</h1>
    </div>
  );
}
export default Home;