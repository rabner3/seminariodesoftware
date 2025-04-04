
const db = require('../config/db');

class PartesModel {
    static async getAllPartes() {
        return db.query('SELECT * FROM partes');
    }

    static async getParteById(id) {
        return db.query('SELECT * FROM partes WHERE id_parte = ?', [id]);
    }

    static async createParte(parteData) {
        return db.query('INSERT INTO partes SET ?', [parteData]);
    }

    static async updateParte(id, parteData) {
        return db.query('UPDATE partes SET ? WHERE id_parte = ?', [parteData, id]);
    }

    static async deleteParte(id) {
        return db.query('DELETE FROM partes WHERE id_parte = ?', [id]);
    }
}

module.exports = PartesModel;
