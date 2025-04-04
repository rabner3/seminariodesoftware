// client/src/components/equipos/EquipoDetalle.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

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

            // Si el equipo tiene departamento, lo cargamos
            if (response.data.id_departamento) {
                const deptResponse = await axios.get(`http://localhost:8080/api/departamentos/${response.data.id_departamento}`);
                setDepartamento(deptResponse.data);
            }

            // Cargar las asignaciones de este equipo (historial)
            // Nota: Esta API tendría que implementarse en el backend
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

    const handleDelete = async () => {
        if (window.confirm('¿Está seguro de eliminar este equipo?')) {
            try {
                await axios.delete(`http://localhost:8080/api/equipos/${id}`);
                onDelete(); // Callback para informar al componente padre
            } catch (err) {
                setError('Error al eliminar el equipo: ' + err.message);
            }
        }
    };

    if (loading) return <p>Cargando información del equipo...</p>;
    if (error) return <div className="errors"><p>{error}</p></div>;
    if (!equipo) return <p>No se encontró información del equipo.</p>;

    return (
        <div className="container-widgets">
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

            <h2>Detalle del Equipo {equipo.id_equipo}</h2>

            <div className="container-detalles">
                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Tipo:</label>
                        <p>{equipo.tipo}</p>
                    </div>
                    <div className="form-items">
                        <label>Marca:</label>
                        <p>{equipo.marca}</p>
                    </div>
                    <div className="form-items">
                        <label>Modelo:</label>
                        <p>{equipo.modelo}</p>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Número de Serie:</label>
                        <p>{equipo.numero_serie}</p>
                    </div>
                    <div className="form-items">
                        <label>Estado:</label>
                        <p>{equipo.estado}</p>
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
                        <p>{equipo.fecha_compra || 'No especificado'}</p>
                    </div>
                    <div className="form-items">
                        <label>Garantía Hasta:</label>
                        <p>{equipo.garantia_hasta || 'No especificado'}</p>
                    </div>
                </div>

                {equipo.observaciones && (
                    <div className="form-items">
                        <label>Observaciones:</label>
                        <p>{equipo.observaciones}</p>
                    </div>
                )}
            </div>

            {/* Historial de asignaciones */}
            <div className="container-widgets">
                <h3>Historial de Asignaciones</h3>
                {asignaciones.length > 0 ? (
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
                                    <td>{new Date(asignacion.fecha_asignacion).toLocaleDateString()}</td>
                                    <td>{asignacion.nombre_usuario} {asignacion.apellido_usuario}</td>
                                    <td>{asignacion.motivo_asignacion}</td>
                                    <td>{asignacion.estado_asignacion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Este equipo no tiene historial de asignaciones.</p>
                )}
            </div>
        </div>
    );
}

export default EquipoDetalle;