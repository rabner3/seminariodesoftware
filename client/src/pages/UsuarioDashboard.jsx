// client/src/pages/UsuarioDashboard.jsx
import { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';

function UsuarioDashboard() {
    const { setTitle } = useContext(TitleContext);
    const navigate = useNavigate();
    const [equiposAsignados, setEquiposAsignados] = useState([]);
    const [solicitudesActivas, setSolicitudesActivas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        setTitle("MI PANEL");
        const usuarioData = JSON.parse(localStorage.getItem('usuario'));
        setUsuario(usuarioData);

        if (usuarioData && usuarioData.id_usuarios) {
            cargarDatos(usuarioData.id_usuarios);
        } else {
            setError("No se encontró información del usuario");
            setLoading(false);
        }
    }, [setTitle]);

    const cargarDatos = async (userId) => {
        try {
            setLoading(true);

            // Cargar equipos asignados al usuario - solo asignaciones activas
            try {
                const responseAsignaciones = await axios.get(`http://localhost:8080/api/asignaciones?id_usuario=${userId}&estado=activa`);

                // Para cada asignación, obtener los detalles del equipo
                const equiposPromises = responseAsignaciones.data.map(async (asignacion) => {
                    if (asignacion.id_equipo) {
                        try {
                            const equipoResponse = await axios.get(`http://localhost:8080/api/equipos/${asignacion.id_equipo}`);
                            // Solo agregar si el equipo está en estado activo (asignado o disponible)
                            if (['disponible', 'asignado'].includes(equipoResponse.data.estado)) {
                                return {
                                    ...equipoResponse.data,
                                    fecha_asignacion: asignacion.fecha_asignacion,
                                    id_asignacion: asignacion.id_asignacion
                                };
                            }
                        } catch (err) {
                            console.error(`Error al cargar equipo ${asignacion.id_equipo}:`, err);
                        }
                    }
                    return null;
                });

                const equipos = await Promise.all(equiposPromises);
                
                // Filtrar nulos y eliminar duplicados por id_equipo
                const equiposFiltrados = equipos.filter(equipo => equipo !== null);
                const equiposUnicos = [];
                const idsEquipos = new Set();
                
                for (const equipo of equiposFiltrados) {
                    if (!idsEquipos.has(equipo.id_equipo)) {
                        idsEquipos.add(equipo.id_equipo);
                        equiposUnicos.push(equipo);
                    }
                }
                
                setEquiposAsignados(equiposUnicos);
            } catch (err) {
                console.error("Error al cargar asignaciones:", err);
                setEquiposAsignados([]);
            }

            // Cargar solicitudes del usuario - solo las activas
            try {
                const responseSolicitudes = await axios.get(`http://localhost:8080/api/solicitudes/usuario/${userId}`);
                // Filtrar solo las solicitudes activas (pendientes, asignadas, en_proceso)
                const solicitudesActivas = responseSolicitudes.data.filter(
                    solicitud => ['pendiente', 'asignada', 'en_proceso'].includes(solicitud.estado)
                );
                setSolicitudesActivas(solicitudesActivas);
            } catch (err) {
                console.error("Error al cargar solicitudes:", err);
                setSolicitudesActivas([]);
            }

            setLoading(false);
        } catch (err) {
            setError(`Error general al cargar datos: ${err.message}`);
            setLoading(false);
        }
    };

    // Función para ver detalle de solicitud
    const verDetalleSolicitud = (id) => {
        // Guardar ID de solicitud en localStorage
        localStorage.setItem('solicitudSeleccionada', id);
        // Navegar a la página de solicitudes
        navigate('/solicitudes');
    };

    // Función para formatear fechas
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'No disponible';
        return new Date(fechaStr).toLocaleDateString();
    };

    if (loading) return <div className="loading">Cargando tu información...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="contenedor-padre" id="contenedor-padre">
            {/* Tarjeta de bienvenida */}
            <div className="container-widgets">
                <h2>Bienvenido, {usuario?.nombre || 'Usuario'}</h2>
                <p>Desde aquí puedes gestionar tus equipos asignados y solicitudes de soporte técnico.</p>
            </div>

            {/* Sección de equipos asignados */}
            <div className="container-widgets">
                <div className="seccion-header">
                    <h3>Mis Equipos Asignados ({equiposAsignados.length})</h3>
                </div>

                {equiposAsignados.length > 0 ? (
                    <div className="container-flow-table">
                        <table className="equipos-table">
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Marca/Modelo</th>
                                    <th>Serie</th>
                                    <th>Fecha Asignación</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equiposAsignados.map(equipo => (
                                    <tr key={equipo.id_equipo}>
                                        <td>{equipo.tipo}</td>
                                        <td>{equipo.marca} {equipo.modelo}</td>
                                        <td>{equipo.numero_serie}</td>
                                        <td>{formatearFecha(equipo.fecha_asignacion)}</td>
                                        <td>
                                            <span className={`estado-badge estado-${equipo.estado}`}>
                                                {equipo.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="botones-accion">
                                                <Link to={`/equipos/detalle/${equipo.id_equipo}`} className="button azul-claro">
                                                    Ver Detalles
                                                </Link>
                                                <Link to={`/solicitudes/nueva/${equipo.id_equipo}`} className="button">
                                                    Solicitar Soporte
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-data-message">
                        <p>No tienes equipos asignados actualmente.</p>
                    </div>
                )}
            </div>

            {/* Sección de solicitudes activas */}
            <div className="container-widgets">
                <div className="seccion-header">
                    <h3>Mis Solicitudes Activas ({solicitudesActivas.length})</h3>
                    <Link to="/solicitudes/nueva" className="button azul-claro">
                        Nueva Solicitud
                    </Link>
                </div>

                {solicitudesActivas.length > 0 ? (
                    <div className="container-flow-table">
                        <table className="solicitudes-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Equipo</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Urgencia</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesActivas.map(solicitud => (
                                    <tr key={solicitud.id_solicitud}>
                                        <td>{solicitud.id_solicitud}</td>
                                        <td>{solicitud.tipo}</td>
                                        <td>{solicitud.tipo_equipo} {solicitud.marca_equipo}</td>
                                        <td>{formatearFecha(solicitud.fecha_solicitud)}</td>
                                        <td>
                                            <span className={`estado-badge estado-${solicitud.estado}`}>
                                                {solicitud.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`urgencia-badge urgencia-${solicitud.urgencia}`}>
                                                {solicitud.urgencia}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="botones-accion">
                                                <button
                                                    onClick={() => verDetalleSolicitud(solicitud.id_solicitud)}
                                                    className="button azul-claro"
                                                >
                                                    Ver Detalles
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-data-message">
                        <p>No tienes solicitudes activas actualmente.</p>
                        <Link to="/solicitudes/nueva" className="button azul-claro">
                            Crear Solicitud
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UsuarioDashboard;