// client/src/pages/TecnicoDashboard.jsx
import { useEffect, useContext, useState } from 'react';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import '../assets/tecnicos.css';
import { Link } from 'react-router-dom';

function TecnicoDashboard() {
  const { setTitle } = useContext(TitleContext);
  const [tecnico, setTecnico] = useState(null);
  const [reparacionesPendientes, setReparacionesPendientes] = useState([]);
  const [reparacionesEnProceso, setReparacionesEnProceso] = useState([]);
  const [reparacionesCompletadas, setReparacionesCompletadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAsignadas: 0,
    totalPendientes: 0,
    totalEnProceso: 0,
    totalCompletadas: 0,
    tiempoPromedio: 0
  });

  useEffect(() => {
    setTitle("DASHBOARD TÉCNICO");
    cargarDatosTecnico();
  }, [setTitle]);

  const cargarDatosTecnico = async () => {
    try {
      setLoading(true);
      // Obtener información del usuario logueado del localStorage
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      
      if (!usuario || usuario.rol !== 'tecnico') {
        setError('No tiene permisos para acceder a esta página');
        setLoading(false);
        return;
      }

      // Cargar datos del técnico
      const responseTecnico = await axios.get(`http://localhost:8080/api/tecnicos/usuario/${usuario.id_usuarios}`);
      setTecnico(responseTecnico.data);

      if (responseTecnico.data) {
        // Cargar reparaciones asignadas al técnico
        const responseReparaciones = await axios.get(`http://localhost:8080/api/reparaciones/tecnico/${responseTecnico.data.id_tecnico}`);
        
        // Filtrar por estado
        const pendientes = responseReparaciones.data.filter(rep => rep.estado === 'pendiente' || rep.estado === 'diagnostico');
        const enProceso = responseReparaciones.data.filter(rep => rep.estado === 'en_reparacion' || rep.estado === 'espera_repuestos');
        const completadas = responseReparaciones.data.filter(rep => rep.estado === 'completada');
        
        setReparacionesPendientes(pendientes);
        setReparacionesEnProceso(enProceso);
        setReparacionesCompletadas(completadas);
        
        // Calcular estadísticas
        setStats({
          totalAsignadas: responseReparaciones.data.length,
          totalPendientes: pendientes.length,
          totalEnProceso: enProceso.length,
          totalCompletadas: completadas.length,
          tiempoPromedio: calcularTiempoPromedio(completadas)
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError(`Error al cargar datos: ${err.message}`);
      setLoading(false);
    }
  };

  const calcularTiempoPromedio = (reparaciones) => {
    if (reparaciones.length === 0) return 0;
    
    const tiemposTotales = reparaciones
      .filter(rep => rep.tiempo_total)
      .map(rep => rep.tiempo_total);
    
    if (tiemposTotales.length === 0) return 0;
    
    const tiempoTotal = tiemposTotales.reduce((acc, tiempo) => acc + tiempo, 0);
    return Math.round(tiempoTotal / tiemposTotales.length);
  };

  if (loading) return <div className="loading">Cargando datos...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!tecnico) return <div className="error">No se encontró información del técnico</div>;

  return (
    <div className="contenedor-padre" id="contenedor-padre">
      {/* Tarjetas de estadísticas */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Reparaciones Asignadas</h3>
          <div className="stat-value">{stats.totalAsignadas}</div>
        </div>
        <div className="stat-card">
          <h3>Reparaciones Pendientes</h3>
          <div className="stat-value">{stats.totalPendientes}</div>
        </div>
        <div className="stat-card">
          <h3>Reparaciones En Proceso</h3>
          <div className="stat-value">{stats.totalEnProceso}</div>
        </div>
        <div className="stat-card">
          <h3>Reparaciones Completadas</h3>
          <div className="stat-value">{stats.totalCompletadas}</div>
        </div>
        <div className="stat-card">
          <h3>Tiempo Promedio (min)</h3>
          <div className="stat-value">{stats.tiempoPromedio}</div>
        </div>
      </div>

      {/* Sección de reparaciones pendientes */}
      <div className="container-widgets">
        <h2>Reparaciones Pendientes ({reparacionesPendientes.length})</h2>
        {reparacionesPendientes.length > 0 ? (
          <div className="container-flow-table">
            <table className="equipos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Equipo</th>
                  <th>Estado</th>
                  <th>Fecha Recepción</th>
                  <th>Urgencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reparacionesPendientes.map(reparacion => (
                  <tr key={reparacion.id_reparacion}>
                    <td>{reparacion.id_reparacion}</td>
                    <td>{`${reparacion.tipo_equipo} ${reparacion.marca_equipo} ${reparacion.modelo_equipo}`}</td>
                    <td>
                      <span className={`estado-badge estado-${reparacion.estado}`}>
                        {reparacion.estado}
                      </span>
                    </td>
                    <td>{new Date(reparacion.fecha_recepcion).toLocaleDateString()}</td>
                    <td>
                      <span className={`urgencia-badge urgencia-${reparacion.urgencia || 'normal'}`}>
                        {reparacion.urgencia || 'Normal'}
                      </span>
                    </td>
                    <td>
                      <div className="botones-accion">
                        <a href={`/tecnico/reparaciones/${reparacion.id_reparacion}`} className="button azul-claro">
                          Ver Detalles
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No hay reparaciones pendientes</p>
        )}
      </div>

      {/* Sección de reparaciones en proceso */}
      <div className="container-widgets">
        <h2>Reparaciones En Proceso ({reparacionesEnProceso.length})</h2>
        {reparacionesEnProceso.length > 0 ? (
          <div className="container-flow-table">
            <table className="equipos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Equipo</th>
                  <th>Estado</th>
                  <th>Fecha Inicio</th>
                  <th>Días en Reparación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reparacionesEnProceso.map(reparacion => {
                  const fechaInicio = new Date(reparacion.fecha_inicio);
                  const hoy = new Date();
                  const diasEnReparacion = Math.floor((hoy - fechaInicio) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={reparacion.id_reparacion}>
                      <td>{reparacion.id_reparacion}</td>
                      <td>{`${reparacion.tipo_equipo} ${reparacion.marca_equipo} ${reparacion.modelo_equipo}`}</td>
                      <td>
                        <span className={`estado-badge estado-${reparacion.estado}`}>
                          {reparacion.estado}
                        </span>
                      </td>
                      <td>{fechaInicio.toLocaleDateString()}</td>
                      <td>{diasEnReparacion}</td>
                      <td>
                        <div className="botones-accion">
                          <a href={`/tecnico/reparaciones/${reparacion.id_reparacion}`} className="button azul-claro">
                            Ver Detalles
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No hay reparaciones en proceso</p>
        )}
      </div>

{/* Botones de acción rápida */}
<div className="quick-actions">
  <Link to="/tecnico/reparaciones" className="action-button">
    <i className="fas fa-tools"></i>
    <span>Todas las Reparaciones</span>
  </Link>
  <Link to="/tecnico/bitacoras" className="action-button">
    <i className="fas fa-clipboard-list"></i>
    <span>Mis Bitácoras</span>
  </Link>
  <Link to="/tecnico/diagnosticos" className="action-button">
    <i className="fas fa-search"></i>
    <span>Diagnósticos</span>
  </Link>
  <Link to="/tecnico/partes" className="action-button">
    <i className="fas fa-microchip"></i>
    <span>Inventario de Partes</span>
  </Link>
</div>
    </div>
  );
}

export default TecnicoDashboard;