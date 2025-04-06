// client/src/components/departamentos/DepartamentoDetalle.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function DepartamentoDetalle({ id, onClose, onEdit, onDelete }) {
    const [departamento, setDepartamento] = useState(null);
    const [responsable, setResponsable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [equipos, setEquipos] = useState([]);

    useEffect(() => {
        fetchDepartamento();
    }, [id]);

    const fetchDepartamento = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/departamentos/${id}`);
            setDepartamento(response.data);

            // Si el departamento tiene responsable, lo cargamos
            if (response.data.id_responsable) {
                try {
                    const respResponse = await axios.get(`http://localhost:8080/api/usuarios/${response.data.id_responsable}`);
                    setResponsable(respResponse.data);
                } catch (err) {
                    console.error('Error al cargar responsable:', err);
                }
            }

            // Cargar usuarios y equipos asociados a este departamento
            try {
                // Usamos la ruta específica para obtener usuarios por departamento
                const usuariosResponse = await axios.get(`http://localhost:8080/api/usuarios/departamento/${id}`);
                setUsuarios(usuariosResponse.data);
            } catch (err) {
                console.error('Error al cargar usuarios:', err);
                setUsuarios([]); // Aseguramos que sea un array vacío en caso de error
            }

            try {
                // Usamos la ruta específica para obtener equipos por departamento
                const equiposResponse = await axios.get(`http://localhost:8080/api/equipos/departamento/${id}`);
                setEquipos(equiposResponse.data);
            } catch (err) {
                console.error('Error al cargar equipos:', err);
                setEquipos([]); // Aseguramos que sea un array vacío en caso de error
            }

            setLoading(false);
        } catch (err) {
            setError('Error al cargar el departamento: ' + err.message);
            setLoading(false);
        }
    };

    // Función para formatear fechas
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'No especificado';
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async () => {
        if (window.confirm('¿Está seguro de eliminar este departamento?')) {
            try {
                await axios.delete(`http://localhost:8080/api/departamentos/${id}`);
                onDelete(); // Callback para informar al componente padre
            } catch (err) {
                setError('Error al eliminar el departamento: ' + err.message);
            }
        }
    };

    if (loading) return <div className="container-widgets loading-container"><p>Cargando información del departamento...</p></div>;
    if (error) return <div className="errors"><p>{error}</p></div>;
    if (!departamento) return <div className="container-widgets"><p>No se encontró información del departamento.</p></div>;

    return (
        <div className="container-widgets departamento-detalle-container">
            <div className="container-botones">
                <button className="button azul-claro" onClick={() => onEdit(departamento)}>
                    Editar Departamento
                </button>
                <button className="button rojo-suave" onClick={handleDelete}>
                    Eliminar Departamento
                </button>
                <button className="button" onClick={onClose}>
                    Volver
                </button>
            </div>

            <h2 className="section-title">Detalle del Departamento {departamento.id_departamento}</h2>

            <div className="container-detalles">
                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Nombre:</label>
                        <p>{departamento.nombre || 'No especificado'}</p>
                    </div>
                    <div className="form-items">
                        <label>Código:</label>
                        <p>{departamento.codigo || 'No especificado'}</p>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Responsable:</label>
                        <p>{responsable ? `${responsable.nombre} ${responsable.apellido}` : 'No asignado'}</p>
                    </div>
                    <div className="form-items">
                        <label>Estado:</label>
                        <p>
                            <span className={`estado-badge ${departamento.estado === 'activo' ? 'estado-disponible' : 'estado-baja'}`}>
                                {departamento.estado}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Fecha de Creación:</label>
                        <p>{formatearFecha(departamento.fecha_creacion)}</p>
                    </div>
                    <div className="form-items">
                        <label>Última Actualización:</label>
                        <p>{formatearFecha(departamento.fecha_actualizacion)}</p>
                    </div>
                </div>
            </div>

            {/* Sección de usuarios del departamento */}
            <div className="seccion-relacionados">
                <h3>Usuarios asignados a este departamento ({usuarios.length})</h3>
                {usuarios.length > 0 ? (
                    <div className="container-flow-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Puesto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(usuario => (
                                    <tr key={usuario.id_usuarios}>
                                        <td>{usuario.id_usuarios}</td>
                                        <td>{`${usuario.nombre} ${usuario.apellido}`}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.puesto || 'No especificado'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Este departamento no tiene usuarios asignados.</p>
                )}
            </div>

            {/* Sección de equipos del departamento */}
            <div className="seccion-relacionados">
                <h3>Equipos asignados a este departamento ({equipos.length})</h3>
                {equipos.length > 0 ? (
                    <div className="container-flow-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipos.map(equipo => (
                                    <tr key={equipo.id_equipo}>
                                        <td>{equipo.id_equipo}</td>
                                        <td>{equipo.tipo}</td>
                                        <td>{equipo.marca}</td>
                                        <td>{equipo.modelo}</td>
                                        <td>
                                            <span className={`estado-badge estado-${equipo.estado}`}>
                                                {equipo.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Este departamento no tiene equipos asignados.</p>
                )}
            </div>
        </div>
    );
}

export default DepartamentoDetalle;