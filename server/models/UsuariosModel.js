// server/models/UsuariosModel.js
const db = require('../config/db');
const bcrypt = require('bcrypt'); // Aún usamos bcrypt para hashear contraseñas

class UsuariosModel {
    static async getAllUsuarios() {
        const query = `
            SELECT u.*, d.nombre as departamento_nombre 
            FROM usuarios u
            LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
        `;
        return db.query(query);
    }

    static async getUsuarioById(id) {
        const query = `
            SELECT u.*, d.nombre as departamento_nombre 
            FROM usuarios u
            LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
            WHERE u.id_usuarios = ?
        `;
        return db.query(query, [id]);
    }
    static async getUsuariosByDepartamento(id_departamento) {
        return db.query('SELECT * FROM usuarios WHERE id_departamento = ?', [id_departamento]);
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
        
        // Asegurar que se establezcan las fechas
        userData.fecha_registro = userData.fecha_registro || new Date();
        userData.fecha_actualizacion = new Date();
        
        return db.query('INSERT INTO usuarios SET ?', [userData]);
    }

    static async updateUsuario(id, userData) {
        // Si hay una contraseña, la hasheamos antes de guardarla
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password_hash = await bcrypt.hash(userData.password, salt);
            delete userData.password; // No guardar la contraseña en texto plano
        }
        
        // Asegurar que fecha_actualizacion siempre se establezca
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
        
        // Actualizar el último login y fecha de actualización
        const ahora = new Date();
        await db.query(
            'UPDATE usuarios SET ultimo_login = ?, fecha_actualizacion = ? WHERE id_usuarios = ?', 
            [ahora, ahora, usuario.id_usuarios]
        );
        
        // Devolver los datos del usuario (excluyendo la contraseña)
        const { password_hash, ...usuarioData } = usuario;
        
        return { 
            success: true, 
            usuario: usuarioData
        };
    }

    static async cambiarPassword(id, oldPassword, newPassword) {
        // Primero verificamos que el usuario exista
        const [usuarios] = await this.getUsuarioById(id);
        
        if (usuarios.length === 0) {
            return { success: false, message: 'Usuario no encontrado' };
        }
        
        const usuario = usuarios[0];
        
        // Verificamos la contraseña actual
        const isMatch = await bcrypt.compare(oldPassword, usuario.password_hash);
        
        if (!isMatch) {
            return { success: false, message: 'Contraseña actual incorrecta' };
        }
        
        // Hasheamos la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const nuevaPasswordHash = await bcrypt.hash(newPassword, salt);
        
        await db.query(
            'UPDATE usuarios SET password_hash = ?, fecha_actualizacion = ? WHERE id_usuarios = ?', 
            [nuevaPasswordHash, new Date(), id]
        );
        
        return { success: true, message: 'Contraseña actualizada correctamente' };
    }
}

module.exports = UsuariosModel;