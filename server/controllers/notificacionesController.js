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
        const [result] = await NotificacionesModel.createNotificacion(req.body);
        res.status(201).json({ id_notificacion: result.insertId, ...req.body });
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