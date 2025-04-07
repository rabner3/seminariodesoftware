// client/src/pages/Solicitudes.jsx
import { useEffect, useContext, useState } from 'react';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import SolicitudForm from '../components/solicitudes/SolicitudForm';
import SolicitudDetalle from '../components/solicitudes/SolicitudDetalle';
import '../assets/solicitudes.css';

function Solicitudes() {
    const { setTitle } = useContext(TitleContext);
    const [vista, setVista] = useState('lista');
    const [solicitudes, setSolicitudes] = useState([]);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('todas');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        setTitle("SOLICITUDES DE REPARACIÓN");
        cargarSolicitudes();
    }, [setTitle]);

    const cargarSolicitudes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/solicitudes');
            setSolicitudes(response.data);
            setLoading(false);
        } catch (err) {
            setError(`Error al cargar solicitudes: ${err.message}`);
            setLoading(false);
        }
    };

    const handleNuevaSolicitud = () => {
        setSolicitudSeleccionada(null);
        setVista('form');
    };

    const handleVerSolicitud = (id) => {
        setSolicitudSeleccionada(id);
        setVista('detalle');
    };

    const handleGuardarSolicitud = () => {
        cargarSolicitudes();
        setVista('lista');
    };

    const handleVolverLista = () => {
        setVista('lista');
        setSolicitudSeleccionada(null);
    };

    const filtrarSolicitudes = () => {
        if (!solicitudes) return [];

        let solicitudesFiltradas = [...solicitudes];

        // Aplicar filtro por estado
        if (filtro !== 'todas') {
            solicitudesFiltradas = solicitudesFiltradas.filter(sol => sol.estado === filtro);
        }

        // Aplicar búsqueda
        if (busqueda.trim() !== '') {
            const terminoBusqueda = busqueda.toLowerCase();
            solicitudesFiltradas = solicitudesFiltradas.filter(sol =>
                sol.descripcion?.toLowerCase().includes(terminoBusqueda) ||
                sol.tipo?.toLowerCase().includes(terminoBusqueda)
            );
        }

        return solicitudesFiltradas;
    };

    // Renderizado condicional
    if (vista === 'form') {
        return (
            <div className="contenedor-padre">
                <SolicitudForm
                    onSave={handleGuardarSolicitud}
                    onCancel={handleVolverLista}
                />
            </div>
        );
    }

    if (vista === 'detalle' && solicitudSeleccionada) {
        return (
            <div className="contenedor-padre">
                <SolicitudDetalle
                    id={solicitudSeleccionada}
                    onClose={handleVolverLista}
                    onRefresh={cargarSolicitudes}
                />
            </div>
        );
    }

    // Vista de lista (default)
    const solicitudesFiltradas = filtrarSolicitudes();

    return (
        <div className="contenedor-padre">
            <div className="container-widgets">
                <div className="container-botones">
                    <button className="button azul-claro" onClick={handleNuevaSolicitud}>
                        Nueva Solicitud
                    </button>
                </div>

                <div className="filtros-container">
                    <div className="filtro-grupo">
                        <label>Estado:</label>
                        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                            <option value="todas">Todas</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="asignada">Asignadas</option>
                            <option value="en_proceso">En Proceso</option>
                            <option value="resuelta">Resueltas</option>
                            <option value="cancelada">Canceladas</option>
                        </select>
                    </div>
                    <div className="filtro-grupo">
                        <label>Buscar:</label>
                        <input
                            type="text"
                            placeholder="Buscar en descripciones..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <p>Cargando solicitudes...</p>
                ) : error ? (
                    <div className="errors">{error}</div>
                ) : (
                    <div className="container-flow-table">
                        <table className="solicitudes-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Usuario</th>
                                    <th>Fecha</th>
                                    <th>Urgencia</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesFiltradas.length > 0 ? (
                                    solicitudesFiltradas.map(solicitud => (
                                        <tr key={solicitud.id_solicitud}>
                                            <td>{solicitud.id_solicitud}</td>
                                            <td>{solicitud.tipo}</td>
                                            <td>
                                                {solicitud.nombre_usuario && solicitud.apellido_usuario
                                                    ? `${solicitud.nombre_usuario} ${solicitud.apellido_usuario}`
                                                    : 'No asignado'}
                                            </td>
                                            <td>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`urgencia-badge urgencia-${solicitud.urgencia}`}>
                                                    {solicitud.urgencia}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`estado-badge estado-${solicitud.estado}`}>
                                                    {solicitud.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="botones-accion">
                                                    <button
                                                        className="button azul-claro"
                                                        onClick={() => handleVerSolicitud(solicitud.id_solicitud)}
                                                    >
                                                        Ver
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="no-resultados">
                                            No se encontraron solicitudes
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Solicitudes;