// client/src/pages/TecnicoBitacoras.jsx
import { useEffect, useContext, useState } from 'react';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import '../assets/tecnicos.css';

function TecnicoBitacoras() {
    const { setTitle } = useContext(TitleContext);
    const [bitacoras, setBitacoras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroBusqueda, setFiltroBusqueda] = useState('');

    useEffect(() => {
        setTitle("MIS BITÁCORAS");
        cargarBitacoras();
    }, [setTitle]);

    const cargarBitacoras = async () => {
        try {
            setLoading(true);

            // Obtener ID del técnico basado en el usuario logueado
            const usuario = JSON.parse(localStorage.getItem('usuario'));

            if (!usuario || usuario.rol !== 'tecnico') {
                setError('No tiene permisos para acceder a esta página');
                setLoading(false);
                return;
            }

            // Obtener información del técnico
            const responseTecnico = await axios.get(`http://localhost:8080/api/tecnicos/usuario/${usuario.id_usuarios}`);

            if (!responseTecnico.data) {
                setError('No se encontró información del técnico asociado a su usuario');
                setLoading(false);
                return;
            }

            // Cargar bitácoras del técnico
            const responseBitacoras = await axios.get(`http://localhost:8080/api/bitacoras-reparacion?id_tecnico=${responseTecnico.data.id_tecnico}`);
            setBitacoras(responseBitacoras.data);

            setLoading(false);
        } catch (err) {
            setError(`Error al cargar datos: ${err.message}`);
            setLoading(false);
        }
    };

    // Filtrar bitácoras según los criterios
    const bitacorasFiltradas = () => {
        return bitacoras.filter(bitacora => {
            // Filtrar por tipo
            if (filtroTipo !== 'todos' && bitacora.tipo_accion !== filtroTipo) {
                return false;
            }

            // Filtrar por búsqueda
            if (filtroBusqueda.trim() !== '') {
                const busqueda = filtroBusqueda.toLowerCase();
                return (
                    bitacora.accion?.toLowerCase().includes(busqueda) ||
                    bitacora.descripcion?.toLowerCase().includes(busqueda)
                );
            }

            return true;
        });
    };

    // Función para formatear fechas
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'N/A';
        return new Date(fechaStr).toLocaleString();
    };

    if (loading) return <div className="loading">Cargando bitácoras...</div>;
    if (error) return <div className="error">{error}</div>;

    const bitacorasMostrar = bitacorasFiltradas();

    return (
        <div className="contenedor-padre" id="contenedor-padre">
            <div className="filtros-container container-widgets">
                <div className="filtros-header">
                    <h2>Mis Bitácoras</h2>
                    <div className="contador-resultados">
                        {bitacorasMostrar.length} {bitacorasMostrar.length === 1 ? 'resultado' : 'resultados'}
                    </div>
                </div>

                <div className="filtros-content">
                    <div className="filtro-grupo">
                        <label>Tipo de Acción:</label>
                        <select
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="recepcion">Recepción</option>
                            <option value="diagnostico">Diagnóstico</option>
                            <option value="reparacion">Reparación</option>
                            <option value="espera">Espera</option>
                            <option value="prueba">Prueba</option>
                            <option value="entrega">Entrega</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <label>Buscar:</label>
                        <input
                            type="text"
                            placeholder="Buscar en acción o descripción..."
                            value={filtroBusqueda}
                            onChange={(e) => setFiltroBusqueda(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container-widgets">
                {bitacorasMostrar.length > 0 ? (
                    <div className="bitacoras-timeline">
                        {bitacorasMostrar.map(bitacora => (
                            <div key={bitacora.id_bitacora} className="bitacora-item">
                                <div className="bitacora-time">
                                    <span className="fecha">{formatearFecha(bitacora.fecha_accion)}</span>
                                    {bitacora.duracion_minutos && (
                                        <span className="duracion">{bitacora.duracion_minutos} min</span>
                                    )}
                                </div>
                                <div className="bitacora-content">
                                    <div className="bitacora-header">
                                        <h4>{bitacora.accion}</h4>
                                        <span className={`tipo-accion tipo-${bitacora.tipo_accion}`}>{bitacora.tipo_accion}</span>
                                    </div>
                                    <p>{bitacora.descripcion}</p>
                                    <div className="bitacora-footer">
                                        <small>Reparación #{bitacora.id_reparacion}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-resultados">
                        <p>No se encontraron bitácoras que coincidan con los filtros.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TecnicoBitacoras;