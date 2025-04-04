
const db = require('../config/db');

class ReparacionesModel {
    static async getAllReparaciones() {
        return db.query('SELECT * FROM reparaciones');
    }

    static async getReparacionById(id) {
        return db.query('SELECT * FROM reparaciones WHERE id_reparacion = ?', [id]);
    }

    static async createReparacion(reparacionData) {
        return db.query('INSERT INTO reparaciones SET ?', [reparacionData]);
    }

    static async updateReparacion(id, reparacionData) {
        return db.query('UPDATE reparaciones SET ? WHERE id_reparacion = ?', [reparacionData, id]);
    }

    static async deleteReparacion(id) {
        return db.query('DELETE FROM reparaciones WHERE id_reparacion = ?', [id]);
    }
}

module.exports = ReparacionesModel;
