
const PartesModel = require('../models/PartesModel');

exports.getAllPartes = async (req, res, next) => {
    try {
        const [partes] = await PartesModel.getAllPartes();
        res.json(partes);
    } catch (error) {
        next(error);
    }
};

exports.getParteById = async (req, res, next) => {
    try {
        const [parte] = await PartesModel.getParteById(req.params.id);
        if (parte.length === 0) {
            return res.status(404).json({ message: 'Parte not found' });
        }
        res.json(parte[0]);
    } catch (error) {
        next(error);
    }
};

exports.createParte = async (req, res, next) => {
    try {
        const [result] = await PartesModel.createParte(req.body);
        res.status(201).json({ id_parte: result.insertId, ...req.body });
    } catch (error) {
        next(error);
    }
};

exports.updateParte = async (req, res, next) => {
    try {
        const [result] = await PartesModel.updateParte(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Parte not found or no data changed' });
        }
        res.json({ message: 'Parte updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteParte = async (req, res, next) => {
    try {
        const [result] = await PartesModel.deleteParte(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Parte not found' });
        }
        res.json({ message: 'Parte deleted successfully' });
    } catch (error) {
        next(error);
    }
};
