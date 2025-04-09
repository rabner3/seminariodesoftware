
import { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import '../assets/equipos.css';

function EquipoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle } = useContext(TitleContext);
    const [equipo, setEquipo] = useState(null);
    const [asignacion, setAsignacion] = useState(null);
    const [setHistorialAsignaciones] = useState([]);
    const [historialReparaciones, setHistorialReparaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTitle("DETALLE DE EQUIPO");
        cargarDatos();
    }, [id, setTitle]);

    const cargarDatos = async () => {
        try {
            setLoading(true);


            const responseEquipo = await axios.get(`http://localhost:8080/api/equipos/${id}`);
            setEquipo(responseEquipo.data);

            const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
            

    
            try {
                const responseAsignaciones = await axios.get(`http://localhost:8080/api/asignaciones?id_equipo=${id}&estado=activa`);
                const asignacionActual = responseAsignaciones.data.find(
                    asig => asig.id_usuario === usuarioActual.id_usuarios
                );
                setAsignacion(asignacionActual);
            } catch (err) {
                console.error("Error al cargar asignación:", err);
            }


            try {
                const responseHistorialAsign = await axios.get(`http://localhost:8080/api/asignaciones?id_equipo=${id}`);
                setHistorialAsignaciones(responseHistorialAsign.data);
            } catch (err) {
                console.error("Error al cargar historial de asignaciones:", err);
            }


            try {
                const responseHistorialRepar = await axios.get(`http://localhost:8080/api/reparaciones?id_equipo=${id}`);
                setHistorialReparaciones(responseHistorialRepar.data);
            } catch (err) {
                console.error("Error al cargar historial de reparaciones:", err);
            }

            setLoading(false);
        } catch (err) {
            setError(`Error al cargar datos: ${err.message}`);
            setLoading(false);
        }
    };


    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'No disponible';
        return new Date(fechaStr).toLocaleDateString();
    };

    // Crear nueva solicitud para este equipo
    const handleCrearSolicitud = () => {
        navigate(`/solicitudes/nueva/${id}`);
    };

    if (loading) return <div className="loading">Cargando información del equipo...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!equipo) return <div className="error">No se encontró información del equipo</div>;
    const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
    const esTecnico = usuario.rol === 'tecnico';
    return (
        <div className="contenedor-padre" id="contenedor-padre">
            <div className="container-widgets">
                <div className="container-botones">
                    <button onClick={() => navigate('/')} className="button">
                        Volver
                    </button>

                    {!esTecnico && (
                        <button onClick={handleCrearSolicitud} className="button azul-claro">
                            Solicitar Soporte
                        </button>
                    )}
                </div>

                <h2 className="section-title">Equipo #{equipo.id_equipo}</h2>

                <div className="equipo-detalles">
                    <div className="equipo-seccion">
                        <h3>Información General</h3>
                        <p><strong>Tipo:</strong> {equipo.tipo}</p>
                        <p><strong>Marca:</strong> {equipo.marca}</p>
                        <p><strong>Modelo:</strong> {equipo.modelo}</p>
                        <p><strong>Serie:</strong> {equipo.numero_serie}</p>
                    </div>

                    <div className="equipo-seccion">
                        <h3>Especificaciones</h3>
                        <p><strong>Procesador:</strong> {equipo.procesador || 'No especificado'}</p>
                        <p><strong>RAM:</strong> {equipo.ram || 'No especificado'}</p>
                        <p><strong>Almacenamiento:</strong> {equipo.almacenamiento || 'No especificado'}</p>
                        <p><strong>Sistema Operativo:</strong> {equipo.sistema_operativo || 'No especificado'}</p>
                    </div>

                    <div className="equipo-seccion">
                        <h3>Estado</h3>
                        <p>
                            <strong>Estado actual:</strong>
                            <span className={`estado-badge estado-${equipo.estado}`}>{equipo.estado}</span>
                        </p>
                        <p><strong>Fecha de compra:</strong> {formatearFecha(equipo.fecha_compra)}</p>
                        <p><strong>Garantía hasta:</strong> {formatearFecha(equipo.garantia_hasta)}</p>
                        <p>
                            <strong>Asignado desde:</strong>
                            {asignacion ? formatearFecha(asignacion.fecha_asignacion) : 'No asignado'}
                        </p>
                    </div>
                </div>

                {equipo.observaciones && (
                    <div className="observaciones-box">
                        <h3>Observaciones</h3>
                        <p>{equipo.observaciones}</p>
                    </div>
                )}
            </div>


            <div className="container-widgets">
                <h3>Historial de Reparaciones</h3>

                {historialReparaciones && historialReparaciones.length > 0 ? (
                    <div className="container-flow-table">
                        <table className="equipos-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Finalización</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historialReparaciones.map(reparacion => (
                                    <tr key={reparacion.id_reparacion}>
                                        <td>{reparacion.id_reparacion}</td>
                                        <td>{formatearFecha(reparacion.fecha_recepcion)}</td>
                                        <td>
                                            <span className={`estado-badge estado-${reparacion.estado}`}>
                                                {reparacion.estado}
                                            </span>
                                        </td>
                                        <td>{reparacion.fecha_fin ? formatearFecha(reparacion.fecha_fin) : 'En proceso'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Este equipo no tiene historial de reparaciones.</p>
                )}
            </div>
        </div>
    );
}

export default EquipoDetalle;