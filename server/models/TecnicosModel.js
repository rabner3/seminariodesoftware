// server/models/TecnicosModel.js
const db = require('../config/db');

class TecnicosModel {
    static async getAllTecnicos() {
        return db.query('SELECT * FROM tecnicos');
    }

    static async getTecnicoById(id) {
        return db.query('SELECT * FROM tecnicos WHERE id_tecnico = ?', [id]);
    }

    static async getTecnicoByUsuario(userId) {
        return db.query('SELECT * FROM tecnicos WHERE id_usuario = ?', [userId]);
    }

    static async getUltimoId() {
        return db.query('SELECT MAX(id_tecnico) as max_id FROM tecnicos');
    }

    static async createTecnico(tecnicoData) {
        return db.query('INSERT INTO tecnicos SET ?', [tecnicoData]);
    }

    static async updateTecnico(id, tecnicoData) {
        return db.query('UPDATE tecnicos SET ? WHERE id_tecnico = ?', [tecnicoData, id]);
    }

    static async deleteTecnico(id) {
        return db.query('DELETE FROM tecnicos WHERE id_tecnico = ?', [id]);
    }
}

module.exports = TecnicosModel;