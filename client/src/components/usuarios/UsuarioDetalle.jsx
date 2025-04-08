
import { useState, useEffect } from 'react';
import axios from 'axios';

function UsuarioDetalle({ id, onClose, onEdit, onDelete }) {
    const [usuario, setUsuario] = useState(null);
    const [departamento, setDepartamento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsuario();
    }, [id]);

    const fetchUsuario = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/usuarios/${id}`);
            setUsuario(response.data);

            
            if (response.data.id_departamento) {
                try {
                    const deptResponse = await axios.get(`http://localhost:8080/api/departamentos/${response.data.id_departamento}`);
                    setDepartamento(deptResponse.data);
                } catch (err) {
                    console.error('Error al cargar departamento:', err);
                }
            }

            setLoading(false);
        } catch (err) {
            setError('Error al cargar el usuario: ' + err.message);
            setLoading(false);
        }
    };

    
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
        if (window.confirm('¿Está seguro de eliminar este usuario?')) {
            try {
                await axios.delete(`http://localhost:8080/api/usuarios/${id}`);
                onDelete(); // Callback para informar al componente padre
            } catch (err) {
                setError('Error al eliminar el usuario: ' + err.message);
            }
        }
    };

    const getRolClass = (rol) => {
        switch (rol) {
            case 'admin': return 'estado-badge estado-en_reparacion';
            case 'tecnico': return 'estado-badge estado-asignado';
            case 'usuario': return 'estado-badge estado-disponible';
            default: return 'estado-badge';
        }
    };

    if (loading) return <div className="container-widgets loading-container"><p>Cargando información del usuario...</p></div>;
    if (error) return <div className="errors"><p>{error}</p></div>;
    if (!usuario) return <div className="container-widgets"><p>No se encontró información del usuario.</p></div>;

    return (
        <div className="container-widgets equipo-detalle-container">
            <div className="container-botones">
                <button className="button azul-claro" onClick={() => onEdit(usuario)}>
                    Editar Usuario
                </button>
                <button className="button rojo-suave" onClick={handleDelete}>
                    Eliminar Usuario
                </button>
                <button className="button" onClick={onClose}>
                    Volver
                </button>
            </div>

            <h2 className="section-title">Detalle del Usuario {usuario.id_usuarios}</h2>

            <div className="container-detalles">
                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Nombre:</label>
                        <p>{usuario.nombre || 'No especificado'}</p>
                    </div>
                    <div className="form-items">
                        <label>Apellido:</label>
                        <p>{usuario.apellido || 'No especificado'}</p>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Email:</label>
                        <p>{usuario.email || 'No especificado'}</p>
                    </div>
                    <div className="form-items">
                        <label>Teléfono:</label>
                        <p>{usuario.telefono || 'No especificado'}</p>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Puesto:</label>
                        <p>{usuario.puesto || 'No especificado'}</p>
                    </div>
                    <div className="form-items">
                        <label>Departamento:</label>
                        <p>{departamento ? departamento.nombre : 'No asignado'}</p>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Rol:</label>
                        <p><span className={getRolClass(usuario.rol)}>{usuario.rol || 'usuario'}</span></p>
                    </div>
                    <div className="form-items">
                        <label>Estado:</label>
                        <p>
                            <span className={`estado-badge ${usuario.estado === 'activo' ? 'estado-disponible' : 'estado-baja'}`}>
                                {usuario.estado}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-items">
                        <label>Fecha de Registro:</label>
                        <p>{formatearFecha(usuario.fecha_registro)}</p>
                    </div>
                    <div className="form-items">
                        <label>Última Actualización:</label>
                        <p>{formatearFecha(usuario.fecha_actualizacion)}</p>
                    </div>
                </div>

                <div className="form-items">
                    <label>Último Login:</label>
                    <p>{formatearFecha(usuario.ultimo_login)}</p>
                </div>
            </div>
        </div>
    );
}

export default UsuarioDetalle;
