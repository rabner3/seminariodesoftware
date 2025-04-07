
const SolicitudesModel = require('../models/SolicitudesModel');

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
        const [result] = await SolicitudesModel.createSolicitud(req.body);
        res.status(201).json({ id_solicitud: result.insertId, ...req.body });
    } catch (error) {
        next(error);
    }
};

exports.updateSolicitud = async (req, res, next) => {
    try {
        const [result] = await SolicitudesModel.updateSolicitud(req.params.id, req.body);
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
