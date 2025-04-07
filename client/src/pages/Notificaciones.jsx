// client/src/pages/Notificaciones.jsx (corregido)
import { useEffect, useContext, useState, useRef } from 'react';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import '../assets/notificaciones.css';

function Notificaciones() {
    const { setTitle } = useContext(TitleContext);
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('todas');
    const tecnicoIdRef = useRef(null);
    
    const usuario = JSON.parse(localStorage.getItem('usuario')) || null;
    
    useEffect(() => {
        setTitle("MIS NOTIFICACIONES");
        
        // Solo cargar una vez cuando el componente se monta
        if (usuario) {
            // Si el usuario es técnico, primero obtener su ID de técnico
            if (usuario.rol === 'tecnico') {
                obtenerIdTecnico().then(() => {
                    cargarNotificaciones();
                });
            } else {
                cargarNotificaciones();
            }
        }
        
        // Sin dependencias para que solo se ejecute al montar
    }, []);
    
    // Función para obtener el ID del técnico (solo la primera vez)
    const obtenerIdTecnico = async () => {
        try {
            // Verificar si ya tenemos el ID en localStorage
            const tecnicoIdAlmacenado = localStorage.getItem(`tecnicoId_${usuario.id_usuarios}`);
            if (tecnicoIdAlmacenado) {
                tecnicoIdRef.current = parseInt(tecnicoIdAlmacenado);
                return;
            }
            
            // Si no, solicitarlo al servidor
            const responseTecnico = await axios.get(`http://localhost:8080/api/tecnicos/usuario/${usuario.id_usuarios}`);
            
            if (responseTecnico.data && responseTecnico.data.id_tecnico) {
                tecnicoIdRef.current = responseTecnico.data.id_tecnico;
                // Almacenar para uso futuro
                localStorage.setItem(`tecnicoId_${usuario.id_usuarios}`, responseTecnico.data.id_tecnico);
            }
        } catch (err) {
            console.error('Error al obtener ID del técnico:', err);
        }
    };
    
    const cargarNotificaciones = async () => {
        if (!usuario) return;
        
        try {
            setLoading(true);
            setError(null);
            
            let endpoint = '';
            
            if (usuario.rol === 'tecnico' && tecnicoIdRef.current) {
                endpoint = `/api/notificaciones/tecnico/${tecnicoIdRef.current}`;
            } else if (usuario.rol === 'tecnico') {
                // Si no tenemos el ID del técnico pero sabemos que es un técnico
                try {
                    const responseTecnico = await axios.get(`http://localhost:8080/api/tecnicos/usuario/${usuario.id_usuarios}`);
                    
                    if (responseTecnico.data && responseTecnico.data.id_tecnico) {
                        tecnicoIdRef.current = responseTecnico.data.id_tecnico;
                        localStorage.setItem(`tecnicoId_${usuario.id_usuarios}`, responseTecnico.data.id_tecnico);
                        endpoint = `/api/notificaciones/tecnico/${responseTecnico.data.id_tecnico}`;
                    }
                } catch (err) {
                    console.error('Error al obtener info del técnico:', err);
                    setError('No se pudo obtener información del técnico.');
                    setLoading(false);
                    return;
                }
            } else {
                endpoint = `/api/notificaciones/usuario/${usuario.id_usuarios}`;
            }
            
            if (endpoint) {
                const response = await axios.get(`http://localhost:8080${endpoint}`);
                setNotificaciones(response.data);
            }
            
            setLoading(false);
        } catch (err) {
            setError(`Error al cargar notificaciones: ${err.message}`);
            setLoading(false);
        }
    };
    
    const marcarComoLeida = async (id) => {
        try {
            // Actualizar localmente primero (optimistic update)
            setNotificaciones(notificaciones.map(notif => 
                notif.id_notificacion === id ? { ...notif, estado: 'leida' } : notif
            ));
            
            // Luego actualizar en el servidor
            await axios.put(`http://localhost:8080/api/notificaciones/leer/${id}`);
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            // Revertir cambios locales en caso de error
            cargarNotificaciones();
        }
    };
    
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return '';
        
        return new Date(fechaStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    const filtrarNotificaciones = () => {
        if (filtro === 'todas') {
            return notificaciones;
        }
        
        return notificaciones.filter(n => n.estado === filtro);
    };
    
    const getIconoTipo = (tipo) => {
        switch (tipo) {
            case 'solicitud':
                return 'fa-clipboard-list';
            case 'reparacion':
                return 'fa-tools';
            case 'asignacion':
                return 'fa-user-check';
            case 'sistema':
                return 'fa-cog';
            case 'alerta':
                return 'fa-exclamation-triangle';
            default:
                return 'fa-bell';
        }
    };
    
    const getURLNotificacion = (notificacion) => {
        switch (notificacion.tipo) {
            case 'solicitud':
                return `/solicitudes/${notificacion.id_referencia}`;
            case 'reparacion':
                return `/tecnico/reparaciones/${notificacion.id_referencia}`;
            case 'asignacion':
                return `/equipos/detalle/${notificacion.id_referencia}`;
            default:
                return '#';
        }
    };
    
    if (!usuario) {
        return (
            <div className="contenedor-padre">
                <div className="container-widgets">
                    <p>Debes iniciar sesión para ver tus notificaciones.</p>
                </div>
            </div>
        );
    }
    
    const notificacionesFiltradas = filtrarNotificaciones();
    
    return (
        <div className="contenedor-padre">
            <div className="container-widgets">
                <div className="filtros-container">
                    <div className="filtro-grupo">
                        <label>Estado:</label>
                        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                            <option value="todas">Todas</option>
                            <option value="pendiente">No leídas</option>
                            <option value="leida">Leídas</option>
                        </select>
                    </div>
                </div>
                
                {loading ? (
                    <p>Cargando notificaciones...</p>
                ) : error ? (
                    <div className="errors">{error}</div>
                ) : (
                    <div className="notificaciones-lista-completa">
                        {notificacionesFiltradas.length > 0 ? (
                            notificacionesFiltradas.map(notificacion => (
                                <div 
                                    key={notificacion.id_notificacion}
                                    className={`notificacion-card ${notificacion.estado === 'pendiente' ? 'no-leida' : ''}`}
                                    onClick={() => notificacion.estado === 'pendiente' && marcarComoLeida(notificacion.id_notificacion)}
                                >
                                    <div className="notificacion-card-icono">
                                        <i className={`fas ${getIconoTipo(notificacion.tipo)}`}></i>
                                    </div>
                                    <div className="notificacion-card-contenido">
                                        <h3 className="notificacion-card-titulo">{notificacion.titulo}</h3>
                                        <p className="notificacion-card-mensaje">{notificacion.mensaje}</p>
                                        <div className="notificacion-card-footer">
                                            <span className="notificacion-card-fecha">{formatearFecha(notificacion.fecha_envio)}</span>
                                            <a href={getURLNotificacion(notificacion)} className="notificacion-card-link">
                                                Ver detalles
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="notificaciones-vacio">
                                <i className="fas fa-bell-slash"></i>
                                <p>No tienes notificaciones {filtro !== 'todas' ? `${filtro === 'pendiente' ? 'no leídas' : 'leídas'}` : ''}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Notificaciones;