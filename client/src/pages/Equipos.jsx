
import { useEffect, useContext, useState } from 'react';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import EquipoDetalle from '../components/equipos/EquipoDetalle';
import EquipoForm from '../components/equipos/EquipoForm';
import '../assets/equipos.css'; // Importamos los estilos

function Equipos() {
    const { setTitle } = useContext(TitleContext);
    const [equipos, setEquipos] = useState([]);
    const [equiposFiltrados, setEquiposFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');


    const [vista, setVista] = useState('lista'); 
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

    useEffect(() => {
        setTitle("EQUIPOS");
        fetchEquipos();
    }, [setTitle]);

    useEffect(() => {

        if (busqueda.trim() === '') {
            setEquiposFiltrados(equipos);
        } else {
            const textoBusqueda = busqueda.toLowerCase();
            const filtrados = equipos.filter(equipo =>
                equipo.tipo?.toLowerCase().includes(textoBusqueda) ||
                equipo.marca?.toLowerCase().includes(textoBusqueda) ||
                equipo.modelo?.toLowerCase().includes(textoBusqueda) ||
                equipo.numero_serie?.toLowerCase().includes(textoBusqueda) ||
                equipo.departamento_nombre?.toLowerCase().includes(textoBusqueda)
            );
            setEquiposFiltrados(filtrados);
        }
    }, [busqueda, equipos]);

    const fetchEquipos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/equipos');
            setEquipos(response.data);
            setEquiposFiltrados(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los equipos: ' + err.message);
            setLoading(false);
        }
    };

    // Función para obtener la clase CSS según el estado
    const getEstadoClass = (estado) => {
        switch (estado) {
            case 'disponible': return 'estado-badge estado-disponible';
            case 'asignado': return 'estado-badge estado-asignado';
            case 'en_reparacion': return 'estado-badge estado-en_reparacion';
            case 'descarte': return 'estado-badge estado-descarte';
            case 'baja': return 'estado-badge estado-baja';
            default: return 'estado-badge';
        }
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleVerEquipo = (id) => {
        setEquipoSeleccionado(id);
        setVista('detalle');
    };

    const handleEditarEquipo = (equipo) => {
        setEquipoSeleccionado(equipo);
        setVista('form');
    };

    const handleNuevoEquipo = () => {
        setEquipoSeleccionado(null);
        setVista('form');
    };

    const handleVolverLista = () => {
        setVista('lista');
        setEquipoSeleccionado(null);
    };

    const handleGuardarEquipo = () => {
        fetchEquipos();
        setVista('lista');
    };

    const handleEliminarEquipo = () => {
        fetchEquipos(); 
        setVista('lista');
    };


    if (vista === 'detalle' && equipoSeleccionado) {
        return (
            <div className="contenedor-padre" id="contenedor-padre">
                <EquipoDetalle
                    id={equipoSeleccionado}
                    onClose={handleVolverLista}
                    onEdit={handleEditarEquipo}
                    onDelete={handleEliminarEquipo}
                />
            </div>
        );
    }

    if (vista === 'form') {
        return (
            <div className="contenedor-padre" id="contenedor-padre">
                <EquipoForm
                    equipo={equipoSeleccionado}
                    onSave={handleGuardarEquipo}
                    onCancel={handleVolverLista}
                />
            </div>
        );
    }

    // Vista por defecto (lista)
    return (
        <div className="contenedor-padre" id="contenedor-padre">
            <div className="container-widgets">
                <div className="container-botones">
                    <button
                        className="button azul-claro"
                        onClick={handleNuevoEquipo}
                    >
                        Nuevo Equipo
                    </button>
                </div>

                <div className="search-container">
                    <h2 className="section-title">Listado de Equipos</h2>
                    <input
                        type="text"
                        placeholder="Buscar por tipo, marca, modelo, serie o departamento..."
                        className="search-input"
                        value={busqueda}
                        onChange={handleBusquedaChange}
                    />
                </div>

                {loading ? (
                    <p>Cargando equipos...</p>
                ) : error ? (
                    <div className="errors">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="container-flow-table">
                        <table className="equipos-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Serie</th>
                                    <th>Estado</th>
                                    <th>Departamento</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equiposFiltrados.length > 0 ? (
                                    equiposFiltrados.map(equipo => (
                                        <tr key={equipo.id_equipo}>
                                            <td>{equipo.id_equipo}</td>
                                            <td>{equipo.tipo}</td>
                                            <td>{equipo.marca}</td>
                                            <td>{equipo.modelo}</td>
                                            <td>{equipo.numero_serie}</td>
                                            <td>
                                                <span className={getEstadoClass(equipo.estado)}>
                                                    {equipo.estado}
                                                </span>
                                            </td>
                                            <td>{equipo.departamento_nombre || 'No asignado'}</td>
                                            <td>
                                                <div className="botones-accion">
                                                    <button
                                                        className="button azul-claro"
                                                        onClick={() => handleVerEquipo(equipo.id_equipo)}
                                                    >
                                                        Ver
                                                    </button>
                                                    <button
                                                        className="button azul-claro"
                                                        onClick={() => handleEditarEquipo(equipo)}
                                                    >
                                                        Editar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                            No hay equipos registrados o que coincidan con la búsqueda
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Equipos;