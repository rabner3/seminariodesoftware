// server/controllers/usuariosController.js
const UsuariosModel = require('../models/UsuariosModel');
const TecnicosModel = require('../models/TecnicosModel');

exports.getAllUsuarios = async (req, res, next) => {
    try {
        const [usuarios] = await UsuariosModel.getAllUsuarios();

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

        const { password_hash, token_reset, ...usuarioData } = usuario[0];
        res.json(usuarioData);
    } catch (error) {
        next(error);
    }
};

exports.createUsuario = async (req, res, next) => {
    try {

        const [existingUser] = await UsuariosModel.getUsuarioByEmail(req.body.email);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }


        if (!req.body.password) {
            req.body.password = Math.random().toString(36).slice(-8); 
        }

        const [result] = await UsuariosModel.createUsuario(req.body);
        const nuevoUsuarioId = result.insertId;
        
  
        if (req.body.rol === 'tecnico') {
            try {
 
                const [lastTecnico] = await TecnicosModel.getUltimoId();
                const nuevoTecnicoId = (lastTecnico[0]?.max_id || 0) + 1;
                

                const tecnicoData = {
                    id_tecnico: nuevoTecnicoId, 
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    email: req.body.email,
                    especialidad: req.body.especialidad || 'General',
                    estado: 'activo',
                    fecha_registro: new Date(),
                    id_usuario: nuevoUsuarioId,
                    creado_por: req.body.creado_por || null
                };
                
                // Crear el registro del técnico
                await TecnicosModel.createTecnico(tecnicoData);
            } catch (tecnicoError) {
                console.error('Error al crear técnico:', tecnicoError);

            }
        }
        

        const { password, ...userData } = req.body;
        
        res.status(201).json({ 
            id_usuario: nuevoUsuarioId, 
            ...userData,
            message: 'Usuario creado exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUsuario = async (req, res, next) => {
    try {

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