// client/src/pages/TecnicoReparaciones.jsx
import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import '../assets/tecnicos.css';

function TecnicoReparaciones() {
    const { setTitle } = useContext(TitleContext);
    const [reparaciones, setReparaciones] = useState([]);
    const [reparacionesFiltradas, setReparacionesFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    const [orderBy, setOrderBy] = useState('fecha_recepcion');
    const [orderDir, setOrderDir] = useState('desc');

    useEffect(() => {
        setTitle("MIS REPARACIONES");
        cargarReparaciones();
    }, [setTitle]);

    useEffect(() => {
        aplicarFiltros();
    }, [reparaciones, filtroEstado, filtroBusqueda, orderBy, orderDir]);

    const cargarReparaciones = async () => {
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

            // Cargar reparaciones asignadas al técnico
            const responseReparaciones = await axios.get(`http://localhost:8080/api/reparaciones/tecnico/${responseTecnico.data.id_tecnico}`);
            setReparaciones(responseReparaciones.data);

            setLoading(false);
        } catch (err) {
            setError(`Error al cargar datos: ${err.message}`);
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let reparacionesTemp = [...reparaciones];

        // Filtrar por estado
        if (filtroEstado !== 'todos') {
            reparacionesTemp = reparacionesTemp.filter(r => r.estado === filtroEstado);
        }

        // Filtrar por búsqueda (en equipo, serie, descripción)
        if (filtroBusqueda) {
            const busqueda = filtroBusqueda.toLowerCase();
            reparacionesTemp = reparacionesTemp.filter(r => {
                return (
                    (r.tipo_equipo && r.tipo_equipo.toLowerCase().includes(busqueda)) ||
                    (r.marca_equipo && r.marca_equipo.toLowerCase().includes(busqueda)) ||
                    (r.modelo_equipo && r.modelo_equipo.toLowerCase().includes(busqueda)) ||
                    (r.serie_equipo && r.serie_equipo.toLowerCase().includes(busqueda)) ||
                    (r.observaciones && r.observaciones.toLowerCase().includes(busqueda))
                );
            });
        }

        // Ordenar resultados
        reparacionesTemp.sort((a, b) => {
            if (!a[orderBy]) return 1;
            if (!b[orderBy]) return -1;

            if (typeof a[orderBy] === 'string') {
                const comparacion = a[orderBy].localeCompare(b[orderBy]);
                return orderDir === 'asc' ? comparacion : -comparacion;
            } else {
                const comparacion = a[orderBy] < b[orderBy] ? -1 : 1;
                return orderDir === 'asc' ? comparacion : -comparacion;
            }
        });

        setReparacionesFiltradas(reparacionesTemp);
    };

    const cambiarOrden = (campo) => {
        if (orderBy === campo) {
            setOrderDir(orderDir === 'asc' ? 'desc' : 'asc');
        } else {
            setOrderBy(campo);
            setOrderDir('asc');
        }
    };

    // Función para formatear fechas
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'N/A';
        return new Date(fechaStr).toLocaleDateString();
    };

    // Función para calcular días en reparación
    const calcularDiasEnReparacion = (fechaInicio) => {
        if (!fechaInicio) return 'N/A';

        const inicio = new Date(fechaInicio);
        const hoy = new Date();
        const diferencia = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));

        return diferencia;
    };

    if (loading) return <div className="loading">Cargando reparaciones...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="contenedor-padre" id="contenedor-padre">
            <div className="filtros-container container-widgets">
                <div className="filtros-header">
                    <h2>Mis Reparaciones</h2>
                    <div className="contador-resultados">
                        {reparacionesFiltradas.length} {reparacionesFiltradas.length === 1 ? 'resultado' : 'resultados'}
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
                            <option value="pendiente">Pendiente</option>
                            <option value="diagnostico">Diagnóstico</option>
                            <option value="en_reparacion">En Reparación</option>
                            <option value="espera_repuestos">Espera de Repuestos</option>
                            <option value="completada">Completada</option>
                            <option value="descarte">Descarte</option>
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <label>Buscar:</label>
                        <input
                            type="text"
                            placeholder="Buscar por equipo, serie, descripción..."
                            value={filtroBusqueda}
                            onChange={(e) => setFiltroBusqueda(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="reparaciones-list container-widgets">
                {reparacionesFiltradas.length > 0 ? (
                    <div className="container-flow-table">
                        <table className="equipos-table">
                            <thead>
                                <tr>
                                    <th onClick={() => cambiarOrden('id_reparacion')}>
                                        ID {orderBy === 'id_reparacion' && (orderDir === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th>Equipo</th>
                                    <th onClick={() => cambiarOrden('estado')}>
                                        Estado {orderBy === 'estado' && (orderDir === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => cambiarOrden('fecha_recepcion')}>
                                        Recepción {orderBy === 'fecha_recepcion' && (orderDir === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th>Días</th>
                                    <th>Urgencia</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reparacionesFiltradas.map(reparacion => (
                                    <tr key={reparacion.id_reparacion}>
                                        <td>{reparacion.id_reparacion}</td>
                                        <td>
                                            <div className="equipo-info">
                                                <strong>{reparacion.tipo_equipo} {reparacion.marca_equipo}</strong>
                                                <div className="modelo-serie">
                                                    <span>{reparacion.modelo_equipo}</span>
                                                    {reparacion.serie_equipo && (
                                                        <span className="serie">S/N: {reparacion.serie_equipo}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`estado-badge estado-${reparacion.estado}`}>
                                                {reparacion.estado}
                                            </span>
                                        </td>
                                        <td>{formatearFecha(reparacion.fecha_recepcion)}</td>
                                        <td>
                                            {reparacion.estado !== 'completada' && reparacion.estado !== 'descarte' ? (
                                                calcularDiasEnReparacion(reparacion.fecha_recepcion)
                                            ) : (
                                                formatearFecha(reparacion.fecha_fin)
                                            )}
                                        </td>
                                        <td>
                                            {reparacion.urgencia ? (
                                                <span className={`urgencia-badge urgencia-${reparacion.urgencia}`}>
                                                    {reparacion.urgencia}
                                                </span>
                                            ) : (
                                                <span className="urgencia-badge urgencia-normal">Normal</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="botones-accion">
                                                <Link
                                                    to={`/tecnico/reparaciones/${reparacion.id_reparacion}`}
                                                    className="button azul-claro"
                                                >
                                                    Ver
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-resultados">
                        <p>No se encontraron reparaciones que coincidan con los filtros.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TecnicoReparaciones;