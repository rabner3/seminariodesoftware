
import { useState, useEffect } from 'react';
import axios from 'axios';
import './EquipoStyles.css';

function EquipoDetalle({ id, onClose, onEdit, onDelete }) {
    const [equipo, setEquipo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [departamento, setDepartamento] = useState(null);
    const [asignaciones, setAsignaciones] = useState([]);

    useEffect(() => {
        fetchEquipo();
    }, [id]);

    const fetchEquipo = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/equipos/${id}`);
            setEquipo(response.data);

            
            if (response.data.id_departamento) {
                const deptResponse = await axios.get(`http://localhost:8080/api/departamentos/${response.data.id_departamento}`);
                setDepartamento(deptResponse.data);
            }

            
            try {
                const asignResponse = await axios.get(`http://localhost:8080/api/asignaciones?id_equipo=${id}`);
                setAsignaciones(asignResponse.data);
            } catch (err) {
                console.error('Error al cargar asignaciones:', err);
            }

            setLoading(false);
        } catch (err) {
            setError('Error al cargar el equipo: ' + err.message);
            setLoading(false);
        }
    };

    
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'No especificado';
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    };

    const handleDelete = async () => {
        if (window.confirm('¿Está seguro de eliminar este equipo?')) {
            try {
                await axios.delete(`http://localhost:8080/api/equipos/${id}`);
                onDelete(); 
            } catch (err) {
                setError('Error al eliminar el equipo: ' + err.message);
            }
        }
    };

    if (loading) return <div className="container-widgets loading-container"><p>Cargando información del equipo...</p></div>;
    if (error) return <div className="errors"><p>{error}</p></div>;
    if (!equipo) return <div className="container-widgets"><p>No se encontró información del equipo.</p></div>;

    
    const getEstadoClass = (estado) => {
        switch (estado) {
            case 'disponible': return 'estado-badge estado-disponible';
            case 'asignado': return 'estado-badge estado-asignado';
            case 'en_reparacion': return 'estado-badge estado-en_reparacion';
            case 'descarte': return 'estado-badge estado-descarte';
            case 'baja': return 'estado-badge estado-baja';
            default: return 'estado-badge';
        }
    };

    return (
        <div className="container-widgets equipo-detalle-container">
            <div className="container-botones">
                <button className="button azul-claro" onClick={() => onEdit(equipo)}>
                    Editar Equipo
                </button>
                <button className="button rojo-suave" onClick={handleDelete}>
                    Eliminar Equipo
                </button>
                <button className="button" onClick={onClose}>
                    Volver
                </button>
            </div>

            <h2 className="section-title">Detalle del Equipo {equipo.id_equipo}</h2>

            <div className="container-detalles">
                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Tipo:</label>
                        <p>{equipo.tipo || 'No especificado'}</p>
                    </div>
                    <div className="form-items">
                        <label>Marca:</label>
                        <p>{equipo.marca || 'No especificado'}</p>
                    </div>
                    <div className="form-items">
                        <label>Modelo:</label>
                        <p>{equipo.modelo || 'No especificado'}</p>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Número de Serie:</label>
                        <p>{equipo.numero_serie || 'No especificado'}</p>
                    </div>
                    <div className="form-items">
                        <label>Estado:</label>
                        <p><span className={getEstadoClass(equipo.estado)}>{equipo.estado}</span></p>
                    </div>
                    <div className="form-items">
                        <label>Departamento:</label>
                        <p>{departamento ? departamento.nombre : 'No asignado'}</p>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Procesador:</label>
                        <p>{equipo.procesador || 'No especificado'}</p>
                    </div>
                    <div className="form-items">
                        <label>RAM:</label>
                        <p>{equipo.ram || 'No especificado'}</p>
                    </div>
                    <div className="form-items">
                        <label>Almacenamiento:</label>
                        <p>{equipo.almacenamiento || 'No especificado'}</p>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Sistema Operativo:</label>
                        <p>{equipo.sistema_operativo || 'No especificado'}</p>
                    </div>
                    <div className="form-items">
                        <label>Fecha de Compra:</label>
                        <p>{formatearFecha(equipo.fecha_compra)}</p>
                    </div>
                    <div className="form-items">
                        <label>Garantía Hasta:</label>
                        <p>{formatearFecha(equipo.garantia_hasta)}</p>
                    </div>
                </div>

                {equipo.observaciones && (
                    <div className="form-group">
                        <label>Observaciones:</label>
                        <p>{equipo.observaciones}</p>
                    </div>
                )}
            </div>

            {}
            <div className="historial-section">
                <h3>Historial de Asignaciones</h3>
                {asignaciones.length > 0 ? (
                    <div className="container-flow-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Usuario</th>
                                    <th>Motivo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asignaciones.map(asignacion => (
                                    <tr key={asignacion.id_asignacion}>
                                        <td>{formatearFecha(asignacion.fecha_asignacion)}</td>
                                        <td>{asignacion.nombre_usuario} {asignacion.apellido_usuario}</td>
                                        <td>{asignacion.motivo_asignacion}</td>
                                        <td><span className={`estado-badge ${asignacion.estado_asignacion === 'activa' ? 'estado-disponible' : 'estado-baja'}`}>
                                            {asignacion.estado_asignacion}
                                        </span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Este equipo no tiene historial de asignaciones.</p>
                )}
            </div>
        </div>
    );
}

export default EquipoDetalle;
