
const db = require('../config/db');

class UsuariosModel {
    static async getAllUsuarios() {
        return db.query('SELECT * FROM usuarios');
    }

    static async getUsuarioById(id) {
        return db.query('SELECT * FROM usuarios WHERE id_usuarios = ?', [id]);
    }

    static async createUsuario(userData) {
        return db.query('INSERT INTO usuarios SET ?', [userData]);
    }

    static async updateUsuario(id, userData) {
        return db.query('UPDATE usuarios SET ? WHERE id_usuarios = ?', [userData, id]);
    }

    static async deleteUsuario(id) {
        return db.query('DELETE FROM usuarios WHERE id_usuarios = ?', [id]);
    }
}

module.exports = UsuariosModel;
