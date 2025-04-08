// client/src/pages/Reportes.jsx
import { useEffect, useContext, useState } from 'react';
import { TitleContext } from '../context/TitleContext';
import ReporteInventario from '../components/reportes/ReporteInventario';
import ReporteAsignaciones from '../components/reportes/ReporteAsignaciones';
import ReporteReparaciones from '../components/reportes/ReporteReparaciones';
import '../assets/reportes.css';

function Reportes() {
    const { setTitle } = useContext(TitleContext);
    const [tipoReporte, setTipoReporte] = useState('inventario');
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        setTitle("REPORTES");

        // Obtener el usuario actual del localStorage
        const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
        setUsuario(usuarioActual);

        // Verificar si el usuario tiene permisos de administrador
        if (!usuarioActual || usuarioActual.rol !== 'admin') {
            alert('No tienes permisos para acceder a esta sección');
            window.location.href = '/';
        }
    }, [setTitle]);

    // Función para renderizar el componente de reporte seleccionado
    const renderReporte = () => {
        switch (tipoReporte) {
            case 'inventario':
                return <ReporteInventario />;
            case 'asignaciones':
                return <ReporteAsignaciones />;
            case 'reparaciones':
                return <ReporteReparaciones />;
            case 'tecnicos':
                return <ReporteTecnicos />;
            case 'solicitudes':
                return <ReporteSolicitudes />;
            default:
                return <ReporteInventario />;
        }
    };

    return (
        <div className="contenedor-padre" id="contenedor-padre">
            <div className="container-widgets">
                <h2 className="section-title">Generación de Reportes</h2>

                <div className="reportes-selector">
                    <button
                        className={`reporte-btn ${tipoReporte === 'inventario' ? 'active' : ''}`}
                        onClick={() => setTipoReporte('inventario')}
                    >
                        Inventario
                    </button>
                    <button
                        className={`reporte-btn ${tipoReporte === 'asignaciones' ? 'active' : ''}`}
                        onClick={() => setTipoReporte('asignaciones')}
                    >
                        Asignaciones
                    </button>
                    <button
                        className={`reporte-btn ${tipoReporte === 'reparaciones' ? 'active' : ''}`}
                        onClick={() => setTipoReporte('reparaciones')}
                    >
                        Reparaciones
                    </button>
                </div>

                <div className="reporte-container">
                    {renderReporte()}
                </div>
            </div>
        </div>
    );
}

export default Reportes;