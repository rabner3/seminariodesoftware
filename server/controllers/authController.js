// server/controllers/authController.js
const UsuariosModel = require('../models/UsuariosModel');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Se requieren email y contraseña' });
        }

        const result = await UsuariosModel.login(email, password);

        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }


        res.json({
            message: 'Login exitoso',
            usuario: result.usuario
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {

        res.json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        next(error);
    }
};