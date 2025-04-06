// client/src/pages/Login.jsx
import { useEffect, useContext } from 'react';
import { TitleContext } from '../context/TitleContext';
import LoginForm from '../components/usuarios/LoginForm';
import '../assets/usuarios.css';

function Login() {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => {
        setTitle("INICIAR SESIÓN");
    }, [setTitle]);

    return (
        <div className="contenedor-padre" id="contenedor-padre">
            <div className="login-container">
                <LoginForm />
            </div>
        </div>
    );
}

export default Login;