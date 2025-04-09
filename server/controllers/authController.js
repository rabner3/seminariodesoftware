
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

exports.verificarToken = async (req, res, next) => {
    try {
        res.json({ valid: true, message: 'Token válido' });
    } catch (error) {
        next(error);
    }
};

exports.actualizarPerfil = async (req, res, next) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;
        

        delete datosActualizados.rol;
        
        const [result] = await UsuariosModel.updateUsuario(id, datosActualizados);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
    
        const [usuarioActualizado] = await UsuariosModel.getUsuarioById(id);
        

        const { password_hash, token_reset, ...usuarioData } = usuarioActualizado[0];
        
        res.json({
            message: 'Perfil actualizado exitosamente',
            usuario: usuarioData
        });
    } catch (error) {
        next(error);
    }
};