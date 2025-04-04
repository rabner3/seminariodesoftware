
const AuditoriaModel = require('../models/AuditoriaModel');

exports.getAllAuditoria = async (req, res, next) => {
    try {
        const [registros] = await AuditoriaModel.getAllAuditoria();
        res.json(registros);
    } catch (error) {
        next(error);
    }
};

exports.getAuditoriaById = async (req, res, next) => {
    try {
        const [registro] = await AuditoriaModel.getAuditoriaById(req.params.id);
        if (registro.length === 0) {
            return res.status(404).json({ message: 'Registro de auditoría no encontrado' });
        }
        res.json(registro[0]);
    } catch (error) {
        next(error);
    }
};

exports.createAuditoria = async (req, res, next) => {
    try {
        const [result] = await AuditoriaModel.createAuditoria(req.body);
        res.status(201).json({ id_auditoria: result.insertId, ...req.body });
    } catch (error) {
        next(error);
    }
};

exports.updateAuditoria = async (req, res, next) => {
    try {
        const [result] = await AuditoriaModel.updateAuditoria(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro de auditoría no encontrado' });
        }
        res.json({ message: 'Registro de auditoría actualizado exitosamente' });
    } catch (error) {
        next(error);
    }
};

exports.deleteAuditoria = async (req, res, next) => {
    try {
        const [result] = await AuditoriaModel.deleteAuditoria(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro de auditoría no encontrado' });
        }
        res.json({ message: 'Registro de auditoría eliminado exitosamente' });
    } catch (error) {
        next(error);
    }
};
