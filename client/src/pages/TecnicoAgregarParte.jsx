
import { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TitleContext } from '../context/TitleContext';
import axios from 'axios';
import '../assets/tecnicos.css';

function TecnicoAgregarParte() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle } = useContext(TitleContext);
    const [reparacion, setReparacion] = useState(null);
    const [partes, setPartes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        id_parte: '',
        cantidad: 1,
        costo_unitario: 0,
        observaciones: ''
    });

    useEffect(() => {
        setTitle("AGREGAR PARTE");
        cargarDatos();
    }, [id, setTitle]);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            const responseReparacion = await axios.get(`http://localhost:8080/api/reparaciones/${id}`);
            setReparacion(responseReparacion.data);


            const responsePartes = await axios.get('http://localhost:8080/api/partes');
            setPartes(responsePartes.data);

            setLoading(false);
        } catch (err) {
            setError(`Error al cargar datos: ${err.message}`);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));


        if (name === 'id_parte') {
            const parteSeleccionada = partes.find(p => p.id_parte === parseInt(value));
            if (parteSeleccionada) {
                setFormData(prev => ({
                    ...prev,
                    costo_unitario: parteSeleccionada.costo_unitario || 0
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

            const usuario = JSON.parse(localStorage.getItem('usuario'));


            const parteData = {
                id_reparacion: parseInt(id),
                id_parte: parseInt(formData.id_parte),
                cantidad: parseInt(formData.cantidad),
                costo_unitario: parseFloat(formData.costo_unitario),
                observaciones: formData.observaciones,
                creado_por: usuario?.id_usuarios || null,
                fecha_creacion: new Date()
            };

            await axios.post('http://localhost:8080/api/reparaciones-partes', parteData);


            const parteSeleccionada = partes.find(p => p.id_parte === parseInt(formData.id_parte));

            await axios.post('http://localhost:8080/api/bitacoras-reparacion', {
                id_reparacion: parseInt(id),
                id_tecnico: reparacion.id_tecnico,
                tipo_accion: 'reparacion',
                accion: `Añadido repuesto: ${parteSeleccionada?.nombre || 'Parte'}`,
                descripcion: `Se agregó ${formData.cantidad} unidad(es) de ${parteSeleccionada?.nombre || 'parte'} a la reparación. ${formData.observaciones}`,
                fecha_accion: new Date(),
                creado_por: usuario?.id_usuarios || null,
                fecha_creacion: new Date()
            });

            const responsePartes = await axios.get(`http://localhost:8080/api/reparaciones-partes/reparacion/${id}`);
            const costoTotal = responsePartes.data.reduce((total, parte) => {
                return total + (parte.cantidad * parte.costo_unitario);
            }, 0);

            await axios.put(`http://localhost:8080/api/reparaciones/${id}`, {
                costo_estimado: costoTotal
            });

            setLoading(false);
            navigate(`/tecnico/reparaciones/${id}`);
        } catch (err) {
            setError(`Error al agregar parte: ${err.message}`);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Cargando datos...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!reparacion) return <div className="error">No se encontró la reparación</div>;

    return (
        <div className="contenedor-padre" id="contenedor-padre">
            <div className="container-widgets">
                <div className="form-header">
                    <h2>Agregar Parte a Reparación #{reparacion.id_reparacion}</h2>
                    <button
                        onClick={() => navigate(`/tecnico/reparaciones/${id}`)}
                        className="button"
                    >
                        Volver
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="parte-form">
                    <div className="form-group">
                        <label htmlFor="id_parte">Parte/Repuesto:</label>
                        <select
                            id="id_parte"
                            name="id_parte"
                            value={formData.id_parte}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una parte</option>
                            {partes.map(parte => (
                                <option key={parte.id_parte} value={parte.id_parte}>
                                    {parte.nombre} - Disponibles: {parte.cantidad || 0}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cantidad">Cantidad:</label>
                            <input
                                type="number"
                                id="cantidad"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="costo_unitario">Costo Unitario ($):</label>
                            <input
                                type="number"
                                id="costo_unitario"
                                name="costo_unitario"
                                value={formData.costo_unitario}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="observaciones">Observaciones:</label>
                        <textarea
                            id="observaciones"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Notas adicionales sobre la parte utilizada..."
                        ></textarea>
                    </div>

                    <div className="form-buttons">
                        <button
                            type="submit"
                            className="button azul-claro"
                            disabled={loading}
                        >
                            {loading ? 'Agregando...' : 'Agregar Parte'}
                        </button>
                        <button
                            type="button"
                            className="button"
                            onClick={() => navigate(`/tecnico/reparaciones/${id}`)}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TecnicoAgregarParte;