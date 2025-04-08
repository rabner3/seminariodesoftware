
import { useState, useEffect } from 'react';
import axios from 'axios';
import './EquipoStyles.css';

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
    
    
    const [asignarInmediatamente, setAsignarInmediatamente] = useState(false);
    const [asignacionData, setAsignacionData] = useState({
        id_usuario: '',
        motivo_asignacion: '',
    });
    
    const [departamentos, setDepartamentos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [asignacionExistente, setAsignacionExistente] = useState(null);

    useEffect(() => {
        
        if (equipo) {
            
            const formatearFecha = (fechaStr) => {
                if (!fechaStr) return '';
                
                const fecha = new Date(fechaStr);
                
                return fecha.toISOString().split('T')[0];
            };

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

            
            if (equipo.id_equipo) {
                verificarAsignacionExistente(equipo.id_equipo);
            }
        }

        fetchDepartamentos();
        fetchUsuarios();
    }, [equipo]);

    
    const verificarAsignacionExistente = async (equipoId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/asignaciones?id_equipo=${equipoId}&estado=activa`);
            if (response.data && response.data.length > 0) {
                setAsignacionExistente(response.data[0]);
            } else {
                setAsignacionExistente(null);
            }
        } catch (err) {
            console.error("Error al verificar asignación existente:", err);
        }
    };

    const fetchDepartamentos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/departamentos');
            setDepartamentos(response.data);
        } catch (err) {
            setError('Error al cargar departamentos: ' + err.message);
        }
    };

   
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/usuarios');
            setUsuarios(response.data);
        } catch (err) {
            setError('Error al cargar usuarios: ' + err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejador para los campos de asignación
    const handleAsignacionChange = (e) => {
        const { name, value } = e.target;
        setAsignacionData(prev => ({
            ...prev,
            [name]: value
        }));
    };

   
    const handleAsignarCheckbox = (e) => {
        const checked = e.target.checked;
        setAsignarInmediatamente(checked);
        
        if (checked) {
            setFormData(prev => ({
                ...prev,
                estado: 'asignado'
            }));
        } else {
            
            if (!equipo || equipo.estado !== 'asignado') {
                setFormData(prev => ({
                    ...prev,
                    estado: 'disponible'
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            
            const datosParaEnviar = { ...formData };
            
            let equipoGuardado;
            if (equipo) {
                
                const response = await axios.put(`http://localhost:8080/api/equipos/${equipo.id_equipo}`, datosParaEnviar);
                equipoGuardado = response.data;
            } else {
                
                const ultimoIdResponse = await axios.get('http://localhost:8080/api/equipos/ultimoId');
                const nuevoId = ultimoIdResponse.data.ultimoId + 1;
                
                
                datosParaEnviar.id_equipo = nuevoId;
                
                
                const response = await axios.post('http://localhost:8080/api/equipos', datosParaEnviar);
                equipoGuardado = response.data;
            }
            
            
            if (asignarInmediatamente && asignacionData.id_usuario) {
                const equipoId = equipo ? equipo.id_equipo : datosParaEnviar.id_equipo;
                
                
                const checkResponse = await axios.get(`http://localhost:8080/api/asignaciones?id_equipo=${equipoId}&estado=activa`);
                const asignacionesActivas = checkResponse.data;
                
                let procederConAsignacion = true;
                
                
                if (asignacionesActivas && asignacionesActivas.length > 0) {
                    const usuarioActual = asignacionesActivas[0];
                    let nombreUsuario = "otro usuario";
                    
                    
                    try {
                        const usuarioResponse = await axios.get(`http://localhost:8080/api/usuarios/${usuarioActual.id_usuario}`);
                        if (usuarioResponse.data) {
                            nombreUsuario = `${usuarioResponse.data.nombre} ${usuarioResponse.data.apellido}`;
                        }
                    } catch (err) {
                        console.error("Error al obtener información del usuario:", err);
                    }
                    
            
                    procederConAsignacion = window.confirm(
                        `Este equipo ya está asignado a ${nombreUsuario}. ¿Desea reasignarlo al nuevo usuario? La asignación anterior se marcará como inactiva.`
                    );
                    
                    
                    if (procederConAsignacion) {
                        for (const asignacion of asignacionesActivas) {
                            await axios.put(`http://localhost:8080/api/asignaciones/${asignacion.id_asignacion}`, {
                                estado: 'finalizada',
                                fecha_finalizacion: new Date().toISOString().slice(0, 19).replace('T', ' '),
                                motivo_finalizacion: 'Equipo reasignado a otro usuario'
                            });
                        }
                    }
                }
                
                
                if (procederConAsignacion) {
                    const fechaActual = new Date().toISOString().slice(0, 10);
                    
                    const asignacionNueva = {
                        id_equipo: equipoId,
                        id_usuario: asignacionData.id_usuario,
                        fecha_asignacion: fechaActual,
                        motivo_asignacion: asignacionData.motivo_asignacion || 'Asignación de equipo',
                        estado: 'activa',
                        creado_por: JSON.parse(localStorage.getItem('usuario'))?.id_usuarios || 1,
                        fecha_creacion: new Date().toISOString().slice(0, 19).replace('T', ' ')
                    };
                    
                   
                    await axios.post('http://localhost:8080/api/asignaciones', asignacionNueva);
                }
            }

            setLoading(false);
            
            onSave(equipoGuardado);
        } catch (err) {
            setError('Error al guardar el equipo: ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="container-widgets equipo-form-container">
            <h2 className="section-title">{equipo ? 'Editar Equipo' : 'Nuevo Equipo'}</h2>

            {error && (
                <div className="errors">
                    <p>{error}</p>
                </div>
            )}

            {asignacionExistente && (
                <div className="info-message">
                    <p>
                        <strong>Nota:</strong> Este equipo está actualmente asignado a un usuario. 
                        {asignacionExistente.nombre_usuario ? 
                            ` (${asignacionExistente.nombre_usuario} ${asignacionExistente.apellido_usuario})` : 
                            ''}
                    </p>
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
                            disabled={asignarInmediatamente}
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

                {/* Sección para asignación */}
                <div className="asignacion-section">
                    <div className="form-group">
                        <label className="asignacion-checkbox">
                            <input
                                type="checkbox"
                                checked={asignarInmediatamente}
                                onChange={handleAsignarCheckbox}
                            />
                            {equipo ? 'Asignar este equipo a un usuario' : 'Asignar este equipo inmediatamente a un usuario'}
                        </label>
                    </div>

                    {asignarInmediatamente && (
                        <div>
                            <div className="contenedor-columnas">
                                <div className="form-group form-items">
                                    <label className="form-label">Usuario:</label>
                                    <select
                                        className="form-select"
                                        name="id_usuario"
                                        value={asignacionData.id_usuario}
                                        onChange={handleAsignacionChange}
                                        required={asignarInmediatamente}
                                    >
                                        <option value="">Seleccione un usuario</option>
                                        {usuarios.map(usuario => (
                                            <option key={usuario.id_usuarios} value={usuario.id_usuarios}>
                                                {usuario.nombre} {usuario.apellido} ({usuario.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Motivo de la asignación:</label>
                                <textarea
                                    className="form-textarea"
                                    name="motivo_asignacion"
                                    value={asignacionData.motivo_asignacion}
                                    onChange={handleAsignacionChange}
                                    rows="2"
                                    placeholder="Ejemplo: Equipo nuevo para el área de..., Reemplazo de equipo anterior, etc."
                                    required={asignarInmediatamente}
                                ></textarea>
                            </div>
                        </div>
                    )}
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
