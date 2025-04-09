// server/controllers/bitacorasReparController.js
const BitacorasReparModel = require('../models/BitacorasReparModel');

exports.getAllBitacoras = async (req, res, next) => {
    try {
        let bitacoras;
        

        if (req.query.id_reparacion) {
            const [filtradas] = await BitacorasReparModel.getBitacorasByReparacion(req.query.id_reparacion);
            bitacoras = filtradas;
        } 

        else if (req.query.id_tecnico) {
            const [filtradas] = await BitacorasReparModel.getBitacorasByTecnico(req.query.id_tecnico);
            bitacoras = filtradas;
        }
        else {

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
        

        const tiposValidos = ['recepcion', 'diagnostico', 'reparacion', 'espera', 'prueba', 'entrega', 'otro'];
        if (!tiposValidos.includes(req.body.tipo_accion)) {
            return res.status(400).json({
                message: `Valor de tipo_accion no válido. Debe ser uno de: ${tiposValidos.join(', ')}`
            });
        }
        

        if (!req.body.fecha_accion) {
            const fechaActual = new Date();
            req.body.fecha_accion = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
        } else if (typeof req.body.fecha_accion === 'string' && req.body.fecha_accion.includes('T')) {
            // Si es una fecha en formato ISO, convertirla al formato de MySQL
            const fecha = new Date(req.body.fecha_accion);
            req.body.fecha_accion = fecha.toISOString().slice(0, 19).replace('T', ' ');
        }
        

        if (!req.body.fecha_creacion) {
            const fechaActual = new Date();
            req.body.fecha_creacion = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
        } else if (typeof req.body.fecha_creacion === 'string' && req.body.fecha_creacion.includes('T')) {

            const fecha = new Date(req.body.fecha_creacion);
            req.body.fecha_creacion = fecha.toISOString().slice(0, 19).replace('T', ' ');
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

        if (req.body.tipo_accion) {
            const tiposValidos = ['recepcion', 'diagnostico', 'reparacion', 'espera', 'prueba', 'entrega', 'otro'];
            if (!tiposValidos.includes(req.body.tipo_accion)) {
                return res.status(400).json({
                    message: `Valor de tipo_accion no válido. Debe ser uno de: ${tiposValidos.join(', ')}`
                });
            }
        }
        
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