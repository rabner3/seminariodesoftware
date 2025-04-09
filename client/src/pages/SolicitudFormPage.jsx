
import { useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TitleContext } from '../context/TitleContext';
import SolicitudForm from '../components/solicitudes/SolicitudForm';

function SolicitudFormPage() {
    const { setTitle } = useContext(TitleContext);
    const navigate = useNavigate();
    const { id } = useParams(); 

    useEffect(() => {
        setTitle("NUEVA SOLICITUD");
    }, [setTitle]);

    const handleSave = () => {
        navigate('/solicitudes');
    };

    const handleCancel = () => {
        navigate(-1); 
    };

    return (
        <div className="contenedor-padre">
            <SolicitudForm
                equipoId={id}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </div>
    );
}

export default SolicitudFormPage;