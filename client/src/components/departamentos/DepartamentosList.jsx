// client/src/components/departamentos/DepartamentosList.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function DepartamentosList({ onEdit, onView, onDelete }) {
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        fetchDepartamentos();
    }, []);

    useEffect(() => {
        // Filtrar departamentos cuando cambia la búsqueda
        if (busqueda.trim() === '') {
            setDepartamentosFiltrados(departamentos);
        } else {
            const textoBusqueda = busqueda.toLowerCase();
            const filtrados = departamentos.filter(departamento =>
                departamento.nombre?.toLowerCase().includes(textoBusqueda) ||
                departamento.codigo?.toLowerCase().includes(textoBusqueda)
            );
            setDepartamentosFiltrados(filtrados);
        }
    }, [busqueda, departamentos]);

    const fetchDepartamentos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/departamentos');
            setDepartamentos(response.data);
            setDepartamentosFiltrados(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los departamentos: ' + err.message);
            setLoading(false);
        }
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleEliminarDepartamento = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este departamento?')) {
            try {
                await axios.delete(`http://localhost:8080/api/departamentos/${id}`);
                // Actualizar la lista después de eliminar
                fetchDepartamentos();
                onDelete();
            } catch (err) {
                alert('Error al eliminar el departamento: ' + err.message);
            }
        }
    };

    if (loading) return <p>Cargando departamentos...</p>;
    if (error) return <div className="errors"><p>{error}</p></div>;

    return (
        <div>
            <div className="search-container">
                <h2 className="section-title">Listado de Departamentos</h2>
                <input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    className="search-input"
                    value={busqueda}
                    onChange={handleBusquedaChange}
                />
            </div>

            <div className="container-flow-table">
                <table className="departamentos-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Código</th>
                            <th>Responsable</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departamentosFiltrados.length > 0 ? (
                            departamentosFiltrados.map(departamento => (
                                <tr key={departamento.id_departamento}>
                                    <td>{departamento.id_departamento}</td>
                                    <td>{departamento.nombre}</td>
                                    <td>{departamento.codigo}</td>
                                    <td>{departamento.responsable_nombre || 'No asignado'}</td>
                                    <td>
                                        <span className={`estado-badge ${departamento.estado === 'activo' ? 'estado-disponible' : 'estado-baja'}`}>
                                            {departamento.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="botones-accion">
                                            <button
                                                className="button azul-claro"
                                                onClick={() => onView(departamento.id_departamento)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="button azul-claro"
                                                onClick={() => onEdit(departamento)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="button rojo-suave"
                                                onClick={() => handleEliminarDepartamento(departamento.id_departamento)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                    No hay departamentos registrados o que coincidan con la búsqueda
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DepartamentosList;