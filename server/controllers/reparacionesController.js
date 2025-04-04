
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
        const [result] = await ReparacionesModel.createReparacion(req.body);
        res.status(201).json({ id_reparacion: result.insertId, ...req.body });
    } catch (error) {
        next(error);
    }
};

exports.updateReparacion = async (req, res, next) => {
    try {
        const [result] = await ReparacionesModel.updateReparacion(req.params.id, req.body);
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
