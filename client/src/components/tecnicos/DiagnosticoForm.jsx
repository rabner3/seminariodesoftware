// client/src/components/tecnicos/DiagnosticoForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function DiagnosticoForm({ reparacionId, tecnicoId, diagnosticoId, onDiagnosticoCreado, onCancel }) {
    const [formData, setFormData] = useState({
        descripcion: '',
        causa_raiz: '',
        solucion_propuesta: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {

        if (diagnosticoId) {
            setIsEditing(true);
            cargarDiagnostico();
        }
    }, [diagnosticoId]);

    const cargarDiagnostico = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/diagnosticos/${diagnosticoId}`);
            const diagnostico = response.data;

            setFormData({
                descripcion: diagnostico.descripcion || '',
                causa_raiz: diagnostico.causa_raiz || '',
                solucion_propuesta: diagnostico.solucion_propuesta || ''
            });
        } catch (err) {
            setError(`Error al cargar el diagnóstico: ${err.message}`);
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

            const diagnosticoData = {
                id_reparacion: reparacionId,
                id_tecnico: tecnicoId,
                descripcion: formData.descripcion,
                causa_raiz: formData.causa_raiz,
                solucion_propuesta: formData.solucion_propuesta,
                fecha_diagnostico: new Date(),
                creado_por: usuario?.id_usuarios || null,
                fecha_creacion: new Date()
            };

            if (isEditing) {
                // Actualizar diagnóstico existente
                await axios.put(`http://localhost:8080/api/diagnosticos/${diagnosticoId}`, diagnosticoData);
            } else {
                // Crear nuevo diagnóstico
                await axios.post('http://localhost:8080/api/diagnosticos', diagnosticoData);

                // Si se crea un diagnóstico, actualizar el estado de la reparación
                await axios.put(`http://localhost:8080/api/reparaciones/${reparacionId}`, {
                    estado: 'en_reparacion'
                });
            }

            // Registrar bitácora de la acción
            await axios.post('http://localhost:8080/api/bitacoras-reparacion', {
                id_reparacion: reparacionId,
                id_tecnico: tecnicoId,
                tipo_accion: 'diagnostico',
                accion: isEditing ? 'Actualización de diagnóstico' : 'Creación de diagnóstico',
                descripcion: `${isEditing ? 'Actualización' : 'Registro'} de diagnóstico: ${formData.descripcion.substring(0, 50)}...`,
                fecha_accion: new Date(),
                creado_por: usuario?.id_usuarios || null,
                fecha_creacion: new Date()
            });

            onDiagnosticoCreado();
            setLoading(false);
        } catch (err) {
            setError(`Error al ${isEditing ? 'actualizar' : 'guardar'} el diagnóstico: ${err.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="diagnostico-form-container">
            <h3>{isEditing ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}</h3>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción del Problema:</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Describa en detalle el problema encontrado..."
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="causa_raiz">Causa Raíz:</label>
                    <textarea
                        id="causa_raiz"
                        name="causa_raiz"
                        value={formData.causa_raiz}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Identifique la causa principal del problema..."
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="solucion_propuesta">Solución Propuesta:</label>
                    <textarea
                        id="solucion_propuesta"
                        name="solucion_propuesta"
                        value={formData.solucion_propuesta}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Describa la solución recomendada..."
                        required
                    ></textarea>
                </div>

                <div className="form-buttons">
                    <button
                        type="submit"
                        className="button azul-claro"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : `${isEditing ? 'Actualizar' : 'Guardar'} Diagnóstico`}
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

export default DiagnosticoForm;