// client/src/components/tecnicos/BitacoraForm.jsx
import { useState } from 'react';
import axios from 'axios';

function BitacoraForm({ reparacionId, tecnicoId, onBitacoraCreada, onCancel }) {
    const [formData, setFormData] = useState({
        tipo_accion: 'reparacion',
        accion: '',
        descripcion: '',
        duracion_minutos: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // client/src/components/tecnicos/BitacoraForm.jsx (continuación)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Obtener el usuario actual del localStorage
            const usuario = JSON.parse(localStorage.getItem('usuario'));

            // Crear objeto con los datos de la bitácora
            const bitacoraData = {
                id_reparacion: reparacionId,
                id_tecnico: tecnicoId,
                tipo_accion: formData.tipo_accion,
                accion: formData.accion,
                descripcion: formData.descripcion,
                fecha_accion: new Date(),
                duracion_minutos: parseInt(formData.duracion_minutos) || 0,
                creado_por: usuario?.id_usuarios || null,
                fecha_creacion: new Date()
            };

            // Enviar a la API
            await axios.post('http://localhost:8080/api/bitacoras-reparacion', bitacoraData);

            // Notificar al componente padre
            onBitacoraCreada();
            setLoading(false);
        } catch (err) {
            setError(`Error al guardar la bitácora: ${err.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="bitacora-form-container">
            <h3>Registrar Nueva Actividad</h3>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="tipo_accion">Tipo de Acción:</label>
                    <select
                        id="tipo_accion"
                        name="tipo_accion"
                        value={formData.tipo_accion}
                        onChange={handleChange}
                        required
                    >
                        <option value="recepcion">Recepción</option>
                        <option value="diagnostico">Diagnóstico</option>
                        <option value="reparacion">Reparación</option>
                        <option value="espera">En Espera</option>
                        <option value="prueba">Prueba</option>
                        <option value="entrega">Entrega</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="accion">Acción Realizada:</label>
                    <input
                        type="text"
                        id="accion"
                        name="accion"
                        value={formData.accion}
                        onChange={handleChange}
                        placeholder="Ej: Reemplazo de memoria RAM"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Describa en detalle la actividad realizada..."
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="duracion_minutos">Duración (minutos):</label>
                    <input
                        type="number"
                        id="duracion_minutos"
                        name="duracion_minutos"
                        value={formData.duracion_minutos}
                        onChange={handleChange}
                        min="1"
                        placeholder="Tiempo invertido en minutos"
                    />
                </div>

                <div className="form-buttons">
                    <button
                        type="submit"
                        className="button azul-claro"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar Actividad'}
                    </button>
                    <button
                        type="button"
                        className="button"
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

export default BitacoraForm;