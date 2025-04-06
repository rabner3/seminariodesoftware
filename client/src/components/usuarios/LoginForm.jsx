// client/src/components/usuarios/LoginForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);

            // Guardar usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

            // Redireccionar al dashboard
            navigate('/');

            // Opcional: recargar la página para actualizar componentes
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-widgets">
            <h2 className="section-title">Iniciar Sesión</h2>

            {error && (
                <div className="errors">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
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

                <div className="form-group">
                    <label className="form-label">Contraseña:</label>
                    <input
                        type="password"
                        className="form-input"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="container-botones">
                    <button
                        type="submit"
                        className="button azul-claro"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;