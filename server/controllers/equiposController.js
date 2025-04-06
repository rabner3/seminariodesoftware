// server/controllers/equiposController.js
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
exports.getEquiposByDepartamento = async (req, res, next) => {
    try {
        const [equipos] = await EquiposModel.getEquiposByDepartamento(req.params.id_departamento);
        res.json(equipos);
    } catch (error) {
        next(error);
    }
};


exports.getUltimoId = async (req, res, next) => {
    try {
        const [resultado] = await EquiposModel.getUltimoId();
        const ultimoId = resultado[0]?.max_id || 1000; // Si no hay equipos, comenzar en 1000
        res.json({ ultimoId });
    } catch (error) {
        next(error);
    }
};

exports.createEquipo = async (req, res, next) => {
    try {
        const [result] = await EquiposModel.createEquipo(req.body);
        res.status(201).json({ id_equipo: req.body.id_equipo, ...req.body });
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