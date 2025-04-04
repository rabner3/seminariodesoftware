
const UsuariosModel = require('../models/UsuariosModel');

exports.getAllUsuarios = async (req, res, next) => {
    try {
        const [usuarios] = await UsuariosModel.getAllUsuarios();
        res.json(usuarios);
    } catch (error) {
        next(error);
    }
};

exports.getUsuarioById = async (req, res, next) => {
    try {
        const [usuario] = await UsuariosModel.getUsuarioById(req.params.id);
        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario not found' });
        }
        res.json(usuario[0]);
    } catch (error) {
        next(error);
    }
};

exports.createUsuario = async (req, res, next) => {
    try {
        const [result] = await UsuariosModel.createUsuario(req.body);
        res.status(201).json({ id_usuario: result.insertId, ...req.body });
    } catch (error) {
        next(error);
    }
};

exports.updateUsuario = async (req, res, next) => {
    try {
        const [result] = await UsuariosModel.updateUsuario(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario not found or no data changed' });
        }
        res.json({ message: 'Usuario updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteUsuario = async (req, res, next) => {
    try {
        const [result] = await UsuariosModel.deleteUsuario(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario not found' });
        }
        res.json({ message: 'Usuario deleted successfully' });
    } catch (error) {
        next(error);
    }
};
