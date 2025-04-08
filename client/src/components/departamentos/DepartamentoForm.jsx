
import { useState, useEffect } from 'react';
import axios from 'axios';

function DepartamentoForm({ departamento, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        nombre: '',
        codigo: '',
        id_responsable: '',
        estado: 'activo'
    });
    
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        if (departamento) {
            setFormData({
                nombre: departamento.nombre || '',
                codigo: departamento.codigo || '',
                id_responsable: departamento.id_responsable || '',
                estado: departamento.estado || 'activo'
            });
        } else {
            
            setFormData({
                nombre: '',
                codigo: '',
                id_responsable: '',
                estado: 'activo'
            });
        }

        fetchUsuarios();
    }, [departamento]);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/usuarios');
            setUsuarios(response.data);
        } catch (err) {
            setError('Error al cargar usuarios: ' + err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            
            if (!formData.codigo && formData.nombre) {
                formData.codigo = formData.nombre
                    .substring(0, 3)
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, '') 
                    + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            }

            let response;
            if (departamento) {
                
                response = await axios.put(`http://localhost:8080/api/departamentos/${departamento.id_departamento}`, formData);
            } else {
                
                response = await axios.post('http://localhost:8080/api/departamentos', formData);
            }

            setLoading(false);
            
            onSave(response.data);
        } catch (err) {
            setError('Error al guardar el departamento: ' + (err.response?.data?.message || err.message));
            setLoading(false);
        }
    };

    return (
        <div className="container-widgets">
            <h2 className="section-title">{departamento ? 'Editar Departamento' : 'Nuevo Departamento'}</h2>

            {error && (
                <div className="errors">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="contenedor-columnas">
                    <div className="form-group form-items">
                        <label className="form-label">Nombre del Departamento:</label>
                        <input
                            type="text"
                            className="form-input"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">Código (opcional):</label>
                        <input
                            type="text"
                            className="form-input"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            placeholder="Se generará automáticamente si se deja vacío"
                        />
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-group form-items">
                        <label className="form-label">Responsable:</label>
                        <select
                            className="form-select"
                            name="id_responsable"
                            value={formData.id_responsable}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione un responsable</option>
                            {usuarios.map(usuario => (
                                <option key={usuario.id_usuarios} value={usuario.id_usuarios}>
                                    {usuario.nombre} {usuario.apellido} ({usuario.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">Estado:</label>
                        <select
                            className="form-select"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            required
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="container-botones">
                    <button
                        type="submit"
                        className="button azul-claro"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                        type="button"
                        className="button rojo-suave"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DepartamentoForm;
