// server/controllers/notificacionesController.js
const NotificacionesModel = require('../models/NotificacionesModel');

exports.getAllNotificaciones = async (req, res, next) => {
    try {
        const [notificaciones] = await NotificacionesModel.getAllNotificaciones();
        res.json(notificaciones);
    } catch (error) {
        next(error);
    }
};

exports.getNotificacionById = async (req, res, next) => {
    try {
        const [notificacion] = await NotificacionesModel.getNotificacionById(req.params.id);
        if (notificacion.length === 0) {
            return res.status(404).json({ message: 'Notificación not found' });
        }
        res.json(notificacion[0]);
    } catch (error) {
        next(error);
    }
};

exports.createNotificacion = async (req, res, next) => {
    try {
        const notificacionData = {
            ...req.body,
            fecha_envio: new Date(),
            estado: 'pendiente'
        };
        
        const [result] = await NotificacionesModel.createNotificacion(notificacionData);
        res.status(201).json({ id_notificacion: result.insertId, ...notificacionData });
    } catch (error) {
        next(error);
    }
};

exports.updateNotificacion = async (req, res, next) => {
    try {
        const [result] = await NotificacionesModel.updateNotificacion(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Notificación not found or no data changed' });
        }
        res.json({ message: 'Notificación updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteNotificacion = async (req, res, next) => {
    try {
        const [result] = await NotificacionesModel.deleteNotificacion(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Notificación not found' });
        }
        res.json({ message: 'Notificación deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Métodos adicionales
exports.getNotificacionesByUsuario = async (req, res, next) => {
    try {
        const [notificaciones] = await NotificacionesModel.getNotificacionesByUsuario(req.params.idUsuario);
        res.json(notificaciones);
    } catch (error) {
        next(error);
    }
};

exports.getNotificacionesByTecnico = async (req, res, next) => {
    try {
        const [notificaciones] = await NotificacionesModel.getNotificacionesByTecnico(req.params.idTecnico);
        res.json(notificaciones);
    } catch (error) {
        next(error);
    }
};

exports.marcarComoLeida = async (req, res, next) => {
    try {
        const [result] = await NotificacionesModel.marcarComoLeida(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Notificación not found' });
        }
        res.json({ message: 'Notificación marcada como leída' });
    } catch (error) {
        next(error);
    }
};

exports.getNotificacionesPendientes = async (req, res, next) => {
    try {
        const idUsuario = req.query.idUsuario;
        const idTecnico = req.query.idTecnico;
        
        if (!idUsuario && !idTecnico) {
            return res.status(400).json({ message: 'Se requiere idUsuario o idTecnico' });
        }
        
        const [notificaciones] = await NotificacionesModel.getNotificacionesPendientes(idUsuario, idTecnico);
        res.json(notificaciones);
    } catch (error) {
        next(error);
    }
};