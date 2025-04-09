
const db = require('../config/db');

class EquiposModel {
    static async getAllEquipos() {
        const query = `
            SELECT e.*, d.nombre as departamento_nombre 
            FROM equipos e
            LEFT JOIN departamentos d ON e.id_departamento = d.id_departamento
        `;
        return db.query(query);
    }

    static async getEquipoById(id) {
        const query = `
            SELECT e.*, d.nombre as departamento_nombre 
            FROM equipos e
            LEFT JOIN departamentos d ON e.id_departamento = d.id_departamento
            WHERE e.id_equipo = ?
        `;
        return db.query(query, [id]);
    }

    static async getEquiposByDepartamento(id_departamento) {
        const query = `
            SELECT e.*, d.nombre as departamento_nombre 
            FROM equipos e
            LEFT JOIN departamentos d ON e.id_departamento = d.id_departamento
            WHERE e.id_departamento = ?
        `;
        return db.query(query, [id_departamento]);
    }


    static async getUltimoId() {
        return db.query('SELECT MAX(id_equipo) as max_id FROM equipos');
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