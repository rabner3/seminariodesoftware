// client/src/components/solicitudes/SolicitudDetalle.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function SolicitudDetalle({ id, onClose, onRefresh }) {
    const [solicitud, setSolicitud] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comentarioCierre, setComentarioCierre] = useState('');
    const [mostrarFormCierre, setMostrarFormCierre] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState(null);

    useEffect(() => {
        // Obtener usuario actual del localStorage
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario) {
            setUsuarioActual(usuario);
        }

        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            // Cargar datos de la solicitud (que ahora incluye info de usuario y equipo)
            const responseSolicitud = await axios.get(`http://localhost:8080/api/solicitudes/${id}`);
            setSolicitud(responseSolicitud.data);

            setLoading(false);
        } catch (err) {
            setError(`Error al cargar datos: ${err.message}`);
            setLoading(false);
        }
    };

    const handleCancelarSolicitud = async () => {
        if (!window.confirm('¿Está seguro de cancelar esta solicitud?')) {
            return;
        }

        try {
            setMostrarFormCierre(true);
        } catch (err) {
            setError(`Error al procesar la cancelación: ${err.message}`);
        }
    };

    const handleGuardarComentarioCierre = async () => {
        try {
            if (!comentarioCierre.trim()) {
                alert('Por favor ingrese un comentario para la cancelación');
                return;
            }

            await axios.put(`http://localhost:8080/api/solicitudes/${id}`, {
                estado: 'cancelada',
                fecha_cierre: new Date().toISOString(),
                comentario_cierre: comentarioCierre
            });

            setMostrarFormCierre(false);
            cargarDatos();

            if (onRefresh) {
                onRefresh(); // Actualizar listado de solicitudes si es necesario
            }
        } catch (err) {
            setError(`Error al guardar comentario: ${err.message}`);
        }
    };

    const handleAsignarReparacion = async () => {
        try {
            if (!window.confirm('¿Desea crear una reparación para esta solicitud?')) {
                return;
            }

            // Primero actualizar estado de solicitud
            await axios.put(`http://localhost:8080/api/solicitudes/${id}`, {
                estado: 'asignada',
            });

            // Crear nueva reparación
            const reparacionData = {
                id_solicitud: id,
                id_equipo: solicitud.id_equipo,
                fecha_recepcion: new Date().toISOString(),
                estado: 'pendiente',
                creado_por: usuarioActual.id_usuarios,
                fecha_creacion: new Date().toISOString()
            };

            const responseReparacion = await axios.post('http://localhost:8080/api/reparaciones', reparacionData);

            alert(`Reparación creada con ID: ${responseReparacion.data.id_reparacion}`);

            cargarDatos();
            if (onRefresh) {
                onRefresh();
            }
        } catch (err) {
            setError(`Error al crear reparación: ${err.message}`);
        }
    };

    const handleMarcarResuelta = async () => {
        try {
            if (!window.confirm('¿Desea marcar esta solicitud como resuelta?')) {
                return;
            }

            await axios.put(`http://localhost:8080/api/solicitudes/${id}`, {
                estado: 'resuelta',
                fecha_cierre: new Date().toISOString(),
                comentario_cierre: 'Solicitud atendida y resuelta'
            });

            cargarDatos();
            if (onRefresh) {
                onRefresh();
            }
        } catch (err) {
            setError(`Error al actualizar solicitud: ${err.message}`);
        }
    };

    // Función para formatear fechas
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'No disponible';
        return new Date(fechaStr).toLocaleString();
    };

    // Función para verificar si el usuario actual es el dueño de la solicitud
    const esSolicitudDelUsuario = () => {
        return usuarioActual && solicitud && usuarioActual.id_usuarios === solicitud.id_usuario;
    };

    // Función para verificar si el usuario es admin o técnico
    const esAdminOTecnico = () => {
        return usuarioActual && (usuarioActual.rol === 'admin' || usuarioActual.rol === 'tecnico');
    };

    if (loading) return <div className="loading">Cargando datos...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!solicitud) return <div className="error">No se encontró la solicitud</div>;

    return (
        <div className="container-widgets solicitud-detalle-container">
            <div className="header-content">
                <div className="header-title">
                    <h2>Solicitud #{solicitud.id_solicitud}</h2>
                    <span className={`estado-badge estado-${solicitud.estado}`}>
                        {solicitud.estado}
                    </span>
                </div>
                <div className="header-actions">
                    <button onClick={onClose} className="button">
                        Volver
                    </button>

                    {/* Mostrar botón de cancelar solo si la solicitud está pendiente y es del usuario actual */}
                    {solicitud.estado === 'pendiente' && esSolicitudDelUsuario() && (
                        <button onClick={handleCancelarSolicitud} className="button rojo-suave">
                            Cancelar Solicitud
                        </button>
                    )}

                    {/* Botones para administrador/técnico */}
                    {esAdminOTecnico() && solicitud.estado === 'pendiente' && (
                        <button onClick={handleAsignarReparacion} className="button azul-claro">
                            Crear Reparación
                        </button>
                    )}

                    {esAdminOTecnico() && solicitud.estado === 'asignada' && (
                        <button onClick={handleMarcarResuelta} className="button azul-claro">
                            Marcar como Resuelta
                        </button>
                    )}
                </div>
            </div>

            <div className="solicitud-info">
                <div className="info-col">
                    <h3>Información General</h3>
                    <p><strong>Tipo:</strong> {solicitud.tipo}</p>
                    <p><strong>Fecha de Solicitud:</strong> {formatearFecha(solicitud.fecha_solicitud)}</p>
                    <p>
                        <strong>Urgencia:</strong>
                        <span className={`urgencia-badge urgencia-${solicitud.urgencia}`}>
                            {solicitud.urgencia}
                        </span>
                    </p>
                    <p><strong>Estado:</strong> {solicitud.estado}</p>
                </div>

                <div className="info-col">
                    <h3>Solicitante</h3>
                    {solicitud.nombre_usuario ? (
                        <>
                            <p><strong>Nombre:</strong> {solicitud.nombre_usuario} {solicitud.apellido_usuario}</p>
                            <p><strong>Email:</strong> {solicitud.email_usuario}</p>
                            <p><strong>Puesto:</strong> {solicitud.puesto_usuario || 'No especificado'}</p>
                        </>
                    ) : (
                        <p>Información del usuario no disponible</p>
                    )}
                </div>

                <div className="info-col">
                    <h3>Equipo</h3>
                    {solicitud.tipo_equipo ? (
                        <>
                            <p><strong>Tipo:</strong> {solicitud.tipo_equipo}</p>
                            <p><strong>Marca/Modelo:</strong> {solicitud.marca_equipo} {solicitud.modelo_equipo}</p>
                            <p><strong>Serie:</strong> {solicitud.serie_equipo}</p>
                        </>
                    ) : (
                        <p>Información del equipo no disponible</p>
                    )}
                </div>
            </div>

            <div className="descripcion-box">
                <h3>Descripción del Problema</h3>
                <p>{solicitud.descripcion}</p>
            </div>

            {/* Mostrar información de cierre si ya está cerrada */}
            {(solicitud.estado === 'resuelta' || solicitud.estado === 'cancelada') && (
                <div className="cierre-box">
                    <h3>Comentario de Cierre</h3>
                    <p>{solicitud.comentario_cierre || 'No hay comentarios de cierre'}</p>
                    <p><strong>Fecha de Cierre:</strong> {formatearFecha(solicitud.fecha_cierre)}</p>
                </div>
            )}

            {/* Formulario para comentario de cierre al cancelar */}
            {mostrarFormCierre && (
                <div className="form-cierre">
                    <h3>Comentario de Cancelación</h3>
                    <textarea
                        value={comentarioCierre}
                        onChange={(e) => setComentarioCierre(e.target.value)}
                        rows="3"
                        placeholder="Indique el motivo de la cancelación"
                        className="form-textarea"
                    ></textarea>
                    <div className="container-botones">
                        <button onClick={handleGuardarComentarioCierre} className="button azul-claro">
                            Guardar y Cancelar Solicitud
                        </button>
                        <button onClick={() => setMostrarFormCierre(false)} className="button">
                            Volver
                        </button>
                    </div>
                </div>
            )}

            {/* Sección para mostrar la reparación asociada si existe */}
            {solicitud.id_reparacion && (
                <div className="reparacion-asociada">
                    <h3>Reparación Asociada</h3>
                    <p>
                        <strong>ID de Reparación:</strong> {solicitud.id_reparacion}
                        <button className="button azul-claro ml-3" onClick={() => {
                            // Navegar a la página de detalle de reparación
                            window.location.href = `/tecnico/reparaciones/${solicitud.id_reparacion}`;
                        }}>
                            Ver Reparación
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
}

export default SolicitudDetalle;