
import { useEffect, useContext, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import '../assets/tecnicos.css';

function TecnicoDashboard() {
  const { setTitle } = useContext(TitleContext);
  const [tecnico, setTecnico] = useState(null);
  const [reparacionesPendientes, setReparacionesPendientes] = useState([]);
  const [reparacionesEnProceso, setReparacionesEnProceso] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAsignadas: 0,
    totalPendientes: 0,
    totalEnProceso: 0,
    totalCompletadas: 0,
    tiempoPromedio: 0
  });

  const calcularTiempoPromedio = useCallback((reparaciones) => {
    if (!reparaciones || reparaciones.length === 0) return 0;
    
    const tiemposTotales = reparaciones
      .filter(rep => rep && rep.tiempo_total)
      .map(rep => rep.tiempo_total);
    
    if (tiemposTotales.length === 0) return 0;
    
    const tiempoTotal = tiemposTotales.reduce((acc, tiempo) => acc + tiempo, 0);
    return Math.round(tiempoTotal / tiemposTotales.length);
  }, []);


  const cargarDatosTecnico = useCallback(async () => {
    try {
      setLoading(true);

      const usuarioJSON = localStorage.getItem('usuario');
      if (!usuarioJSON) {
        setError('No se encontró información de usuario');
        setLoading(false);
        return;
      }

      const usuario = JSON.parse(usuarioJSON);
      
      if (!usuario || usuario.rol !== 'tecnico') {
        setError('No tiene permisos para acceder a esta página');
        setLoading(false);
        return;
      }


      try {
        const responseTecnico = await axios.get(`http://localhost:8080/api/tecnicos/usuario/${usuario.id_usuarios}`);
        setTecnico(responseTecnico.data);

        if (responseTecnico.data) {
 
          const responseReparaciones = await axios.get(`http://localhost:8080/api/reparaciones/tecnico/${responseTecnico.data.id_tecnico}`);
          
          if (responseReparaciones.data) {
       
            const pendientes = responseReparaciones.data.filter(rep => 
              rep && (rep.estado === 'pendiente' || rep.estado === 'diagnostico'));
            const enProceso = responseReparaciones.data.filter(rep => 
              rep && (rep.estado === 'en_reparacion' || rep.estado === 'espera_repuestos'));
            const completadas = responseReparaciones.data.filter(rep => 
              rep && rep.estado === 'completada');
            
            setReparacionesPendientes(pendientes || []);
            setReparacionesEnProceso(enProceso || []);
            
     
            setStats({
              totalAsignadas: responseReparaciones.data.length,
              totalPendientes: pendientes ? pendientes.length : 0,
              totalEnProceso: enProceso ? enProceso.length : 0,
              totalCompletadas: completadas ? completadas.length : 0,
              tiempoPromedio: calcularTiempoPromedio(completadas)
            });
          }
        }
      } catch (err) {
        console.error("Error al cargar datos del técnico:", err);
        setError(`Error al cargar datos del técnico: ${err.message}`);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error general:", err);
      setError(`Error al cargar datos: ${err.message}`);
      setLoading(false);
    }
  }, [calcularTiempoPromedio]);

  useEffect(() => {
    setTitle("DASHBOARD TÉCNICO");
    cargarDatosTecnico();
  }, [setTitle, cargarDatosTecnico]);

  if (loading) return <div className="loading">Cargando datos...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!tecnico) return <div className="error">No se encontró información del técnico</div>;

  return (
    <div className="contenedor-padre" id="contenedor-padre">

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

 
      <div className="container-widgets">
        <h2>Reparaciones Pendientes ({reparacionesPendientes.length})</h2>
        {reparacionesPendientes && reparacionesPendientes.length > 0 ? (
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
                    <td>{`${reparacion.tipo_equipo || ''} ${reparacion.marca_equipo || ''} ${reparacion.modelo_equipo || ''}`}</td>
                    <td>
                      <span className={`estado-badge estado-${reparacion.estado || 'pendiente'}`}>
                        {reparacion.estado || 'pendiente'}
                      </span>
                    </td>
                    <td>{reparacion.fecha_recepcion ? new Date(reparacion.fecha_recepcion).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`urgencia-badge urgencia-${reparacion.urgencia || 'normal'}`}>
                        {reparacion.urgencia || 'Normal'}
                      </span>
                    </td>
                    <td>
                      <div className="botones-accion">
                        <Link to={`/tecnico/reparaciones/${reparacion.id_reparacion}`} className="button azul-claro">
                          Ver Detalles
                        </Link>
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


      <div className="container-widgets">
        <h2>Reparaciones En Proceso ({reparacionesEnProceso.length})</h2>
        {reparacionesEnProceso && reparacionesEnProceso.length > 0 ? (
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
                  let diasEnReparacion = 0;
                  if (reparacion.fecha_inicio) {
                    const fechaInicio = new Date(reparacion.fecha_inicio);
                    const hoy = new Date();
                    diasEnReparacion = Math.floor((hoy - fechaInicio) / (1000 * 60 * 60 * 24));
                  }
                  
                  return (
                    <tr key={reparacion.id_reparacion}>
                      <td>{reparacion.id_reparacion}</td>
                      <td>{`${reparacion.tipo_equipo || ''} ${reparacion.marca_equipo || ''} ${reparacion.modelo_equipo || ''}`}</td>
                      <td>
                        <span className={`estado-badge estado-${reparacion.estado || 'en_reparacion'}`}>
                          {reparacion.estado || 'en_reparacion'}
                        </span>
                      </td>
                      <td>{reparacion.fecha_inicio ? new Date(reparacion.fecha_inicio).toLocaleDateString() : 'N/A'}</td>
                      <td>{diasEnReparacion}</td>
                      <td>
                        <div className="botones-accion">
                          <Link to={`/tecnico/reparaciones/${reparacion.id_reparacion}`} className="button azul-claro">
                            Ver Detalles
                          </Link>
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