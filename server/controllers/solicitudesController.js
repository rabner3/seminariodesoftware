// server/controllers/solicitudesController.js
const SolicitudesModel = require('../models/SolicitudesModel');
const UsuariosModel = require('../models/UsuariosModel');
const db = require('../config/db'); 
const NotificacionesModel = require('../models/NotificacionesModel');

exports.getAllSolicitudes = async (req, res, next) => {
    try {
        const [solicitudes] = await SolicitudesModel.getAllSolicitudes();
        res.json(solicitudes);
    } catch (error) {
        next(error);
    }
};

exports.getSolicitudById = async (req, res, next) => {
    try {
        const [solicitud] = await SolicitudesModel.getSolicitudById(req.params.id);
        if (solicitud.length === 0) {
            return res.status(404).json({ message: 'Solicitud not found' });
        }
        res.json(solicitud[0]);
    } catch (error) {
        next(error);
    }
};

exports.getSolicitudesByUsuario = async (req, res, next) => {
    try {
        const [solicitudes] = await SolicitudesModel.getSolicitudesByUsuario(req.params.userId);
        res.json(solicitudes);
    } catch (error) {
        next(error);
    }
};

exports.createSolicitud = async (req, res, next) => {
    try {

        const solicitudData = { ...req.body };
        

        if (solicitudData.fecha_solicitud) {
            const fecha = new Date(solicitudData.fecha_solicitud);
            solicitudData.fecha_solicitud = fecha.toISOString().split('T')[0];
        } else {
            solicitudData.fecha_solicitud = new Date().toISOString().split('T')[0];
        }
        

        if (solicitudData.fecha_creacion) {
            const fecha = new Date(solicitudData.fecha_creacion);
            solicitudData.fecha_creacion = fecha.toISOString().split('T')[0];
        } else {
            solicitudData.fecha_creacion = new Date().toISOString().split('T')[0];
        }
        
        const [result] = await SolicitudesModel.createSolicitud(solicitudData);
        

        try {

            const [usuario] = await UsuariosModel.getUsuarioById(solicitudData.id_usuario);
            
            if (usuario.length > 0) {

                const [admins] = await db.query('SELECT * FROM usuarios WHERE rol = "admin"');
                
                for (const admin of admins) {
                    await NotificacionesModel.createNotificacion({
                        id_usuario_destino: admin.id_usuarios,
                        id_tecnico_destino: null,
                        tipo: 'solicitud',
                        titulo: 'Nueva solicitud de reparación',
                        mensaje: `${usuario[0].nombre} ${usuario[0].apellido} ha creado una nueva solicitud de reparación para su equipo.`,
                        fecha_envio: new Date(),
                        estado: 'pendiente',
                        id_referencia: result.insertId,
                        creado_por: solicitudData.id_usuario || usuario[0].id_usuarios
                    });
                }
            }
        } catch (notifError) {
            console.error('Error al enviar notificaciones:', notifError);

        }
        
        res.status(201).json({ id_solicitud: result.insertId, ...solicitudData });
    } catch (error) {
        next(error);
    }
};

exports.updateSolicitud = async (req, res, next) => {
    try {

        const solicitudData = { ...req.body };
        

        if (solicitudData.fecha_solicitud) {
            const fecha = new Date(solicitudData.fecha_solicitud);
            solicitudData.fecha_solicitud = fecha.toISOString().split('T')[0];
        }
        

        if (solicitudData.fecha_creacion) {
            const fecha = new Date(solicitudData.fecha_creacion);
            solicitudData.fecha_creacion = fecha.toISOString().split('T')[0];
        }
        

        if (solicitudData.fecha_cierre) {
            const fecha = new Date(solicitudData.fecha_cierre);
            solicitudData.fecha_cierre = fecha.toISOString().split('T')[0];
        }
        
        const [result] = await SolicitudesModel.updateSolicitud(req.params.id, solicitudData);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Solicitud not found or no data changed' });
        }
        res.json({ message: 'Solicitud updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteSolicitud = async (req, res, next) => {
    try {
        const [result] = await SolicitudesModel.deleteSolicitud(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Solicitud not found' });
        }
        res.json({ message: 'Solicitud deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.asignarReparacion = async (req, res, next) => {
    try {
        const { id_solicitud } = req.params;
        const { id_tecnico, observaciones } = req.body;
        
        if (!id_tecnico) {
            return res.status(400).json({ message: 'Se requiere id_tecnico' });
        }
        

        const [solicitudes] = await SolicitudesModel.getSolicitudById(id_solicitud);
        
        if (solicitudes.length === 0) {
            return res.status(404).json({ message: 'Solicitud not found' });
        }
        
        const solicitud = solicitudes[0];
        
        
        const reparacionData = {
            id_solicitud,
            id_equipo: solicitud.id_equipo,
            id_tecnico,
            fecha_recepcion: new Date().toISOString().split('T')[0],
            estado: 'pendiente',
            observaciones: observaciones || solicitud.descripcion,
            creado_por: req.body.creado_por
        };
        
        const [resultReparacion] = await ReparacionesModel.createReparacion(reparacionData);
        

        await SolicitudesModel.updateSolicitud(id_solicitud, {
            estado: 'asignada'
        });
        
    
        await EquiposModel.updateEquipo(solicitud.id_equipo, {
            estado: 'en_reparacion'
        });
        
     
        try {
  
            const [tecnicos] = await db.query('SELECT * FROM tecnicos WHERE id_tecnico = ?', [id_tecnico]);
            
            if (tecnicos.length > 0) {

                const [equipos] = await db.query('SELECT * FROM equipos WHERE id_equipo = ?', [solicitud.id_equipo]);
                
                const infoEquipo = equipos.length > 0 ? 
                    `${equipos[0].tipo} ${equipos[0].marca} ${equipos[0].modelo}` : 
                    `equipo #${solicitud.id_equipo}`;
                
                await NotificacionesModel.createNotificacion({
                    id_usuario_destino: null,
                    id_tecnico_destino: id_tecnico,
                    tipo: 'reparacion',
                    titulo: 'Nueva reparación asignada',
                    mensaje: `Se te ha asignado una nueva reparación para el ${infoEquipo}. Por favor revisa los detalles.`,
                    fecha_envio: new Date(),
                    estado: 'pendiente',
                    id_referencia: resultReparacion.insertId,
                    creado_por: req.body.creado_por
                });
            }
        } catch (notifError) {
            console.error('Error al enviar notificación al técnico:', notifError);

        }
        
        res.status(201).json({
            message: 'Reparación asignada correctamente',
            id_reparacion: resultReparacion.insertId
        });
    } catch (error) {
        next(error);
    }
};