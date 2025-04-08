// server/models/ReparacionesModel.js
const db = require('../config/db');

class ReparacionesModel {
    static async getAllReparaciones() {
        return db.query('SELECT * FROM reparaciones');
    }

    static async getReparacionById(id) {
        return db.query('SELECT * FROM reparaciones WHERE id_reparacion = ?', [id]);
    }

    static async getReparacionesByTecnico(tecnicoId) {
        const query = `
            SELECT r.*, 
                   e.tipo as tipo_equipo, e.marca as marca_equipo, e.modelo as modelo_equipo, e.numero_serie as serie_equipo,
                   s.urgencia
            FROM reparaciones r
            LEFT JOIN equipos e ON r.id_equipo = e.id_equipo
            LEFT JOIN solicitudes s ON r.id_solicitud = s.id_solicitud
            WHERE r.id_tecnico = ?
            ORDER BY r.fecha_recepcion DESC
        `;
        return db.query(query, [tecnicoId]);
    }

    static async createReparacion(reparacionData) {
        return db.query('INSERT INTO reparaciones SET ?', [reparacionData]);
    }

    static async updateReparacion(id, reparacionData) {
        // Eliminar el campo fecha_actualizacion si está presente
        if (reparacionData.fecha_actualizacion !== undefined) {
            delete reparacionData.fecha_actualizacion;
        }
        
        return db.query('UPDATE reparaciones SET ? WHERE id_reparacion = ?', [reparacionData, id]);
    }

    static async deleteReparacion(id) {
        return db.query('DELETE FROM reparaciones WHERE id_reparacion = ?', [id]);
    }
}

module.exports = ReparacionesModel;