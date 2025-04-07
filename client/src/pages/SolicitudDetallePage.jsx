// client/src/pages/SolicitudDetallePage.jsx
import { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TitleContext } from '../context/TitleContext';
import SolicitudDetalle from '../components/solicitudes/SolicitudDetalle';

function SolicitudDetallePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle } = useContext(TitleContext);
    
    useEffect(() => {
        setTitle("DETALLE DE SOLICITUD");
    }, [setTitle]);
    
    const handleClose = () => {
        navigate('/solicitudes');
    };
    
    const handleRefresh = () => {
        // Simplemente volvemos a cargar la página actual
        window.location.reload();
    };
    
    return (
        <div className="contenedor-padre">
            <SolicitudDetalle
                id={parseInt(id)}
                onClose={handleClose}
                onRefresh={handleRefresh}
            />
        </div>
    );
}

export default SolicitudDetallePage;