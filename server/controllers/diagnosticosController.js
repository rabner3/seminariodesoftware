
const DiagnosticosModel = require('../models/DiagnosticosModel');

exports.getAllDiagnosticos = async (req, res, next) => {
    try {
        const [diagnosticos] = await DiagnosticosModel.getAllDiagnosticos();
        res.json(diagnosticos);
    } catch (error) {
        next(error);
    }
};

exports.getDiagnosticoById = async (req, res, next) => {
    try {
        const [diagnostico] = await DiagnosticosModel.getDiagnosticoById(req.params.id);
        if (diagnostico.length === 0) {
            return res.status(404).json({ message: 'Diagnóstico not found' });
        }
        res.json(diagnostico[0]);
    } catch (error) {
        next(error);
    }
};

exports.getDiagnosticosByReparacion = async (req, res, next) => {
    try {
        const [diagnosticos] = await DiagnosticosModel.getDiagnosticosByReparacion(req.params.id);
        res.json(diagnosticos);
    } catch (error) {
        next(error);
    }
};

exports.getDiagnosticosByTecnico = async (req, res, next) => {
    try {
        const [diagnosticos] = await DiagnosticosModel.getDiagnosticosByTecnico(req.params.id);
        res.json(diagnosticos);
    } catch (error) {
        next(error);
    }
};

exports.createDiagnostico = async (req, res, next) => {
    try {
        const [result] = await DiagnosticosModel.createDiagnostico(req.body);
        res.status(201).json({ id_diagnostico: result.insertId, ...req.body });
    } catch (error) {
        next(error);
    }
};

exports.updateDiagnostico = async (req, res, next) => {
    try {
        const [result] = await DiagnosticosModel.updateDiagnostico(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Diagnóstico not found or no data changed' });
        }
        res.json({ message: 'Diagnóstico updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteDiagnostico = async (req, res, next) => {
    try {
        const [result] = await DiagnosticosModel.deleteDiagnostico(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Diagnóstico not found' });
        }
        res.json({ message: 'Diagnóstico deleted successfully' });
    } catch (error) {
        next(error);
    }
};