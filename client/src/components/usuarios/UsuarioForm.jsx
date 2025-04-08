
import { useState, useEffect } from 'react';
import axios from 'axios';

function UsuarioForm({ usuario, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        puesto: '',
        id_departamento: '',
        rol: 'usuario',
        estado: 'activo',
        password: '' // Solo para nuevos usuarios
    });

    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(!usuario); // Mostrar campo de contraseña solo para nuevos usuarios

    useEffect(() => {
        
        if (usuario) {
            setFormData({
                nombre: usuario.nombre || '',
                apellido: usuario.apellido || '',
                email: usuario.email || '',
                telefono: usuario.telefono || '',
                puesto: usuario.puesto || '',
                id_departamento: usuario.id_departamento || '',
                rol: usuario.rol || 'usuario',
                estado: usuario.estado || 'activo',
                password: '' 
            });
            setShowPassword(false); 
        } else {
            
            setFormData({
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                puesto: '',
                id_departamento: '',
                rol: 'usuario',
                estado: 'activo',
                password: ''
            });
            setShowPassword(true); 
        }

        fetchDepartamentos();
    }, [usuario]);

    const fetchDepartamentos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/departamentos');
            setDepartamentos(response.data);
        } catch (err) {
            setError('Error al cargar departamentos: ' + err.message);
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
            
            const datosParaEnviar = { ...formData };
            if (!datosParaEnviar.password) {
                delete datosParaEnviar.password;
            }

            let response;
            if (usuario) {
                
                response = await axios.put(`http://localhost:8080/api/usuarios/${usuario.id_usuarios}`, datosParaEnviar);
            } else {
                
                response = await axios.post('http://localhost:8080/api/usuarios', datosParaEnviar);
            }

            setLoading(false);
            
            onSave(response.data);
        } catch (err) {
            setError('Error al guardar el usuario: ' + (err.response?.data?.message || err.message));
            setLoading(false);
        }
    };

    const togglePasswordField = () => {
        setShowPassword(!showPassword);
        if (!showPassword) {
            setFormData(prev => ({ ...prev, password: '' }));
        }
    };

    return (
        <div className="container-widgets">
            <h2 className="section-title">{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>

            {error && (
                <div className="errors">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="contenedor-columnas">
                    <div className="form-group form-items">
                        <label className="form-label">Nombre:</label>
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
                        <label className="form-label">Apellido:</label>
                        <input
                            type="text"
                            className="form-input"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-group form-items">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-input"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">Teléfono:</label>
                        <input
                            type="tel"
                            className="form-input"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-group form-items">
                        <label className="form-label">Puesto:</label>
                        <input
                            type="text"
                            className="form-input"
                            name="puesto"
                            value={formData.puesto}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">Departamento:</label>
                        <select
                            className="form-select"
                            name="id_departamento"
                            value={formData.id_departamento}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione un departamento</option>
                            {departamentos.map(depto => (
                                <option key={depto.id_departamento} value={depto.id_departamento}>
                                    {depto.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-group form-items">
                        <label className="form-label">Rol:</label>
                        <select
                            className="form-select"
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            required
                        >
                            <option value="usuario">Usuario</option>
                            <option value="tecnico">Técnico</option>
                            <option value="admin">Administrador</option>
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

                {usuario && (
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={togglePasswordField}
                            />
                            {showPassword ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
                        </label>
                    </div>
                )}

                {showPassword && (
                    <div className="form-group">
                        <label className="form-label">Contraseña{usuario ? ' nueva' : ''}:</label>
                        <input
                            type="password"
                            className="form-input"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!usuario}
                        />
                    </div>
                )}

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

export default UsuarioForm;
