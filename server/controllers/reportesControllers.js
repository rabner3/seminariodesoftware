const ReportesModel = require('../models/reportesModel');

exports.getAllReportes = async (req, res) => {
    try {
        const [reportes] = await ReportesModel.getAll();
        res.json(reportes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReporteById = async (req, res) => {
    try {
        const [reportes] = await ReportesModel.getReporteById(req.params.id);
        reportes.length === 0 
            ? res.status(404).json({ message: 'Reporte no encontrado' })
            : res.json(reportes[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createReporte = async (req, res) => {
    try {
        const [result] = await ReportesModel.create(req.body);
        const [reporte] = await ReportesModel.getReporteById(result.insertId);
        res.status(201).json(reporte[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Corregir nombre del método
exports.updateReporte = async (req, res) => {
    try {
        const [result] = await ReportesModel.update(req.params.id, req.body);
        result.affectedRows === 0
            ? res.status(404).json({ message: 'Reporte no encontrado' })
            : res.json({ message: 'Reporte actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Corregir nombre del método
exports.deleteReporte = async (req, res) => {
    try {
        const [result] = await ReportesModel.delete(req.params.id);
        result.affectedRows === 0
            ? res.status(404).json({ message: 'Reporte no encontrado' })
            : res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};