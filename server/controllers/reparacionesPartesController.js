// server/controllers/reparacionesPartesController.js
const ReparacionesPartesModel = require('../models/ReparacionesPartesModel');

exports.getAllReparacionesPartes = async (req, res, next) => {
    try {
        const [partes] = await ReparacionesPartesModel.getAllReparacionesPartes();
        res.json(partes);
    } catch (error) {
        next(error);
    }
};

exports.getReparacionParteById = async (req, res, next) => {
    try {
        const [parte] = await ReparacionesPartesModel.getReparacionParteById(req.params.id);
        if (parte.length === 0) {
            return res.status(404).json({ message: 'Parte de reparación no encontrada' });
        }
        res.json(parte[0]);
    } catch (error) {
        next(error);
    }
};

exports.getReparacionesByReparacion = async (req, res, next) => {
    try {
        const [partes] = await ReparacionesPartesModel.getReparacionesByReparacion(req.params.id);
        res.json(partes);
    } catch (error) {
        next(error);
    }
};

exports.createReparacionParte = async (req, res, next) => {
    try {
        const [result] = await ReparacionesPartesModel.createReparacionParte(req.body);
        res.status(201).json({ id_reparacion_partes: result.insertId, ...req.body });
    } catch (error) {
        next(error);
    }
};

exports.updateReparacionParte = async (req, res, next) => {
    try {
        const [result] = await ReparacionesPartesModel.updateReparacionParte(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Parte de reparación no encontrada o sin cambios' });
        }
        res.json({ message: 'Parte de reparación actualizada correctamente' });
    } catch (error) {
        next(error);
    }
};

exports.deleteReparacionParte = async (req, res, next) => {
    try {
        const [result] = await ReparacionesPartesModel.deleteReparacionParte(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Parte de reparación no encontrada' });
        }
        res.json({ message: 'Parte de reparación eliminada correctamente' });
    } catch (error) {
        next(error);
    }
};