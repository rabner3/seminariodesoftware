// server/controllers/solicitudesController.js
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
        // Formatear las fechas correctamente para MySQL
        const solicitudData = { ...req.body };
        
        // Convertir fecha_solicitud a formato YYYY-MM-DD
        if (solicitudData.fecha_solicitud) {
            const fecha = new Date(solicitudData.fecha_solicitud);
            solicitudData.fecha_solicitud = fecha.toISOString().split('T')[0];
        } else {
            solicitudData.fecha_solicitud = new Date().toISOString().split('T')[0];
        }
        
        // Convertir fecha_creacion a formato YYYY-MM-DD
        if (solicitudData.fecha_creacion) {
            const fecha = new Date(solicitudData.fecha_creacion);
            solicitudData.fecha_creacion = fecha.toISOString().split('T')[0];
        } else {
            solicitudData.fecha_creacion = new Date().toISOString().split('T')[0];
        }
        
        const [result] = await SolicitudesModel.createSolicitud(solicitudData);
        res.status(201).json({ id_solicitud: result.insertId, ...solicitudData });
    } catch (error) {
        next(error);
    }
};

exports.updateSolicitud = async (req, res, next) => {
    try {
        // Formatear las fechas correctamente para MySQL
        const solicitudData = { ...req.body };
        
        // Convertir fecha_solicitud a formato YYYY-MM-DD si existe
        if (solicitudData.fecha_solicitud) {
            const fecha = new Date(solicitudData.fecha_solicitud);
            solicitudData.fecha_solicitud = fecha.toISOString().split('T')[0];
        }
        
        // Convertir fecha_creacion a formato YYYY-MM-DD si existe
        if (solicitudData.fecha_creacion) {
            const fecha = new Date(solicitudData.fecha_creacion);
            solicitudData.fecha_creacion = fecha.toISOString().split('T')[0];
        }
        
        // Convertir fecha_cierre a formato YYYY-MM-DD si existe
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