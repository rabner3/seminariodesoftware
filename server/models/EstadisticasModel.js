const db = require('../config/db');

class EstadisticasModel {
    static async getAllEstadisticas() {
        return db.query('SELECT * FROM estadisticas');
    }

    static async getEstadisticaById(id) {
        return db.query('SELECT * FROM estadisticas WHERE id_estadistica = ?', [id]);
    }

    static async createEstadistica(estadisticaData) {
        return db.query('INSERT INTO estadisticas SET ?', [estadisticaData]);
    }

    static async updateEstadistica(id, estadisticaData) {
        return db.query('UPDATE estadisticas SET ? WHERE id_estadistica = ?', [estadisticaData, id]);
    }

    static async deleteEstadistica(id) {
        return db.query('DELETE FROM estadisticas WHERE id_estadistica = ?', [id]);
    }
}

module.exports = EstadisticasModel;