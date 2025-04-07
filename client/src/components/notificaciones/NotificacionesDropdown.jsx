// client/src/components/notificaciones/NotificacionesDropdown.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Notificaciones.css';

function NotificacionesDropdown() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [contadorNoLeidas, setContadorNoLeidas] = useState(0);
    const dropdownRef = useRef(null);
    const ultimaActualizacionRef = useRef(0);
    const tecnicoIdRef = useRef(null);
    
    const usuario = JSON.parse(localStorage.getItem('usuario')) || null;
    
    // Cargar notificaciones solo cuando el componente se monta
    useEffect(() => {
        // Cerrar el dropdown cuando se hace clic fuera de él
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        
        // Carga inicial solo si hay usuario y si no se cargó antes
        if (usuario && ultimaActualizacionRef.current === 0) {
            cargarNotificaciones();
            
            // Si el usuario es técnico, obtenemos y almacenamos su ID de técnico para usarlo después
            if (usuario.rol === 'tecnico') {
                obtenerIdTecnico();
            }
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [usuario]);
    
    // Función para obtener el ID del técnico una sola vez
    const obtenerIdTecnico = async () => {
        try {
            // Primero verificamos si ya tenemos el ID en localStorage
            const tecnicoIdAlmacenado = localStorage.getItem(`tecnicoId_${usuario.id_usuarios}`);
            if (tecnicoIdAlmacenado) {
                tecnicoIdRef.current = parseInt(tecnicoIdAlmacenado);
                return;
            }
            
            // Si no tenemos el ID, lo solicitamos al servidor
            const responseTecnico = await axios.get(`http://localhost:8080/api/tecnicos/usuario/${usuario.id_usuarios}`);
            
            if (responseTecnico.data && responseTecnico.data.id_tecnico) {
                tecnicoIdRef.current = responseTecnico.data.id_tecnico;
                // Almacenamos en localStorage para futuros usos
                localStorage.setItem(`tecnicoId_${usuario.id_usuarios}`, responseTecnico.data.id_tecnico);
            }
        } catch (err) {
            console.error('Error al obtener ID del técnico:', err);
        }
    };
    
    const toggleDropdown = () => {
        const nuevoEstado = !showDropdown;
        setShowDropdown(nuevoEstado);
        
        // Solo cargar si estamos abriendo el dropdown y ha pasado suficiente tiempo (2 minutos)
        if (nuevoEstado) {
            const ahora = Date.now();
            if (ahora - ultimaActualizacionRef.current > 120000) { // 2 minutos
                cargarNotificaciones();
            }
        }
    };
    
    const cargarNotificaciones = async () => {
        if (!usuario || loading) return;
        
        try {
            setLoading(true);
            
            let endpoint = '';
            
            if (usuario.rol === 'tecnico') {
                // Usar el ID técnico almacenado si está disponible para evitar una petición extra
                if (tecnicoIdRef.current) {
                    endpoint = `/api/notificaciones/tecnico/${tecnicoIdRef.current}`;
                } else {
                    // Intentar obtener el ID del técnico primero
                    await obtenerIdTecnico();
                    
                    if (tecnicoIdRef.current) {
                        endpoint = `/api/notificaciones/tecnico/${tecnicoIdRef.current}`;
                    }
                }
            } else {
                endpoint = `/api/notificaciones/usuario/${usuario.id_usuarios}`;
            }
            
            if (endpoint) {
                const response = await axios.get(`http://localhost:8080${endpoint}`);
                setNotificaciones(response.data);
                
                // Contar notificaciones no leídas
                const noLeidas = response.data.filter(n => n.estado === 'pendiente').length;
                setContadorNoLeidas(noLeidas);
                
                // Actualizar timestamp de última actualización
                ultimaActualizacionRef.current = Date.now();
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
            setLoading(false);
        }
    };
    
    const marcarComoLeida = async (id) => {
        try {
            // Actualizar localmente primero (optimistic update)
            setNotificaciones(notificaciones.map(notif => 
                notif.id_notificacion === id ? { ...notif, estado: 'leida' } : notif
            ));
            
            // Actualizar contador
            setContadorNoLeidas(prev => Math.max(0, prev - 1));
            
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
        
        const fecha = new Date(fechaStr);
        const ahora = new Date();
        const diferencia = ahora - fecha;
        
        // Menos de 24 horas
        if (diferencia < 24 * 60 * 60 * 1000) {
            // Menos de una hora
            if (diferencia < 60 * 60 * 1000) {
                const minutos = Math.floor(diferencia / (60 * 1000));
                return `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
            }
            
            const horas = Math.floor(diferencia / (60 * 60 * 1000));
            return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
        }
        
        // Menos de una semana
        if (diferencia < 7 * 24 * 60 * 60 * 1000) {
            const dias = Math.floor(diferencia / (24 * 60 * 60 * 1000));
            return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
        }
        
        // Formato completo para fechas más antiguas
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
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
    
    if (!usuario) return null;
    
    return (
        <div className="notificaciones-container" ref={dropdownRef}>
            <div className="notificaciones-icon" onClick={toggleDropdown}>
                <i className="fas fa-bell"></i>
                {contadorNoLeidas > 0 && (
                    <span className="contador-notificaciones">{contadorNoLeidas}</span>
                )}
            </div>
            
            {showDropdown && (
                <div className="notificaciones-dropdown">
                    <div className="notificaciones-header">
                        <h3>Notificaciones</h3>
                        {contadorNoLeidas > 0 && (
                            <span className="contador-badge">{contadorNoLeidas} nuevas</span>
                        )}
                    </div>
                    
                    <div className="notificaciones-content">
                        {loading ? (
                            <div className="notificaciones-loading">Cargando...</div>
                        ) : notificaciones.length > 0 ? (
                            <ul className="notificaciones-lista">
                                {notificaciones.map(notificacion => (
                                    <li 
                                        key={notificacion.id_notificacion}
                                        className={`notificacion-item ${notificacion.estado === 'pendiente' ? 'no-leida' : ''}`}
                                        onClick={() => notificacion.estado === 'pendiente' && marcarComoLeida(notificacion.id_notificacion)}
                                    >
                                        <Link to={getURLNotificacion(notificacion)}>
                                            <div className="notificacion-icono">
                                                <i className={`fas ${getIconoTipo(notificacion.tipo)}`}></i>
                                            </div>
                                            <div className="notificacion-contenido">
                                                <div className="notificacion-titulo">{notificacion.titulo}</div>
                                                <div className="notificacion-mensaje">{notificacion.mensaje}</div>
                                                <div className="notificacion-tiempo">{formatearFecha(notificacion.fecha_envio)}</div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="notificaciones-vacio">No tienes notificaciones</div>
                        )}
                    </div>
                    
                    <div className="notificaciones-footer">
                        <Link to="/notificaciones" onClick={() => setShowDropdown(false)}>
                            Ver todas las notificaciones
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificacionesDropdown;