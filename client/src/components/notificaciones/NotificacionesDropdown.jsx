
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
    
    
    useEffect(() => {
        
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        
        
        if (usuario && ultimaActualizacionRef.current === 0) {
            cargarNotificaciones();
            
            
            if (usuario.rol === 'tecnico') {
                obtenerIdTecnico();
            }
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [usuario]);
    
    
    const obtenerIdTecnico = async () => {
        try {
            
            const tecnicoIdAlmacenado = localStorage.getItem(`tecnicoId_${usuario.id_usuarios}`);
            if (tecnicoIdAlmacenado) {
                tecnicoIdRef.current = parseInt(tecnicoIdAlmacenado);
                return;
            }
            
            
            const responseTecnico = await axios.get(`http://localhost:8080/api/tecnicos/usuario/${usuario.id_usuarios}`);
            
            if (responseTecnico.data && responseTecnico.data.id_tecnico) {
                tecnicoIdRef.current = responseTecnico.data.id_tecnico;
                
                localStorage.setItem(`tecnicoId_${usuario.id_usuarios}`, responseTecnico.data.id_tecnico);
            }
        } catch (err) {
            console.error('Error al obtener ID del técnico:', err);
        }
    };
    
    const toggleDropdown = () => {
        const nuevoEstado = !showDropdown;
        setShowDropdown(nuevoEstado);
        
        
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
                
                if (tecnicoIdRef.current) {
                    endpoint = `/api/notificaciones/tecnico/${tecnicoIdRef.current}`;
                } else {
                    
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
                
                
                const noLeidas = response.data.filter(n => n.estado === 'pendiente').length;
                setContadorNoLeidas(noLeidas);
                
                
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
            
            setNotificaciones(notificaciones.map(notif => 
                notif.id_notificacion === id ? { ...notif, estado: 'leida' } : notif
            ));
            
            
            setContadorNoLeidas(prev => Math.max(0, prev - 1));
            
            
            await axios.put(`http://localhost:8080/api/notificaciones/leer/${id}`);
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            
            cargarNotificaciones();
        }
    };
    
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return '';
        
        const fecha = new Date(fechaStr);
        const ahora = new Date();
        const diferencia = ahora - fecha;
        
        
        if (diferencia < 24 * 60 * 60 * 1000) {
            
            if (diferencia < 60 * 60 * 1000) {
                const minutos = Math.floor(diferencia / (60 * 1000));
                return `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
            }
            
            const horas = Math.floor(diferencia / (60 * 60 * 1000));
            return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
        }
        
        
        if (diferencia < 7 * 24 * 60 * 60 * 1000) {
            const dias = Math.floor(diferencia / (24 * 60 * 60 * 1000));
            return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
        }
        
        
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
