
import { useState, useEffect } from 'react';
import axios from 'axios';

function UsuariosList({ onEdit, onView, onDelete }) {
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        fetchUsuarios();
    }, []);

    useEffect(() => {
        
        if (busqueda.trim() === '') {
            setUsuariosFiltrados(usuarios);
        } else {
            const textoBusqueda = busqueda.toLowerCase();
            const filtrados = usuarios.filter(usuario =>
                usuario.nombre?.toLowerCase().includes(textoBusqueda) ||
                usuario.apellido?.toLowerCase().includes(textoBusqueda) ||
                usuario.email?.toLowerCase().includes(textoBusqueda) ||
                usuario.puesto?.toLowerCase().includes(textoBusqueda)
            );
            setUsuariosFiltrados(filtrados);
        }
    }, [busqueda, usuarios]);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/usuarios');
            setUsuarios(response.data);
            setUsuariosFiltrados(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los usuarios: ' + err.message);
            setLoading(false);
        }
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const getRolClass = (rol) => {
        switch (rol) {
            case 'admin': return 'estado-badge estado-en_reparacion';
            case 'tecnico': return 'estado-badge estado-asignado';
            case 'usuario': return 'estado-badge estado-disponible';
            default: return 'estado-badge';
        }
    };

    const handleEliminarUsuario = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este usuario?')) {
            try {
                await axios.delete(`http://localhost:8080/api/usuarios/${id}`);
                // Actualizar la lista después de eliminar
                fetchUsuarios();
            } catch (err) {
                alert('Error al eliminar el usuario: ' + err.message);
            }
        }
    };

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <div className="errors"><p>{error}</p></div>;

    return (
        <div>
            <div className="search-container">
                <h2 className="section-title">Listado de Usuarios</h2>
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido, email o puesto..."
                    className="search-input"
                    value={busqueda}
                    onChange={handleBusquedaChange}
                />
            </div>

            <div className="container-flow-table">
                <table className="equipos-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Departamento</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.length > 0 ? (
                            usuariosFiltrados.map(usuario => (
                                <tr key={usuario.id_usuarios}>
                                    <td>{usuario.id_usuarios}</td>
                                    <td>{`${usuario.nombre} ${usuario.apellido}`}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <span className={getRolClass(usuario.rol)}>
                                            {usuario.rol || 'usuario'}
                                        </span>
                                    </td>
                                    <td>{usuario.departamento_nombre || 'No asignado'}</td>
                                    <td>
                                        <span className={`estado-badge ${usuario.estado === 'activo' ? 'estado-disponible' : 'estado-baja'}`}>
                                            {usuario.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="botones-accion">
                                            <button
                                                className="button azul-claro"
                                                onClick={() => onView(usuario.id_usuarios)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="button azul-claro"
                                                onClick={() => onEdit(usuario)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="button rojo-suave"
                                                onClick={() => handleEliminarUsuario(usuario.id_usuarios)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                    No hay usuarios registrados o que coincidan con la búsqueda
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UsuariosList;
