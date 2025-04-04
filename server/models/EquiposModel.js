
const db = require('../config/db');

class EquiposModel {
    static async getAllEquipos() {
        return db.query('SELECT * FROM equipos');
    }

    static async getEquipoById(id) {
        return db.query('SELECT * FROM equipos WHERE id_equipo = ?', [id]);
    }

    static async createEquipo(equipoData) {
        return db.query('INSERT INTO equipos SET ?', [equipoData]);
    }

    static async updateEquipo(id, equipoData) {
        return db.query('UPDATE equipos SET ? WHERE id_equipo = ?', [equipoData, id]);
    }

    static async deleteEquipo(id) {
        return db.query('DELETE FROM equipos WHERE id_equipo = ?', [id]);
    }
}

module.exports = EquiposModel;
