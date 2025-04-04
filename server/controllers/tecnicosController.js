
const TecnicosModel = require('../models/TecnicosModel');

exports.getAllTecnicos = async (req, res, next) => {
    try {
        const [tecnicos] = await TecnicosModel.getAllTecnicos();
        res.json(tecnicos);
    } catch (error) {
        next(error);
    }
};

exports.getTecnicoById = async (req, res, next) => {
    try {
        const [tecnico] = await TecnicosModel.getTecnicoById(req.params.id);
        if (tecnico.length === 0) {
            return res.status(404).json({ message: 'Técnico not found' });
        }
        res.json(tecnico[0]);
    } catch (error) {
        next(error);
    }
};

exports.createTecnico = async (req, res, next) => {
    try {
        const [result] = await TecnicosModel.createTecnico(req.body);
        res.status(201).json({ id_tecnico: result.insertId, ...req.body });
    } catch (error) {
        next(error);
    }
};

exports.updateTecnico = async (req, res, next) => {
    try {
        const [result] = await TecnicosModel.updateTecnico(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Técnico not found or no data changed' });
        }
        res.json({ message: 'Técnico updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteTecnico = async (req, res, next) => {
    try {
        const [result] = await TecnicosModel.deleteTecnico(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Técnico not found' });
        }
        res.json({ message: 'Técnico deleted successfully' });
    } catch (error) {
        next(error);
    }
};
