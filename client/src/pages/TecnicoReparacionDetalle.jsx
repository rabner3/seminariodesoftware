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

    useEffect(() => {
        setTitle("DETALLE DE REPARACIÓN");
        cargarDatos();
    }, [id, setTitle]);

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
            await axios.put(`http://localhost:8080/api/reparaciones/${id}`, {
                estado: nuevoEstado,
                fecha_actualizacion: new Date()
            });

            // Registrar bitácora del cambio de estado
            await axios.post('http://localhost:8080/api/bitacoras-reparacion', {
                id_reparacion: id,
                id_tecnico: reparacion.id_tecnico,
                tipo_accion: 'actualizacion',
                accion: 'Cambio de estado',
                descripcion: `Estado actualizado a: ${nuevoEstado}`,
                fecha_accion: new Date(),
                creado_por: JSON.parse(localStorage.getItem('usuario')).id_usuarios,
                fecha_creacion: new Date()
            });

            // Si es completada, actualizar fecha fin
            if (nuevoEstado === 'completada') {
                await axios.put(`http://localhost:8080/api/reparaciones/${id}`, {
                    estado: nuevoEstado,
                    fecha_fin: new Date()
                });
            }

            // Recargar datos
            cargarDatos();
        } catch (err) {
            setError(`Error al actualizar estado: ${err.message}`);
        }
    };

    const finalizarReparacion = async (formData) => {
        try {
            // Actualizar datos de finalización
            await axios.put(`http://localhost:8080/api/reparaciones/${id}`, {
                estado: 'completada',
                fecha_fin: new Date().toISOString().split('T')[0],
                costo_final: formData.costo_final,
                tiempo_total: formData.tiempo_total,
                observaciones: formData.observaciones
            });

            // Registrar bitácora
            await axios.post('http://localhost:8080/api/bitacoras-reparacion', {
                id_reparacion: id,
                id_tecnico: reparacion.id_tecnico,
                tipo_accion: 'finalizacion',
                accion: 'Reparación completada',
                descripcion: formData.observaciones,
                fecha_accion: new Date(),
                creado_por: JSON.parse(localStorage.getItem('usuario')).id_usuarios,
                fecha_creacion: new Date()
            });

            // Recargar datos
            cargarDatos();
        } catch (err) {
            setError(`Error al finalizar reparación: ${err.message}`);
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

    // Formatear fecha
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'No disponible';
        return new Date(fechaStr).toLocaleString();
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
                        {/* Mostrar botones según el estado actual */}
                        {reparacion.estado === 'pendiente' && (
                            <button
                                onClick={() => actualizarEstadoReparacion('diagnostico')}
                                className="button azul-claro"
                            >
                                Iniciar Diagnóstico
                            </button>
                        )}
                        {reparacion.estado === 'diagnostico' && (
                            <button
                                onClick={() => actualizarEstadoReparacion('en_reparacion')}
                                className="button azul-claro"
                            >
                                Iniciar Reparación
                            </button>
                        )}
                        {reparacion.estado === 'en_reparacion' && (
                            <button
                                onClick={() => actualizarEstadoReparacion('completada')}
                                className="button azul-claro"
                            >
                                Marcar como Completada
                            </button>
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
                        <p><strong>Costo Final:</strong> ${reparacion.costo_final || '0.00'}</p>
                        <p><strong>Tiempo Total:</strong> {reparacion.tiempo_total || '0'} minutos</p>
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
                            <button
                                onClick={() => setMostrarFormBitacora(true)}
                                className="button azul-claro"
                            >
                                Registrar Actividad
                            </button>
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
                                                        <button className="button rojo-suave">Eliminar</button>
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