const EstadisticasModel = require('../models/EstadisticasModel');

exports.getAllEstadisticas = async (req, res, next) => {
    try {
        const [estadisticas] = await EstadisticasModel.getAllEstadisticas();
        res.json(estadisticas);
    } catch (error) {
        next(error);
    }
};

exports.getEstadisticaById = async (req, res, next) => {
    try {
        const [estadistica] = await EstadisticasModel.getEstadisticaById(req.params.id);
        if (estadistica.length === 0) {
            return res.status(404).json({ message: 'Estadística not found' });
        }
        res.json(estadistica[0]);
    } catch (error) {
        next(error);
    }
};

exports.createEstadistica = async (req, res, next) => {
    try {
        const [result] = await EstadisticasModel.createEstadistica(req.body);
        res.status(201).json({ id_estadistica: result.insertId, ...req.body });
    } catch (error) {
        next(error);
    }
};

exports.updateEstadistica = async (req, res, next) => {
    try {
        const [result] = await EstadisticasModel.updateEstadistica(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estadística not found or no data changed' });
        }
        res.json({ message: 'Estadística updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteEstadistica = async (req, res, next) => {
    try {
        const [result] = await EstadisticasModel.deleteEstadistica(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estadística not found' });
        }
        res.json({ message: 'Estadística deleted successfully' });
    } catch (error) {
        next(error);
    }
};