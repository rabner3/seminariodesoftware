// client/src/pages/TecnicoPartes.jsx
import { useEffect, useContext, useState } from 'react';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import '../assets/tecnicos.css';

function TecnicoPartes() {
    const { setTitle } = useContext(TitleContext);
    const [partes, setPartes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroBusqueda, setFiltroBusqueda] = useState('');

    useEffect(() => {
        setTitle("INVENTARIO DE PARTES");
        cargarPartes();
    }, [setTitle]);

    const cargarPartes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/partes');
            setPartes(response.data);
            setLoading(false);
        } catch (err) {
            setError(`Error al cargar datos: ${err.message}`);
            setLoading(false);
        }
    };

    // Filtrar partes según los criterios
    const partesFiltradas = () => {
        return partes.filter(parte => {
            // Filtrar por estado
            if (filtroEstado !== 'todos' && parte.estado !== filtroEstado) {
                return false;
            }

            // Filtrar por búsqueda
            if (filtroBusqueda.trim() !== '') {
                const busqueda = filtroBusqueda.toLowerCase();
                return (
                    parte.nombre?.toLowerCase().includes(busqueda) ||
                    parte.descripcion?.toLowerCase().includes(busqueda) ||
                    parte.proveedor?.toLowerCase().includes(busqueda) ||
                    parte.codigo_referencia?.toLowerCase().includes(busqueda)
                );
            }

            return true;
        });
    };

    if (loading) return <div className="loading">Cargando inventario de partes...</div>;
    if (error) return <div className="error">{error}</div>;

    const partesMostrar = partesFiltradas();

    return (
        <div className="contenedor-padre" id="contenedor-padre">
            <div className="filtros-container container-widgets">
                <div className="filtros-header">
                    <h2>Inventario de Partes</h2>
                    <div className="contador-resultados">
                        {partesMostrar.length} {partesMostrar.length === 1 ? 'resultado' : 'resultados'}
                    </div>
                </div>

                <div className="filtros-content">
                    <div className="filtro-grupo">
                        <label>Estado:</label>
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="disponible">Disponible</option>
                            <option value="agotado">Agotado</option>
                            <option value="descontinuado">Descontinuado</option>
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <label>Buscar:</label>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, descripción o proveedor..."
                            value={filtroBusqueda}
                            onChange={(e) => setFiltroBusqueda(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container-widgets">
                {partesMostrar.length > 0 ? (
                    <div className="container-flow-table">
                        <table className="equipos-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Cantidad</th>
                                    <th>Costo Unit.</th>
                                    <th>Proveedor</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partesMostrar.map(parte => (
                                    <tr key={parte.id_parte}>
                                        <td>{parte.id_parte}</td>
                                        <td>{parte.nombre}</td>
                                        <td>{parte.descripcion?.substring(0, 50)}</td>
                                        <td>{parte.cantidad || 0}</td>
                                        <td>${parte.costo_unitario}</td>
                                        <td>{parte.proveedor}</td>
                                        <td>
                                            <span className={`estado-badge estado-${parte.estado}`}>
                                                {parte.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-resultados">
                        <p>No se encontraron partes que coincidan con los filtros.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TecnicoPartes;