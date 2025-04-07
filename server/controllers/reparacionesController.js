// server/controllers/reparacionesController.js

const ReparacionesModel = require('../models/ReparacionesModel');

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
        // Formatear fechas correctamente antes de guardar
        const reparacionData = { ...req.body };
        
        // Convertir fecha_recepcion a formato YYYY-MM-DD
        if (reparacionData.fecha_recepcion) {
            const fecha = new Date(reparacionData.fecha_recepcion);
            reparacionData.fecha_recepcion = fecha.toISOString().split('T')[0];
        }
        
        // Convertir fecha_creacion a formato YYYY-MM-DD
        if (reparacionData.fecha_creacion) {
            const fecha = new Date(reparacionData.fecha_creacion);
            reparacionData.fecha_creacion = fecha.toISOString().split('T')[0];
        }
        
        // Crear la reparación
        const [result] = await ReparacionesModel.createReparacion(reparacionData);
        
        // Si la reparación está vinculada a una solicitud, actualizamos la solicitud
        if (reparacionData.id_solicitud) {
            try {
                // Optionally, update the related solicitud to link to this reparacion
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
                // No interrumpir el flujo principal si esto falla
            }
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
        // Formatear fechas correctamente antes de actualizar
        const reparacionData = { ...req.body };
        
        // Procesar campos de fecha si existen
        const camposFecha = ['fecha_recepcion', 'fecha_inicio', 'fecha_fin', 'fecha_creacion'];
        
        camposFecha.forEach(campo => {
            if (reparacionData[campo]) {
                const fecha = new Date(reparacionData[campo]);
                reparacionData[campo] = fecha.toISOString().split('T')[0];
            }
        });
        
        const [result] = await ReparacionesModel.updateReparacion(req.params.id, reparacionData);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reparación not found or no data changed' });
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