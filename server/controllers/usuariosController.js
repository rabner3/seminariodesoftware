// server/controllers/usuariosController.js
const UsuariosModel = require('../models/UsuariosModel');

exports.getAllUsuarios = async (req, res, next) => {
    try {
        const [usuarios] = await UsuariosModel.getAllUsuarios();
        // Evitamos enviar el password_hash en la respuesta
        const usuariosSinPassword = usuarios.map(usuario => {
            const { password_hash, token_reset, ...usuarioData } = usuario;
            return usuarioData;
        });
        res.json(usuariosSinPassword);
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
        // Evitamos enviar el password_hash en la respuesta
        const { password_hash, token_reset, ...usuarioData } = usuario[0];
        res.json(usuarioData);
    } catch (error) {
        next(error);
    }
};

exports.createUsuario = async (req, res, next) => {
    try {
        // Verificar si el email ya existe
        const [existingUser] = await UsuariosModel.getUsuarioByEmail(req.body.email);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Si no se proporciona una contraseña, generar una temporal
        if (!req.body.password) {
            req.body.password = Math.random().toString(36).slice(-8); // Contraseña temporal
        }

        const [result] = await UsuariosModel.createUsuario(req.body);
        
        // Eliminar la contraseña de la respuesta
        const { password, ...userData } = req.body;
        
        res.status(201).json({ 
            id_usuario: result.insertId, 
            ...userData,
            message: 'Usuario creado exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUsuario = async (req, res, next) => {
    try {
        // Si se intenta cambiar el email, verificar que no exista
        if (req.body.email) {
            const [existingUser] = await UsuariosModel.getUsuarioByEmail(req.body.email);
            if (existingUser.length > 0 && existingUser[0].id_usuarios !== parseInt(req.params.id)) {
                return res.status(400).json({ message: 'El email ya está registrado por otro usuario' });
            }
        }

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

        const [usuario] = await UsuariosModel.getUsuarioById(req.params.id);
        if (usuario.length > 0 && usuario[0].rol === 'admin') {
            // Podemos añadir verificaciones adicionales, como que solo otro admin pueda eliminar admins
            // o implementar soft delete en lugar de eliminación real
        }

        const [result] = await UsuariosModel.deleteUsuario(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario not found' });
        }
        res.json({ message: 'Usuario deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getUsuariosByRol = async (req, res, next) => {
    try {
        const [usuarios] = await UsuariosModel.getUsuariosByRol(req.params.rol);
        // Evitamos enviar el password_hash en la respuesta
        const usuariosSinPassword = usuarios.map(usuario => {
            const { password_hash, token_reset, ...usuarioData } = usuario;
            return usuarioData;
        });
        res.json(usuariosSinPassword);
    } catch (error) {
        next(error);
    }
};

exports.cambiarPassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Se requieren ambas contraseñas' });
        }

        const result = await UsuariosModel.cambiarPassword(req.params.id, oldPassword, newPassword);
        
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        
        res.json({ message: result.message });
    } catch (error) {
        next(error);
    }
};