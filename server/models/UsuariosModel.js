// server/models/UsuariosModel.js
const db = require('../config/db');
const bcrypt = require('bcrypt'); // Aún usamos bcrypt para hashear contraseñas

class UsuariosModel {
    static async getAllUsuarios() {
        return db.query('SELECT * FROM usuarios');
    }

    static async getUsuarioById(id) {
        return db.query('SELECT * FROM usuarios WHERE id_usuarios = ?', [id]);
    }

    static async getUsuarioByEmail(email) {
        return db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    }

    static async createUsuario(userData) {
        // Si hay una contraseña, la hasheamos antes de guardarla
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password_hash = await bcrypt.hash(userData.password, salt);
            delete userData.password; // No guardar la contraseña en texto plano
        }
        
        return db.query('INSERT INTO usuarios SET ?', [userData]);
    }

    static async updateUsuario(id, userData) {
        // Si hay una contraseña, la hasheamos antes de guardarla
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password_hash = await bcrypt.hash(userData.password, salt);
            delete userData.password; // No guardar la contraseña en texto plano
        }
        
        userData.fecha_actualizacion = new Date();
        
        return db.query('UPDATE usuarios SET ? WHERE id_usuarios = ?', [userData, id]);
    }

    static async deleteUsuario(id) {
        return db.query('DELETE FROM usuarios WHERE id_usuarios = ?', [id]);
    }

    static async login(email, password) {
        const [usuarios] = await this.getUsuarioByEmail(email);
        
        if (usuarios.length === 0) {
            return { success: false, message: 'Credenciales inválidas' };
        }
        
        const usuario = usuarios[0];
        
        // Si el usuario no tiene contraseña hasheada
        if (!usuario.password_hash) {
            return { success: false, message: 'Credenciales inválidas' };
        }
        
        // Comparar la contraseña
        const isMatch = await bcrypt.compare(password, usuario.password_hash);
        
        if (!isMatch) {
            return { success: false, message: 'Credenciales inválidas' };
        }
        
        // Actualizar el último login
        await db.query(
            'UPDATE usuarios SET ultimo_login = ? WHERE id_usuarios = ?', 
            [new Date(), usuario.id_usuarios]
        );
        
        // Devolver los datos del usuario (excluyendo la contraseña)
        const { password_hash, ...usuarioData } = usuario;
        
        return { 
            success: true, 
            usuario: usuarioData
        };
    }
}

module.exports = UsuariosModel;