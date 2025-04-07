// server/models/ReparacionesPartesModel.js
const db = require('../config/db');

class ReparacionesPartesModel {
    static async getAllReparacionesPartes() {
        const query = `
            SELECT rp.*, p.nombre as nombre_parte, p.descripcion as descripcion_parte
            FROM reparaciones_partes rp
            LEFT JOIN partes p ON rp.id_parte = p.id_parte
        `;
        return db.query(query);
    }

    static async getReparacionParteById(id) {
        const query = `
            SELECT rp.*, p.nombre as nombre_parte, p.descripcion as descripcion_parte
            FROM reparaciones_partes rp
            LEFT JOIN partes p ON rp.id_parte = p.id_parte
            WHERE rp.id_reparacion_partes = ?
        `;
        return db.query(query, [id]);
    }

    static async getReparacionesByReparacion(idReparacion) {
        const query = `
            SELECT rp.*, p.nombre as nombre_parte, p.descripcion as descripcion_parte
            FROM reparaciones_partes rp
            LEFT JOIN partes p ON rp.id_parte = p.id_parte
            WHERE rp.id_reparacion = ?
        `;
        return db.query(query, [idReparacion]);
    }

    static async createReparacionParte(data) {
        return db.query('INSERT INTO reparaciones_partes SET ?', [data]);
    }

    static async updateReparacionParte(id, data) {
        return db.query('UPDATE reparaciones_partes SET ? WHERE id_reparacion_partes = ?', [data, id]);
    }

    static async deleteReparacionParte(id) {
        return db.query('DELETE FROM reparaciones_partes WHERE id_reparacion_partes = ?', [id]);
    }
}

module.exports = ReparacionesPartesModel;