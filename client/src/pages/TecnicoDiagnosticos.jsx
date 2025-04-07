// client/src/pages/TecnicoDiagnosticos.jsx
import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import '../assets/tecnicos.css';

function TecnicoDiagnosticos() {
    const { setTitle } = useContext(TitleContext);
    const [diagnosticos, setDiagnosticos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroBusqueda, setFiltroBusqueda] = useState('');

    useEffect(() => {
        setTitle("MIS DIAGNÓSTICOS");
        cargarDiagnosticos();
    }, [setTitle]);

    const cargarDiagnosticos = async () => {
        try {
            setLoading(true);

            // Obtener ID del técnico basado en el usuario logueado
            const usuario = JSON.parse(localStorage.getItem('usuario'));

            if (!usuario || usuario.rol !== 'tecnico') {
                setError('No tiene permisos para acceder a esta página');
                setLoading(false);
                return;
            }

            // Obtener información del técnico
            const responseTecnico = await axios.get(`http://localhost:8080/api/tecnicos/usuario/${usuario.id_usuarios}`);

            if (!responseTecnico.data) {
                setError('No se encontró información del técnico asociado a su usuario');
                setLoading(false);
                return;
            }

            // Cargar diagnósticos del técnico
            const responseDiagnosticos = await axios.get(`http://localhost:8080/api/diagnosticos/tecnico/${responseTecnico.data.id_tecnico}`);
            setDiagnosticos(responseDiagnosticos.data);

            setLoading(false);
        } catch (err) {
            setError(`Error al cargar datos: ${err.message}`);
            setLoading(false);
        }
    };

    // Filtrar diagnósticos según la búsqueda
    const diagnosticosFiltrados = () => {
        if (filtroBusqueda.trim() === '') {
            return diagnosticos;
        }

        const busqueda = filtroBusqueda.toLowerCase();
        return diagnosticos.filter(diagnostico => {
            return (
                diagnostico.descripcion?.toLowerCase().includes(busqueda) ||
                diagnostico.causa_raiz?.toLowerCase().includes(busqueda) ||
                diagnostico.solucion_propuesta?.toLowerCase().includes(busqueda)
            );
        });
    };

    // Función para formatear fechas
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'N/A';
        return new Date(fechaStr).toLocaleDateString();
    };

    if (loading) return <div className="loading">Cargando diagnósticos...</div>;
    if (error) return <div className="error">{error}</div>;

    const diagnosticosMostrar = diagnosticosFiltrados();

    return (
        <div className="contenedor-padre" id="contenedor-padre">
            <div className="filtros-container container-widgets">
                <div className="filtros-header">
                    <h2>Mis Diagnósticos</h2>
                    <div className="contador-resultados">
                        {diagnosticosMostrar.length} {diagnosticosMostrar.length === 1 ? 'resultado' : 'resultados'}
                    </div>
                </div>

                <div className="filtros-content">
                    <div className="filtro-grupo">
                        <label>Buscar:</label>
                        <input
                            type="text"
                            placeholder="Buscar en descripción, causa o solución..."
                            value={filtroBusqueda}
                            onChange={(e) => setFiltroBusqueda(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container-widgets">
                {diagnosticosMostrar.length > 0 ? (
                    <div className="container-flow-table">
                        <table className="equipos-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Descripción</th>
                                    <th>Reparación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diagnosticosMostrar.map(diagnostico => (
                                    <tr key={diagnostico.id_diagnostico}>
                                        <td>{diagnostico.id_diagnostico}</td>
                                        <td>{formatearFecha(diagnostico.fecha_diagnostico)}</td>
                                        <td>{diagnostico.descripcion?.substring(0, 100)}...</td>
                                        <td>#{diagnostico.id_reparacion}</td>
                                        <td>
                                            <div className="botones-accion">
                                                <Link
                                                    to={`/tecnico/reparaciones/${diagnostico.id_reparacion}`}
                                                    className="button azul-claro"
                                                >
                                                    Ver Reparación
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-resultados">
                        <p>No se encontraron diagnósticos que coincidan con los filtros.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TecnicoDiagnosticos;