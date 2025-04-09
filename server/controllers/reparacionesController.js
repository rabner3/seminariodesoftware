// server/controllers/reparacionesController.js
const ReparacionesModel = require('../models/ReparacionesModel');
const SolicitudesModel = require('../models/SolicitudesModel');
const UsuariosModel = require('../models/UsuariosModel');
const db = require('../config/db');
const NotificacionesModel = require('../models/NotificacionesModel');

exports.getAllReparaciones = async (req, res, next) => {
    try {
        const [reparaciones] = await ReparacionesModel.getAllReparaciones();
        res.json(reparaciones);
    } catch (error) {
        next(error);
    }
};

exports.getReparacionById = async (req, res, next) => {
    try {
        const [reparacion] = await ReparacionesModel.getReparacionById(req.params.id);
        if (reparacion.length === 0) {
            return res.status(404).json({ message: 'Reparación not found' });
        }
        res.json(reparacion[0]);
    } catch (error) {
        next(error);
    }
};

exports.createReparacion = async (req, res, next) => {
    try {

        const reparacionData = { ...req.body };
        

        if (reparacionData.fecha_recepcion) {
            const fecha = new Date(reparacionData.fecha_recepcion);
            reparacionData.fecha_recepcion = fecha.toISOString().split('T')[0];
        }
        

        if (reparacionData.fecha_creacion) {
            const fecha = new Date(reparacionData.fecha_creacion);
            reparacionData.fecha_creacion = fecha.toISOString().split('T')[0];
        }
        

        const [result] = await ReparacionesModel.createReparacion(reparacionData);
        

        if (reparacionData.id_solicitud) {
            try {

                const solicitudUpdate = {
                    id_reparacion: result.insertId,
                    estado: 'asignada'
                };
                
                await require('../models/SolicitudesModel').updateSolicitud(
                    reparacionData.id_solicitud, 
                    solicitudUpdate
                );
            } catch (err) {
                console.error('Error al actualizar solicitud vinculada:', err);

            }
        }
        
        try {
            const [tecnico] = await db.query('SELECT * FROM tecnicos WHERE id_tecnico = ?', [reparacionData.id_tecnico]);
            const [solicitud] = await db.query('SELECT * FROM solicitudes WHERE id_solicitud = ?', [reparacionData.id_solicitud]);
            
            if (tecnico.length > 0 && typeof NotificacionesService !== 'undefined') {
                await NotificacionesService.notificarAsignacionReparacion(
                    { id_reparacion: result.insertId, ...reparacionData },
                    tecnico[0],
                    solicitud[0]
                );
            }
        } catch (notifError) {
            console.error('Error al enviar notificación:', notifError);
        }
        
        res.status(201).json({ 
            id_reparacion: result.insertId, 
            ...reparacionData,
            message: 'Reparación creada exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

exports.updateReparacion = async (req, res, next) => {
    try {

        const reparacionData = { ...req.body };
        

        if (reparacionData.estado === 'completada' && !reparacionData.fecha_fin) {
            reparacionData.fecha_fin = new Date().toISOString().split('T')[0];

            if (reparacionData.estado === 'descarte' && !reparacionData.observaciones) {

                const observacionActual = reparacionesAnteriores[0].observaciones || '';
                reparacionData.observaciones = observacionActual 
                    ? `${observacionActual}\n[${new Date().toLocaleDateString()}] EQUIPO DESCARTADO.`
                    : `[${new Date().toLocaleDateString()}] EQUIPO DESCARTADO.`;
            }
            
 
            if (!reparacionData.tiempo_total) {
                try {
                    const [bitacoras] = await db.query(
                        'SELECT duracion_minutos FROM bitacoras_repar WHERE id_reparacion = ?',
                        [req.params.id]
                    );
                    
                    if (bitacoras && bitacoras.length > 0) {
                        const tiempoTotal = bitacoras.reduce((total, bitacora) => {
                            return total + (parseInt(bitacora.duracion_minutos) || 0);
                        }, 0);
                        
                        reparacionData.tiempo_total = tiempoTotal;
                    }
                } catch (error) {
                    console.error('Error al calcular tiempo total:', error);
                }
            }
        }
        

        const camposFecha = ['fecha_recepcion', 'fecha_inicio', 'fecha_fin', 'fecha_creacion'];
        
        camposFecha.forEach(campo => {
            if (reparacionData[campo]) {
                const fecha = new Date(reparacionData[campo]);
                reparacionData[campo] = fecha.toISOString().split('T')[0];
            }
        });

        if (reparacionData.estado === 'descarte') {
            try {

                const equipoId = reparacionesAnteriores[0].id_equipo;
                

                await db.query(
                    'UPDATE equipos SET estado = "descarte" WHERE id_equipo = ?',
                    [equipoId]
                );
            } catch (equipoError) {
                console.error('Error al actualizar estado del equipo:', equipoError);

            }
        }
        

        if (reparacionData.fecha_actualizacion) {
            delete reparacionData.fecha_actualizacion;
        }
        

        const [reparacionesAnteriores] = await ReparacionesModel.getReparacionById(req.params.id);
        if (reparacionesAnteriores.length === 0) {
            return res.status(404).json({ message: 'Reparación not found' });
        }
        const reparacionAnterior = reparacionesAnteriores[0];
        
        const [result] = await ReparacionesModel.updateReparacion(req.params.id, reparacionData);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reparación not found or no data changed' });
        }
        

        if (reparacionData.estado === 'completada' && reparacionAnterior.estado !== 'completada') {
            try {

                const [reparacionActualizada] = await ReparacionesModel.getReparacionById(req.params.id);
                
                if (reparacionActualizada.length > 0) {

                    if (reparacionActualizada[0].id_solicitud) {
                        const [solicitudes] = await db.query(
                            'SELECT * FROM solicitudes WHERE id_solicitud = ?', 
                            [reparacionActualizada[0].id_solicitud]
                        );
                        
                        if (solicitudes.length > 0) {

                            const [equipos] = await db.query(
                                'SELECT * FROM equipos WHERE id_equipo = ?',
                                [reparacionActualizada[0].id_equipo]
                            );
                            
                            const infoEquipo = equipos.length > 0 ? 
                                `${equipos[0].tipo} ${equipos[0].marca} ${equipos[0].modelo}` : 
                                `equipo #${reparacionActualizada[0].id_equipo}`;
                            

                            await NotificacionesModel.createNotificacion({
                                id_usuario_destino: solicitudes[0].id_usuario,
                                id_tecnico_destino: null,
                                tipo: 'reparacion',
                                titulo: 'Reparación completada',
                                mensaje: `La reparación de tu ${infoEquipo} ha sido completada. Ya puedes recogerlo.`,
                                fecha_envio: new Date(),
                                estado: 'pendiente',
                                id_referencia: reparacionActualizada[0].id_reparacion,
                                creado_por: reparacionActualizada[0].id_tecnico || req.body.id_tecnico
                            });
                            

                            if (reparacionActualizada[0].id_tecnico && req.body.creado_por !== reparacionActualizada[0].id_tecnico) {
                                await NotificacionesModel.createNotificacion({
                                    id_usuario_destino: null,
                                    id_tecnico_destino: reparacionActualizada[0].id_tecnico,
                                    tipo: 'reparacion',
                                    titulo: 'Reparación marcada como completada',
                                    mensaje: `La reparación del ${infoEquipo} ha sido marcada como completada.`,
                                    fecha_envio: new Date(),
                                    estado: 'pendiente',
                                    id_referencia: reparacionActualizada[0].id_reparacion,
                                    creado_por: req.body.creado_por
                                });
                            }
                        }
                    }
                }
            } catch (notifError) {
                console.error('Error al enviar notificación de reparación completada:', notifError);

            }
        }
        
        res.json({ message: 'Reparación updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteReparacion = async (req, res, next) => {
    try {
        const [result] = await ReparacionesModel.deleteReparacion(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reparación not found' });
        }
        res.json({ message: 'Reparación deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getReparacionesByTecnico = async (req, res, next) => {
    try {
        const [reparaciones] = await ReparacionesModel.getReparacionesByTecnico(req.params.id);
        res.json(reparaciones);
    } catch (error) {
        next(error);
    }
};