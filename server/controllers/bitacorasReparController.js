// server/controllers/bitacorasReparController.js
const BitacorasReparModel = require('../models/BitacorasReparModel');

exports.getAllBitacoras = async (req, res, next) => {
    try {
        let bitacoras;
        
        // Filtrar por id_reparacion si se proporciona
        if (req.query.id_reparacion) {
            const [filtradas] = await BitacorasReparModel.getBitacorasByReparacion(req.query.id_reparacion);
            bitacoras = filtradas;
        } 
        // Filtrar por id_tecnico si se proporciona
        else if (req.query.id_tecnico) {
            const [filtradas] = await BitacorasReparModel.getBitacorasByTecnico(req.query.id_tecnico);
            bitacoras = filtradas;
        }
        else {
            // Obtener todas las bitácoras si no hay filtro
            const [todas] = await BitacorasReparModel.getAllBitacoras();
            bitacoras = todas;
        }
        
        res.json(bitacoras);
    } catch (error) {
        next(error);
    }
};

exports.getBitacoraById = async (req, res, next) => {
    try {
        const [bitacora] = await BitacorasReparModel.getBitacoraById(req.params.id);
        if (bitacora.length === 0) {
            return res.status(404).json({ message: 'Bitácora de reparación no encontrada' });
        }
        res.json(bitacora[0]);
    } catch (error) {
        next(error);
    }
};

exports.createBitacora = async (req, res, next) => {
    try {
        // Validar campos requeridos
        if (!req.body.id_reparacion || !req.body.tipo_accion) {
            return res.status(400).json({ 
                message: 'Se requieren id_reparacion y tipo_accion para crear una bitácora' 
            });
        }
        
        // Establecer fecha_accion y fecha_creacion si no se proporcionan
        if (!req.body.fecha_accion) {
            req.body.fecha_accion = new Date();
        }
        
        if (!req.body.fecha_creacion) {
            req.body.fecha_creacion = new Date();
        }
        
        const [result] = await BitacorasReparModel.createBitacora(req.body);
        res.status(201).json({ 
            id_bitacora: result.insertId, 
            ...req.body,
            message: 'Bitácora de reparación creada exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

exports.updateBitacora = async (req, res, next) => {
    try {
        const [result] = await BitacorasReparModel.updateBitacora(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bitácora de reparación no encontrada o sin cambios' });
        }
        res.json({ 
            message: 'Bitácora de reparación actualizada exitosamente',
            id_bitacora: req.params.id
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteBitacora = async (req, res, next) => {
    try {
        const [result] = await BitacorasReparModel.deleteBitacora(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bitácora de reparación no encontrada' });
        }
        res.json({ 
            message: 'Bitácora de reparación eliminada exitosamente',
            id_bitacora: req.params.id
        });
    } catch (error) {
        next(error);
    }
};