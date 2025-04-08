// client/src/pages/TecnicoReparacionDetalle.jsx
import { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import BitacoraForm from '../components/tecnicos/BitacoraForm';
import DiagnosticoForm from '../components/tecnicos/DiagnosticoForm';
import '../assets/tecnicos.css';

function TecnicoReparacionDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle } = useContext(TitleContext);
    const [reparacion, setReparacion] = useState(null);
    const [equipo, setEquipo] = useState(null);
    const [solicitud, setSolicitud] = useState(null);
    const [diagnostico, setDiagnostico] = useState(null);
    const [bitacoras, setBitacoras] = useState([]);
    const [partes, setPartes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('info');
    const [mostrarFormBitacora, setMostrarFormBitacora] = useState(false);
    const [mostrarFormDiagnostico, setMostrarFormDiagnostico] = useState(false);
    const [tiempoTotal, setTiempoTotal] = useState(0);
    const [mostrarOpcionesEstado, setMostrarOpcionesEstado] = useState(false);

    useEffect(() => {
        setTitle("DETALLE DE REPARACIÓN");
        cargarDatos();
    }, [id, setTitle]);

    useEffect(() => {
        // Calcular tiempo total cada vez que cambian las bitácoras
        if (bitacoras && bitacoras.length > 0) {
            const totalMinutos = bitacoras.reduce((total, bitacora) => {
                return total + (parseInt(bitacora.duracion_minutos) || 0);
            }, 0);
            setTiempoTotal(totalMinutos);
        }
    }, [bitacoras]);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            // Obtener datos de la reparación
            const responseReparacion = await axios.get(`http://localhost:8080/api/reparaciones/${id}`);
            setReparacion(responseReparacion.data);

            // Obtener datos del equipo
            const responseEquipo = await axios.get(`http://localhost:8080/api/equipos/${responseReparacion.data.id_equipo}`);
            setEquipo(responseEquipo.data);

            // Obtener datos de la solicitud (si existe)
            if (responseReparacion.data.id_solicitud) {
                const responseSolicitud = await axios.get(`http://localhost:8080/api/solicitudes/${responseReparacion.data.id_solicitud}`);
                setSolicitud(responseSolicitud.data);
            }

            // Obtener diagnóstico (si existe)
            try {
                const responseDiagnostico = await axios.get(`http://localhost:8080/api/diagnosticos/reparacion/${id}`);
                if (responseDiagnostico.data && responseDiagnostico.data.length > 0) {
                    setDiagnostico(responseDiagnostico.data[0]);
                }
            } catch (error) {
                console.log('No se encontró diagnóstico');
            }

            // Obtener bitácoras
            const responseBitacoras = await axios.get(`http://localhost:8080/api/bitacoras-reparacion?id_reparacion=${id}`);
            setBitacoras(responseBitacoras.data);

            // Obtener partes utilizadas
            const responsePartes = await axios.get(`http://localhost:8080/api/reparaciones-partes/reparacion/${id}`);
            setPartes(responsePartes.data);

            setLoading(false);
        } catch (err) {
            setError(`Error al cargar datos: ${err.message}`);
            setLoading(false);
        }
    };

    const actualizarEstadoReparacion = async (nuevoEstado) => {
        try {
            const dataToUpdate = {
                estado: nuevoEstado
            };

            // Si estamos completando la reparación, añadimos la fecha_fin y el tiempo_total
            if (nuevoEstado === 'completada' || nuevoEstado === 'descarte') {
                dataToUpdate.fecha_fin = new Date().toISOString().split('T')[0];
                dataToUpdate.tiempo_total = tiempoTotal; // Usar el tiempo total calculado de las bitácoras

                // Si es descarte, añadir una observación
                if (nuevoEstado === 'descarte') {
                    const observacionActual = reparacion.observaciones || '';
                    dataToUpdate.observaciones = observacionActual
                        ? `${observacionActual}\n[${new Date().toLocaleDateString()}] EQUIPO DESCARTADO.`
                        : `[${new Date().toLocaleDateString()}] EQUIPO DESCARTADO.`;
                }
            }

            // Si estamos iniciando la reparación y no tiene fecha de inicio, añadimos la fecha_inicio
            if (nuevoEstado === 'en_reparacion' && !reparacion.fecha_inicio) {
                dataToUpdate.fecha_inicio = new Date().toISOString().split('T')[0];
            }

            await axios.put(`http://localhost:8080/api/reparaciones/${id}`, dataToUpdate);

            // Si cambiamos a descarte, actualizar también el estado del equipo
            if (nuevoEstado === 'descarte') {
                try {
                    await axios.put(`http://localhost:8080/api/equipos/${reparacion.id_equipo}`, {
                        estado: 'descarte'
                    });
                } catch (equipoError) {
                    console.error("Error al actualizar estado del equipo:", equipoError);
                }
            }

            // Registrar bitácora del cambio de estado - asegurando que tipo_accion sea válido
            let tipoAccion = 'otro'; // Valor por defecto

            // Mapear estados a tipos de acción válidos
            if (nuevoEstado === 'diagnostico') tipoAccion = 'diagnostico';
            else if (nuevoEstado === 'en_reparacion') tipoAccion = 'reparacion';
            else if (nuevoEstado === 'completada') tipoAccion = 'entrega';
            else if (nuevoEstado === 'espera_repuestos') tipoAccion = 'espera';
            else if (nuevoEstado === 'descarte') tipoAccion = 'otro';

            // Formatear la fecha correctamente para MySQL
            const fechaActual = new Date();
            const fechaFormateada = fechaActual.toISOString().slice(0, 19).replace('T', ' ');

            await axios.post('http://localhost:8080/api/bitacoras-reparacion', {
                id_reparacion: id,
                id_tecnico: reparacion.id_tecnico,
                tipo_accion: tipoAccion,
                accion: 'Cambio de estado',
                descripcion: `Estado actualizado a: ${nuevoEstado}`,
                fecha_accion: fechaFormateada,
                creado_por: JSON.parse(localStorage.getItem('usuario')).id_usuarios,
                fecha_creacion: fechaFormateada
            });

            // Recargar datos
            cargarDatos();

            // Cerrar el menú de opciones
            setMostrarOpcionesEstado(false);
        } catch (err) {
            setError(`Error al actualizar estado: ${err.message}`);
        }
    };

    const handleBitacoraCreada = () => {
        setMostrarFormBitacora(false);
        cargarDatos();
    };

    const handleDiagnosticoCreado = () => {
        setMostrarFormDiagnostico(false);
        cargarDatos();
    };

    const eliminarParte = async (idParte) => {
        if (window.confirm('¿Está seguro de eliminar esta parte de la reparación?')) {
            try {
                await axios.delete(`http://localhost:8080/api/reparaciones-partes/${idParte}`);
                // Actualizar la lista de partes eliminando la parte borrada
                setPartes(partes.filter(parte => parte.id_reparacion_partes !== idParte));
            } catch (err) {
                setError(`Error al eliminar parte: ${err.message}`);
            }
        }
    };

    // Formatear fecha
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'No disponible';
        return new Date(fechaStr).toLocaleString();
    };

    // Formatear tiempo total en horas y minutos
    const formatearTiempoTotal = (minutos) => {
        if (!minutos || minutos === 0) return '0 minutos';
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;

        if (horas === 0) {
            return `${minutosRestantes} minutos`;
        } else if (minutosRestantes === 0) {
            return `${horas} hora${horas > 1 ? 's' : ''}`;
        } else {
            return `${horas} hora${horas > 1 ? 's' : ''} y ${minutosRestantes} minutos`;
        }
    };

    if (loading) return <div className="loading">Cargando datos...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!reparacion) return <div className="error">No se encontró la reparación</div>;

    return (
        <div className="contenedor-padre" id="contenedor-padre">
            {/* Cabecera con información principal */}
            <div className="reparacion-header container-widgets">
                <div className="header-content">
                    <div className="header-title">
                        <h2>Reparación #{reparacion.id_reparacion}</h2>
                        <span className={`estado-badge estado-${reparacion.estado}`}>
                            {reparacion.estado}
                        </span>
                    </div>
                    <div className="header-actions">
                        <button
                            onClick={() => navigate('/tecnico/reparaciones')}
                            className="button"
                        >
                            Volver
                        </button>

                        {/* Botón para mostrar opciones de cambio de estado */}
                        {reparacion.estado !== 'completada' && reparacion.estado !== 'descarte' && (
                            <button
                                onClick={() => setMostrarOpcionesEstado(!mostrarOpcionesEstado)}
                                className="button azul-claro"
                            >
                                Cambiar Estado
                            </button>
                        )}

                        {/* Panel desplegable con opciones de estados */}
                        {mostrarOpcionesEstado && (
                            <div className="estado-opciones">
                                {reparacion.estado !== 'pendiente' && (
                                    <button
                                        onClick={() => actualizarEstadoReparacion('pendiente')}
                                        className="button estado-btn"
                                    >
                                        Volver a Pendiente
                                    </button>
                                )}
                                {reparacion.estado !== 'diagnostico' && reparacion.estado !== 'pendiente' && (
                                    <button
                                        onClick={() => actualizarEstadoReparacion('diagnostico')}
                                        className="button estado-btn"
                                    >
                                        Volver a Diagnóstico
                                    </button>
                                )}
                                {reparacion.estado !== 'en_reparacion' && (
                                    <button
                                        onClick={() => actualizarEstadoReparacion('en_reparacion')}
                                        className="button estado-btn"
                                    >
                                        Pasar a Reparación
                                    </button>
                                )}
                                {reparacion.estado !== 'espera_repuestos' && (
                                    <button
                                        onClick={() => actualizarEstadoReparacion('espera_repuestos')}
                                        className="button estado-btn"
                                    >
                                        En Espera de Repuestos
                                    </button>
                                )}
                                {reparacion.estado !== 'completada' && (
                                    <button
                                        onClick={() => actualizarEstadoReparacion('completada')}
                                        className="button estado-btn estado-completada"
                                    >
                                        Marcar como Completada
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (window.confirm('¿Está seguro de descartar este equipo? Esta acción no se puede deshacer.')) {
                                            actualizarEstadoReparacion('descarte');
                                        }
                                    }}
                                    className="button estado-btn estado-descarte"
                                >
                                    Descartar Equipo
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="reparacion-info">
                    <div className="info-col">
                        <h3>Información del Equipo</h3>
                        <p><strong>Tipo:</strong> {equipo?.tipo || 'No disponible'}</p>
                        <p><strong>Marca/Modelo:</strong> {equipo ? `${equipo.marca} ${equipo.modelo}` : 'No disponible'}</p>
                        <p><strong>Serie:</strong> {equipo?.numero_serie || 'No disponible'}</p>
                    </div>
                    <div className="info-col">
                        <h3>Fechas</h3>
                        <p><strong>Recepción:</strong> {formatearFecha(reparacion.fecha_recepcion)}</p>
                        <p><strong>Inicio:</strong> {formatearFecha(reparacion.fecha_inicio)}</p>
                        <p><strong>Finalización:</strong> {formatearFecha(reparacion.fecha_fin)}</p>
                    </div>
                    <div className="info-col">
                        <h3>Detalles</h3>
                        <p><strong>Costo Estimado:</strong> ${reparacion.costo_estimado || '0.00'}</p>
                        <p><strong>Costo Final:</strong> ${reparacion.costo_estimado || '0.00'}</p>
                        <p><strong>Tiempo Total:</strong> {formatearTiempoTotal(tiempoTotal)}</p>
                    </div>
                </div>
            </div>

            {/* Pestañas de navegación */}
            <div className="tabs-container">
                <div className="tabs">
                    <button
                        className={activeTab === 'info' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('info')}
                    >
                        Información
                    </button>
                    <button
                        className={activeTab === 'diagnostico' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('diagnostico')}
                    >
                        Diagnóstico
                    </button>
                    <button
                        className={activeTab === 'bitacoras' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('bitacoras')}
                    >
                        Bitácoras
                    </button>
                    <button
                        className={activeTab === 'partes' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('partes')}
                    >
                        Partes
                    </button>
                </div>
            </div>

            {/* Contenido según la pestaña activa */}
            <div className="tab-content container-widgets">
                {activeTab === 'info' && (
                    <div className="tab-info">
                        <h3>Detalles de la Solicitud</h3>
                        {solicitud ? (
                            <div className="solicitud-info">
                                <p><strong>Solicitante:</strong> {solicitud.nombre_solicitante} {solicitud.apellido_solicitante}</p>
                                <p><strong>Fecha:</strong> {formatearFecha(solicitud.fecha_solicitud)}</p>
                                <p><strong>Urgencia:</strong> <span className={`urgencia-badge urgencia-${solicitud.urgencia}`}>{solicitud.urgencia}</span></p>
                                <div className="descripcion-box">
                                    <h4>Descripción del Problema:</h4>
                                    <p>{solicitud.descripcion}</p>
                                </div>
                            </div>
                        ) : (
                            <p>No hay información de solicitud disponible</p>
                        )}

                        <h3>Observaciones</h3>
                        <div className="observaciones-box">
                            <p>{reparacion.observaciones || 'No hay observaciones registradas'}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'diagnostico' && (
                    <div className="tab-diagnostico">
                        {!diagnostico && !mostrarFormDiagnostico ? (
                            <div className="no-diagnostico">
                                <p>No hay diagnóstico registrado para esta reparación.</p>
                                <button
                                    onClick={() => setMostrarFormDiagnostico(true)}
                                    className="button azul-claro"
                                >
                                    Crear Diagnóstico
                                </button>
                            </div>
                        ) : mostrarFormDiagnostico ? (
                            <DiagnosticoForm
                                reparacionId={reparacion.id_reparacion}
                                tecnicoId={reparacion.id_tecnico}
                                diagnosticoId={diagnostico?.id_diagnostico}
                                onDiagnosticoCreado={handleDiagnosticoCreado}
                                onCancel={() => setMostrarFormDiagnostico(false)}
                            />
                        ) : (
                            <div className="diagnostico-info">
                                <div className="diagnostico-header">
                                    <h3>Diagnóstico #{diagnostico.id_diagnostico}</h3>
                                    <p><strong>Fecha:</strong> {formatearFecha(diagnostico.fecha_diagnostico)}</p>
                                </div>

                                <div className="diagnostico-descripcion">
                                    <h4>Descripción:</h4>
                                    <p>{diagnostico.descripcion}</p>
                                </div>

                                <div className="diagnostico-causa">
                                    <h4>Causa Raíz:</h4>
                                    <p>{diagnostico.causa_raiz}</p>
                                </div>

                                <div className="diagnostico-solucion">
                                    <h4>Solución Propuesta:</h4>
                                    <p>{diagnostico.solucion_propuesta}</p>
                                </div>

                                <button
                                    onClick={() => setMostrarFormDiagnostico(true)}
                                    className="button azul-claro"
                                >
                                    Editar Diagnóstico
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'bitacoras' && (
                    <div className="tab-bitacoras">
                        <div className="bitacoras-header">
                            <h3>Registro de Actividades</h3>
                            <div className="bitacoras-info">
                                <span className="tiempo-total-badge">
                                    Tiempo Total: {formatearTiempoTotal(tiempoTotal)}
                                </span>
                                <button
                                    onClick={() => setMostrarFormBitacora(true)}
                                    className="button azul-claro"
                                >
                                    Registrar Actividad
                                </button>
                            </div>
                        </div>

                        {mostrarFormBitacora ? (
                            <BitacoraForm
                                reparacionId={reparacion.id_reparacion}
                                tecnicoId={reparacion.id_tecnico}
                                onBitacoraCreada={handleBitacoraCreada}
                                onCancel={() => setMostrarFormBitacora(false)}
                            />
                        ) : null}

                        {bitacoras.length > 0 ? (
                            <div className="bitacoras-timeline">
                                {bitacoras.map(bitacora => (
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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No hay actividades registradas</p>
                        )}
                    </div>
                )}

                {activeTab === 'partes' && (
                    <div className="tab-partes">
                        <div className="partes-header">
                            <h3>Partes Utilizadas</h3>
                            <button
                                onClick={() => navigate(`/tecnico/reparaciones/${id}/partes/nueva`)}
                                className="button azul-claro"
                            >
                                Agregar Parte
                            </button>
                        </div>

                        {partes.length > 0 ? (
                            <div className="container-flow-table">
                                <table className="equipos-table">
                                    <thead>
                                        <tr>
                                            <th>Parte</th>
                                            <th>Cantidad</th>
                                            <th>Costo Unitario</th>
                                            <th>Costo Total</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {partes.map(parte => (
                                            <tr key={parte.id_reparacion_partes}>
                                                <td>{parte.nombre_parte}</td>
                                                <td>{parte.cantidad}</td>
                                                <td>${parte.costo_unitario}</td>
                                                <td>${(parte.cantidad * parte.costo_unitario).toFixed(2)}</td>
                                                <td>
                                                    <div className="botones-accion">
                                                        <button
                                                            className="button rojo-suave"
                                                            onClick={() => eliminarParte(parte.id_reparacion_partes)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="3"><strong>Total:</strong></td>
                                            <td>
                                                <strong>
                                                    ${partes.reduce((total, parte) => {
                                                        return total + (parte.cantidad * parte.costo_unitario);
                                                    }, 0).toFixed(2)}
                                                </strong>
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <p>No hay partes registradas para esta reparación</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TecnicoReparacionDetalle;