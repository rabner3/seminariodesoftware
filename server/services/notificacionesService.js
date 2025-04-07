// server/services/notificacionesService.js
const NotificacionesModel = require('../models/NotificacionesModel');

class NotificacionesService {
    // Cuando un usuario crea una solicitud, notificar al admin
    static async notificarNuevaSolicitud(solicitud, usuario) {
        try {
            // Obtener todos los usuarios administradores
            const db = require('../config/db');
            const [admins] = await db.query('SELECT id_usuarios FROM usuarios WHERE rol = "admin"');
            
            for (const admin of admins) {
                const notificacionData = {
                    id_usuario_destino: admin.id_usuarios,
                    id_tecnico_destino: null,
                    tipo: 'solicitud',
                    titulo: 'Nueva solicitud de reparación',
                    mensaje: `${usuario.nombre} ${usuario.apellido} ha creado una nueva solicitud para el equipo ${solicitud.id_equipo}`,
                    fecha_envio: new Date(),
                    estado: 'pendiente',
                    id_referencia: solicitud.id_solicitud,
                    creado_por: usuario.id_usuarios
                };
                
                await NotificacionesModel.createNotificacion(notificacionData);
            }
            
            return { success: true };
        } catch (error) {
            console.error('Error al notificar nueva solicitud:', error);
            return { success: false, error };
        }
    }
    
    // Cuando se asigna una reparación, notificar al técnico
    static async notificarAsignacionReparacion(reparacion, tecnico, solicitud) {
        try {
            const notificacionData = {
                id_usuario_destino: null,
                id_tecnico_destino: tecnico.id_tecnico,
                tipo: 'reparacion',
                titulo: 'Nueva reparación asignada',
                mensaje: `Se te ha asignado una nueva reparación para el equipo ${reparacion.id_equipo}`,
                fecha_envio: new Date(),
                estado: 'pendiente',
                id_referencia: reparacion.id_reparacion,
                creado_por: reparacion.creado_por
            };
            
            await NotificacionesModel.createNotificacion(notificacionData);
            
            return { success: true };
        } catch (error) {
            console.error('Error al notificar asignación de reparación:', error);
            return { success: false, error };
        }
    }
    
    // Cuando se completa una reparación, notificar al usuario
    static async notificarReparacionCompletada(reparacion, usuario) {
        try {
            const notificacionData = {
                id_usuario_destino: usuario.id_usuarios,
                id_tecnico_destino: null,
                tipo: 'reparacion',
                titulo: 'Reparación completada',
                mensaje: `La reparación de tu equipo ${reparacion.id_equipo} ha sido completada`,
                fecha_envio: new Date(),
                estado: 'pendiente',
                id_referencia: reparacion.id_reparacion,
                creado_por: reparacion.id_tecnico
            };
            
            await NotificacionesModel.createNotificacion(notificacionData);
            
            return { success: true };
        } catch (error) {
            console.error('Error al notificar reparación completada:', error);
            return { success: false, error };
        }
    }
}

module.exports = NotificacionesService;