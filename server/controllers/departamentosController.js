
const DepartamentosModel = require('../models/DepartamentosModel');

exports.getAllDepartamentos = async (req, res, next) => {
    try {
        const [departamentos] = await DepartamentosModel.getAllDepartamentos();
        res.json(departamentos);
    } catch (error) {
        next(error);
    }
};

exports.getDepartamentoById = async (req, res, next) => {
    try {
        const [departamento] = await DepartamentosModel.getDepartamentoById(req.params.id);
        if (departamento.length === 0) {
            return res.status(404).json({ message: 'Departamento not found' });
        }
        res.json(departamento[0]);
    } catch (error) {
        next(error);
    }
};

exports.createDepartamento = async (req, res, next) => {
    try {
        const [result] = await DepartamentosModel.createDepartamento(req.body);
        res.status(201).json({ id_departamento: result.insertId, ...req.body });
    } catch (error) {
        next(error);
    }
};

exports.updateDepartamento = async (req, res, next) => {
    try {
        const [result] = await DepartamentosModel.updateDepartamento(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Departamento not found or no data changed' });
        }
        res.json({ message: 'Departamento updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteDepartamento = async (req, res, next) => {
    try {
        const [result] = await DepartamentosModel.deleteDepartamento(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Departamento not found' });
        }
        res.json({ message: 'Departamento deleted successfully' });
    } catch (error) {
        next(error);
    }
};
