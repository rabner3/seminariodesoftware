// server/controllers/bitacorasAsignController.js
const BitacorasAsignModel = require('../models/BitacorasAsignModel');

exports.getAllBitacoras = async (req, res, next) => {
    try {
        let bitacoras;
        
        // Filtrar por id_asignacion si se proporciona en la consulta
        if (req.query.id_asignacion) {
            const [filtradas] = await BitacorasAsignModel.getBitacorasByAsignacion(req.query.id_asignacion);
            bitacoras = filtradas;
        } else {
            // Obtener todas las bitácoras si no hay filtro
            const [todas] = await BitacorasAsignModel.getAllBitacoras();
            bitacoras = todas;
        }
        
        res.json(bitacoras);
    } catch (error) {
        next(error);
    }
};

exports.getBitacoraById = async (req, res, next) => {
    try {
        const [bitacora] = await BitacorasAsignModel.getBitacoraById(req.params.id);
        if (bitacora.length === 0) {
            return res.status(404).json({ message: 'Bitácora de asignación no encontrada' });
        }
        res.json(bitacora[0]);
    } catch (error) {
        next(error);
    }
};

exports.createBitacora = async (req, res, next) => {
    try {
        // Validar campos requeridos
        if (!req.body.id_asignacion || !req.body.accion) {
            return res.status(400).json({ 
                message: 'Se requieren id_asignacion y accion para crear una bitácora' 
            });
        }
        
        // Establecer fecha_accion si no se proporciona
        if (!req.body.fecha_accion) {
            req.body.fecha_accion = new Date();
        }
        
        const [result] = await BitacorasAsignModel.createBitacora(req.body);
        res.status(201).json({ 
            id_bitacora: result.insertId, 
            ...req.body,
            message: 'Bitácora de asignación creada exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

exports.updateBitacora = async (req, res, next) => {
    try {
        const [result] = await BitacorasAsignModel.updateBitacora(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bitácora de asignación no encontrada o sin cambios' });
        }
        res.json({ 
            message: 'Bitácora de asignación actualizada exitosamente',
            id_bitacora: req.params.id
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteBitacora = async (req, res, next) => {
    try {
        const [result] = await BitacorasAsignModel.deleteBitacora(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bitácora de asignación no encontrada' });
        }
        res.json({ 
            message: 'Bitácora de asignación eliminada exitosamente',
            id_bitacora: req.params.id
        });
    } catch (error) {
        next(error);
    }
};