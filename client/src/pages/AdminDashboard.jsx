
import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import '../assets/admin.css';

function AdminDashboard() {
    const { setTitle } = useContext(TitleContext);
    const [estadisticas, setEstadisticas] = useState({
        totalEquipos: 0,
        equiposDisponibles: 0,
        equiposAsignados: 0,
        equiposEnReparacion: 0,
        totalUsuarios: 0,
        solicitudesPendientes: 0,
        reparacionesActivas: 0,
        departamentos: 0
    });
    const [equiposRecientes, setEquiposRecientes] = useState([]);
    const [solicitudesRecientes, setSolicitudesRecientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTitle("PANEL DE ADMINISTRACIÓN");
        cargarEstadisticas();
    }, [setTitle]);

    const cargarEstadisticas = async () => {
        try {
            setLoading(true);

            
            const responseEquipos = await axios.get('http://localhost:8080/api/equipos');
            const equipos = responseEquipos.data;

            const totalEquipos = equipos.length;
            const equiposDisponibles = equipos.filter(e => e.estado === 'disponible').length;
            const equiposAsignados = equipos.filter(e => e.estado === 'asignado').length;
            const equiposEnReparacion = equipos.filter(e => e.estado === 'en_reparacion').length;
            const otrosEquipos = totalEquipos - equiposDisponibles - equiposAsignados - equiposEnReparacion;

            
            const equiposOrdenados = [...equipos].sort((a, b) =>
                new Date(b.fecha_registro || 0) - new Date(a.fecha_registro || 0)
            ).slice(0, 5);

            setEquiposRecientes(equiposOrdenados);

            
            const responseUsuarios = await axios.get('http://localhost:8080/api/usuarios');
            const totalUsuarios = responseUsuarios.data.length;


            const responseSolicitudes = await axios.get('http://localhost:8080/api/solicitudes');
            const solicitudes = responseSolicitudes.data;
            const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente').length;

            
            const solicitudesOrdenadas = [...solicitudes]
                .sort((a, b) => new Date(b.fecha_solicitud || 0) - new Date(a.fecha_solicitud || 0))
                .slice(0, 5);

            setSolicitudesRecientes(solicitudesOrdenadas);

            
            const responseReparaciones = await axios.get('http://localhost:8080/api/reparaciones');
            const reparacionesActivas = responseReparaciones.data.filter(
                r => !['completada', 'descarte'].includes(r.estado)
            ).length;

            
            const responseDepartamentos = await axios.get('http://localhost:8080/api/departamentos');
            const departamentos = responseDepartamentos.data.length;

            
            setEstadisticas({
                totalEquipos,
                equiposDisponibles,
                equiposAsignados,
                equiposEnReparacion,
                otrosEquipos,
                totalUsuarios,
                solicitudesPendientes,
                reparacionesActivas,
                departamentos
            });

            setLoading(false);
        } catch (err) {
            setError(`Error al cargar estadísticas: ${err.message}`);
            setLoading(false);
        }
    };

    
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'No disponible';
        return new Date(fechaStr).toLocaleDateString();
    };

    
    const renderPieChart = () => {

        if (estadisticas.totalEquipos === 0) {
            return <div>No hay datos disponibles</div>;
        }

        
        const colors = {
            disponibles: '#28a745',  // verde
            asignados: '#0d6efd',    // azul
            enReparacion: '#ffc107', // amarillo
            otros: '#dc3545'         // rojo
        };

        
        const disponiblesPercent = (estadisticas.equiposDisponibles / estadisticas.totalEquipos) * 100;
        const asignadosPercent = (estadisticas.equiposAsignados / estadisticas.totalEquipos) * 100;
        const enReparacionPercent = (estadisticas.equiposEnReparacion / estadisticas.totalEquipos) * 100;
        const otrosPercent = (estadisticas.otrosEquipos / estadisticas.totalEquipos) * 100;

        
        const _pieStyles = [
            { 
                backgroundColor: colors.disponibles,
                transform: 'rotate(0deg)',
                clipPath: `polygon(50% 0, 100% 0, 100% 100%, 50% 100%, 50% 50%)`,
                width: `${disponiblesPercent}%`,
                zIndex: 4
            },
            { 
                backgroundColor: colors.asignados,
                transform: `rotate(${disponiblesPercent * 3.6}deg)`,
                clipPath: `polygon(50% 0, 100% 0, 100% 100%, 50% 100%, 50% 50%)`,
                width: `${asignadosPercent}%`,
                zIndex: 3
            },
            { 
                backgroundColor: colors.enReparacion,
                transform: `rotate(${(disponiblesPercent + asignadosPercent) * 3.6}deg)`,
                clipPath: `polygon(50% 0, 100% 0, 100% 100%, 50% 100%, 50% 50%)`,
                width: `${enReparacionPercent}%`,
                zIndex: 2
            },
            { 
                backgroundColor: colors.otros,
                transform: `rotate(${(disponiblesPercent + asignadosPercent + enReparacionPercent) * 3.6}deg)`,
                clipPath: `polygon(50% 0, 100% 0, 100% 100%, 50% 100%, 50% 50%)`,
                width: `${otrosPercent}%`,
                zIndex: 1
            }
        ];

        return (
            <div className="pie-chart">
                <div className="pie-chart-wrapper" style={{ position: 'relative', width: '250px', height: '250px' }}>

                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: '#f0f0f0'
                    }}></div>


                    {disponiblesPercent > 0 && (
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: 'conic-gradient(#28a745 0% ' + disponiblesPercent + '%, transparent ' + disponiblesPercent + '% 100%)'
                        }}></div>
                    )}

                    {asignadosPercent > 0 && (
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: 'conic-gradient(transparent 0% ' + disponiblesPercent + '%, #0d6efd ' + disponiblesPercent + '% ' + (disponiblesPercent + asignadosPercent) + '%, transparent ' + (disponiblesPercent + asignadosPercent) + '% 100%)'
                        }}></div>
                    )}


                    {enReparacionPercent > 0 && (
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: 'conic-gradient(transparent 0% ' + (disponiblesPercent + asignadosPercent) + '%, #ffc107 ' + (disponiblesPercent + asignadosPercent) + '% ' + (disponiblesPercent + asignadosPercent + enReparacionPercent) + '%, transparent ' + (disponiblesPercent + asignadosPercent + enReparacionPercent) + '% 100%)'
                        }}></div>
                    )}


                    {otrosPercent > 0 && (
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: 'conic-gradient(transparent 0% ' + (disponiblesPercent + asignadosPercent + enReparacionPercent) + '%, #dc3545 ' + (disponiblesPercent + asignadosPercent + enReparacionPercent) + '% 100%)'
                        }}></div>
                    )}


                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '60%',
                        height: '60%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50%',
                        background: 'white'
                    }}></div>
                </div>

                <div className="chart-legend">
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#28a745' }}></div>
                        <div className="legend-text">Disponibles: {estadisticas.equiposDisponibles}</div>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#0d6efd' }}></div>
                        <div className="legend-text">Asignados: {estadisticas.equiposAsignados}</div>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#ffc107' }}></div>
                        <div className="legend-text">En Reparación: {estadisticas.equiposEnReparacion}</div>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#dc3545' }}></div>
                        <div className="legend-text">Otros: {estadisticas.otrosEquipos}</div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="loading">Cargando estadísticas...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="contenedor-padre" id="contenedor-padre">

            <div className="stats-cards">
                <div className="stat-card">
                    <h3>Total Equipos</h3>
                    <div className="stat-value">{estadisticas.totalEquipos}</div>
                    <div className="stat-icon equipo-icon"></div>
                </div>
                <div className="stat-card">
                    <h3>Equipos Disponibles</h3>
                    <div className="stat-value">{estadisticas.equiposDisponibles}</div>
                    <div className="stat-icon disponible-icon"></div>
                </div>
                <div className="stat-card">
                    <h3>Equipos Asignados</h3>
                    <div className="stat-value">{estadisticas.equiposAsignados}</div>
                    <div className="stat-icon asignado-icon"></div>
                </div>
                <div className="stat-card">
                    <h3>En Reparación</h3>
                    <div className="stat-value">{estadisticas.equiposEnReparacion}</div>
                    <div className="stat-icon reparacion-icon"></div>
                </div>
            </div>

            <div className="stats-cards">
                <div className="stat-card">
                    <h3>Total Usuarios</h3>
                    <div className="stat-value">{estadisticas.totalUsuarios}</div>
                    <div className="stat-icon usuario-icon"></div>
                </div>
                <div className="stat-card">
                    <h3>Solicitudes Pendientes</h3>
                    <div className="stat-value">{estadisticas.solicitudesPendientes}</div>
                    <div className="stat-icon solicitud-icon"></div>
                </div>
                <div className="stat-card">
                    <h3>Reparaciones Activas</h3>
                    <div className="stat-value">{estadisticas.reparacionesActivas}</div>
                    <div className="stat-icon reparacion-icon"></div>
                </div>
                <div className="stat-card">
                    <h3>Departamentos</h3>
                    <div className="stat-value">{estadisticas.departamentos}</div>
                    <div className="stat-icon departamento-icon"></div>
                </div>
            </div>


            <div className="chart-container container-widgets">
                <h3>Distribución de Equipos</h3>
                {renderPieChart()}
            </div>


            <div className="dashboard-main-content">

                <div className="container-widgets">
                    <div className="section-header">
                        <h3>Últimos Equipos Registrados</h3>
                        <Link to="/equipos" className="view-all">Ver todos</Link>
                    </div>
                    {equiposRecientes.length > 0 ? (
                        <div className="container-flow-table">
                            <table className="equipos-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tipo</th>
                                        <th>Marca/Modelo</th>
                                        <th>Estado</th>
                                        <th>Fecha Registro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equiposRecientes.map(equipo => (
                                        <tr key={equipo.id_equipo}>
                                            <td>{equipo.id_equipo}</td>
                                            <td>{equipo.tipo}</td>
                                            <td>{equipo.marca} {equipo.modelo}</td>
                                            <td>
                                                <span className={`estado-badge estado-${equipo.estado}`}>
                                                    {equipo.estado}
                                                </span>
                                            </td>
                                            <td>{formatearFecha(equipo.fecha_registro)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No hay equipos registrados</p>
                    )}
                </div>


                <div className="container-widgets">
                    <div className="section-header">
                        <h3>Últimas Solicitudes</h3>
                        <Link to="/solicitudes" className="view-all">Ver todas</Link>
                    </div>
                    {solicitudesRecientes.length > 0 ? (
                        <div className="container-flow-table">
                            <table className="solicitudes-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Usuario</th>
                                        <th>Tipo</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {solicitudesRecientes.map(solicitud => (
                                        <tr key={solicitud.id_solicitud}>
                                            <td>{solicitud.id_solicitud}</td>
                                            <td>{solicitud.nombre_usuario} {solicitud.apellido_usuario}</td>
                                            <td>{solicitud.tipo}</td>
                                            <td>{formatearFecha(solicitud.fecha_solicitud)}</td>
                                            <td>
                                                <span className={`estado-badge estado-${solicitud.estado}`}>
                                                    {solicitud.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No hay solicitudes registradas</p>
                    )}
                </div>
            </div>


            <div className="quick-actions">
                <Link to="/equipos" className="action-button">
                    <i className="fas fa-laptop"></i>
                    <span>Gestionar Equipos</span>
                </Link>
                <Link to="/usuarios" className="action-button">
                    <i className="fas fa-users"></i>
                    <span>Gestionar Usuarios</span>
                </Link>
                <Link to="/solicitudes" className="action-button">
                    <i className="fas fa-clipboard-list"></i>
                    <span>Ver Solicitudes</span>
                </Link>
                <Link to="/reportes" className="action-button">
                    <i className="fas fa-chart-bar"></i>
                    <span>Reportes</span>
                </Link>
            </div>
        </div>
    );
}

export default AdminDashboard;
