// client/src/components/equipos/EquipoForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function EquipoForm({ equipo, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        tipo: '',
        marca: '',
        modelo: '',
        numero_serie: '',
        procesador: '',
        ram: '',
        almacenamiento: '',
        sistema_operativo: '',
        fecha_compra: '',
        garantia_hasta: '',
        id_departamento: '',
        estado: 'disponible',
        observaciones: ''
    });
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si tenemos un equipo para editar, actualizamos el formData
        if (equipo) {
            // Formateamos las fechas para el input type="date"
            const formatearFecha = (fechaStr) => {
                if (!fechaStr) return '';
                // Convertir a objeto Date
                const fecha = new Date(fechaStr);
                // Formatear a YYYY-MM-DD que es el formato que acepta input type="date"
                return fecha.toISOString().split('T')[0];
            };

            console.log("Fechas originales:", {
                fecha_compra: equipo.fecha_compra,
                garantia_hasta: equipo.garantia_hasta
            });

            setFormData({
                tipo: equipo.tipo || '',
                marca: equipo.marca || '',
                modelo: equipo.modelo || '',
                numero_serie: equipo.numero_serie || '',
                procesador: equipo.procesador || '',
                ram: equipo.ram || '',
                almacenamiento: equipo.almacenamiento || '',
                sistema_operativo: equipo.sistema_operativo || '',
                fecha_compra: formatearFecha(equipo.fecha_compra),
                garantia_hasta: formatearFecha(equipo.garantia_hasta),
                id_departamento: equipo.id_departamento || '',
                estado: equipo.estado || 'disponible',
                observaciones: equipo.observaciones || ''
            });
        }

        // Cargar los departamentos para el select
        fetchDepartamentos();
    }, [equipo]);

    const fetchDepartamentos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/departamentos');
            setDepartamentos(response.data);
        } catch (err) {
            setError('Error al cargar departamentos: ' + err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Copia los datos del formulario para no modificar el estado directamente
            const datosParaEnviar = { ...formData };
            
            let response;
            if (equipo) {
                // Actualizar equipo existente
                response = await axios.put(`http://localhost:8080/api/equipos/${equipo.id_equipo}`, datosParaEnviar);
            } else {
                // Para crear un nuevo equipo, necesitamos obtener un ID
                // Primero obtenemos el último ID de equipo
                const ultimoIdResponse = await axios.get('http://localhost:8080/api/equipos/ultimoId');
                const nuevoId = ultimoIdResponse.data.ultimoId + 1;
                
                // Agregar el ID al objeto de datos
                datosParaEnviar.id_equipo = nuevoId;
                
                // Crear nuevo equipo
                response = await axios.post('http://localhost:8080/api/equipos', datosParaEnviar);
            }

            setLoading(false);
            // Llamar a la función de callback con los datos guardados
            onSave(response.data);
        } catch (err) {
            setError('Error al guardar el equipo: ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="container-widgets form-container">
            <h2 className="section-title">{equipo ? 'Editar Equipo' : 'Nuevo Equipo'}</h2>

            {error && (
                <div className="errors">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="contenedor-columnas">
                    <div className="form-group form-items">
                        <label className="form-label">Tipo:</label>
                        <select
                            className="form-select"
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un tipo</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Desktop">Desktop</option>
                            <option value="Impresora">Impresora</option>
                            <option value="Monitor">Monitor</option>
                            <option value="Tablet">Tablet</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">Marca:</label>
                        <input
                            type="text"
                            className="form-input"
                            name="marca"
                            value={formData.marca}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">Modelo:</label>
                        <input
                            type="text"
                            className="form-input"
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-group form-items">
                        <label className="form-label">Número de Serie:</label>
                        <input
                            type="text"
                            className="form-input"
                            name="numero_serie"
                            value={formData.numero_serie}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">Procesador:</label>
                        <input
                            type="text"
                            className="form-input"
                            name="procesador"
                            value={formData.procesador}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">RAM:</label>
                        <input
                            type="text"
                            className="form-input"
                            name="ram"
                            value={formData.ram}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-group form-items">
                        <label className="form-label">Almacenamiento:</label>
                        <input
                            type="text"
                            className="form-input"
                            name="almacenamiento"
                            value={formData.almacenamiento}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">Sistema Operativo:</label>
                        <input
                            type="text"
                            className="form-input"
                            name="sistema_operativo"
                            value={formData.sistema_operativo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">Departamento:</label>
                        <select
                            className="form-select"
                            name="id_departamento"
                            value={formData.id_departamento}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione un departamento</option>
                            {departamentos.map(depto => (
                                <option key={depto.id_departamento} value={depto.id_departamento}>
                                    {depto.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="contenedor-columnas">
                    <div className="form-group form-items">
                        <label className="form-label">Fecha de Compra:</label>
                        <input
                            type="date"
                            className="form-input"
                            name="fecha_compra"
                            value={formData.fecha_compra}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">Garantía Hasta:</label>
                        <input
                            type="date"
                            className="form-input"
                            name="garantia_hasta"
                            value={formData.garantia_hasta}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group form-items">
                        <label className="form-label">Estado:</label>
                        <select
                            className="form-select"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            required
                        >
                            <option value="disponible">Disponible</option>
                            <option value="asignado">Asignado</option>
                            <option value="en_reparacion">En Reparación</option>
                            <option value="descarte">Descarte</option>
                            <option value="baja">Baja</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Observaciones:</label>
                    <textarea
                        className="form-textarea"
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        rows="3"
                    ></textarea>
                </div>

                <div className="container-botones">
                    <button
                        type="submit"
                        className="button azul-claro"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                        type="button"
                        className="button rojo-suave"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EquipoForm;