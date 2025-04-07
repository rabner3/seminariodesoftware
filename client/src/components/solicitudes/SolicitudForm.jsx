import { useState, useEffect } from 'react';
import axios from 'axios';

function SolicitudForm({ solicitud, equipoId, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        tipo: 'soporte',
        descripcion: '',
        urgencia: 'media',
        id_equipo: ''
    });
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si estamos editando una solicitud existente
        if (solicitud) {
            setFormData({
                tipo: solicitud.tipo || 'soporte',
                descripcion: solicitud.descripcion || '',
                urgencia: solicitud.urgencia || 'media',
                id_equipo: solicitud.id_equipo || ''
            });
        }
        // Si se proporciona un ID de equipo como parámetro
        else if (equipoId) {
            setFormData(prev => ({
                ...prev,
                id_equipo: equipoId
            }));
        }

        cargarEquiposDelUsuario();
    }, [solicitud, equipoId]);


    const cargarEquiposDelUsuario = async () => {
        try {
            const usuario = JSON.parse(localStorage.getItem('usuario'));

            if (!usuario) {
                setError('Debe iniciar sesión para crear una solicitud');
                return;
            }

            // Obtener equipos asignados al usuario
            const response = await axios.get(`http://localhost:8080/api/asignaciones?id_usuario=${usuario.id_usuarios}&estado=activa`);

            // Extraer los IDs de equipos y cargar sus detalles
            const idsEquipos = response.data.map(asignacion => asignacion.id_equipo);

            if (idsEquipos.length === 0) {
                setError('No tiene equipos asignados para solicitar reparación');
                return;
            }

            // Obtener detalles de los equipos
            const equiposResponse = await axios.get('http://localhost:8080/api/equipos');
            const equiposAsignados = equiposResponse.data.filter(equipo =>
                idsEquipos.includes(equipo.id_equipo)
            );

            setEquipos(equiposAsignados);
        } catch (err) {
            setError(`Error al cargar equipos: ${err.message}`);
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
            const usuario = JSON.parse(localStorage.getItem('usuario'));

            if (!usuario) {
                throw new Error('Debe iniciar sesión para crear una solicitud');
            }

            const solicitudData = {
                ...formData,
                id_usuario: usuario.id_usuarios,
                fecha_solicitud: new Date().toISOString(),
                estado: 'pendiente',
                creado_por: usuario.id_usuarios,
                fecha_creacion: new Date().toISOString()
            };

            let response;

            if (solicitud) {
                // Actualizar solicitud existente
                response = await axios.put(`http://localhost:8080/api/solicitudes/${solicitud.id_solicitud}`, solicitudData);
            } else {
                // Crear nueva solicitud
                response = await axios.post('http://localhost:8080/api/solicitudes', solicitudData);
            }

            setLoading(false);
            onSave(response.data);
        } catch (err) {
            setError(`Error al guardar la solicitud: ${err.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="container-widgets">
            <h2 className="section-title">
                {solicitud ? 'Editar Solicitud' : 'Nueva Solicitud de Reparación'}
            </h2>

            {error && (
                <div className="errors">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Tipo de Solicitud:</label>
                    <select
                        className="form-select"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                    >
                        <option value="soporte">Soporte Técnico</option>
                        <option value="reparacion">Reparación</option>
                        <option value="mantenimiento">Mantenimiento</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Equipo:</label>
                    <select
                        className="form-select"
                        name="id_equipo"
                        value={formData.id_equipo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un equipo</option>
                        {equipos.map(equipo => (
                            <option key={equipo.id_equipo} value={equipo.id_equipo}>
                                {equipo.tipo} {equipo.marca} {equipo.modelo} (S/N: {equipo.numero_serie})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Urgencia:</label>
                    <select
                        className="form-select"
                        name="urgencia"
                        value={formData.urgencia}
                        onChange={handleChange}
                        required
                    >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="critica">Crítica</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Descripción del Problema:</label>
                    <textarea
                        className="form-textarea"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Describa detalladamente el problema que presenta el equipo..."
                        required
                    ></textarea>
                </div>

                <div className="container-botones">
                    <button
                        type="submit"
                        className="button azul-claro"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Enviar Solicitud'}
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

export default SolicitudForm;