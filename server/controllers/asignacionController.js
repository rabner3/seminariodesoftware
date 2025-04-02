const AsignacionModel = require('../models/asignacionModel');

exports.getAllAsignaciones = async (req, res) => {
    try {
        const [asignaciones] = await AsignacionModel.getAllAsignaciones();
        res.json(asignaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAsignacionById = async (req, res) => {
    try {
        const [asignacion] = await AsignacionModel.getAsignacionById(req.params.id);
        if (!asignacion) return res.status(404).json({ message: 'Asignacion not found' });
        res.json(asignacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAsignacion = async (req, res) => {
    try {
        const [result] = await AsignacionModel.createAsignacion(req.body);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAsignacion = async (req, res) => {
    try {
        await AsignacionModel.updateAsignacion(req.params.id, req.body);
        res.json({ message: 'Asignacion updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAsignacion = async (req, res) => {
    try {
        await AsignacionModel.deleteAsignacion(req.params.id);
        res.json({ message: 'Asignacion deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};