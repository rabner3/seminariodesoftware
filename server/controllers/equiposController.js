
const EquiposModel = require('../models/EquiposModel');

exports.getAllEquipos = async (req, res, next) => {
    try {
        const [equipos] = await EquiposModel.getAllEquipos();
        res.json(equipos);
    } catch (error) {
        next(error);
    }
};

exports.getEquipoById = async (req, res, next) => {
    try {
        const [equipo] = await EquiposModel.getEquipoById(req.params.id);
        if (equipo.length === 0) {
            return res.status(404).json({ message: 'Equipo not found' });
        }
        res.json(equipo[0]);
    } catch (error) {
        next(error);
    }
};

exports.createEquipo = async (req, res, next) => {
    try {
        const [result] = await EquiposModel.createEquipo(req.body);
        res.status(201).json({ id_equipo: result.insertId, ...req.body });
    } catch (error) {
        next(error);
    }
};

exports.updateEquipo = async (req, res, next) => {
    try {
        const [result] = await EquiposModel.updateEquipo(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Equipo not found or no data changed' });
        }
        res.json({ message: 'Equipo updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteEquipo = async (req, res, next) => {
    try {
        const [result] = await EquiposModel.deleteEquipo(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Equipo not found' });
        }
        res.json({ message: 'Equipo deleted successfully' });
    } catch (error) {
        next(error);
    }
};
