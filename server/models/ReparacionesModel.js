// server/models/ReparacionesModel.js
const db = require('../config/db');

class ReparacionesModel {
    static async getAllReparaciones() {
        const query = `
            SELECT r.*, 
                   e.tipo as tipo_equipo, e.marca as marca_equipo, e.modelo as modelo_equipo, e.numero_serie as serie_equipo,
                   t.nombre as nombre_tecnico, t.apellido as apellido_tecnico,
                   s.descripcion as descripcion_solicitud, s.urgencia as urgencia_solicitud
            FROM reparaciones r
            LEFT JOIN equipos e ON r.id_equipo = e.id_equipo
            LEFT JOIN tecnicos t ON r.id_tecnico = t.id_tecnico
            LEFT JOIN solicitudes s ON r.id_solicitud = s.id_solicitud
            ORDER BY r.fecha_recepcion DESC
        `;
        return db.query(query);
    }

    static async getReparacionById(id) {
        const query = `
            SELECT r.*, 
                   e.tipo as tipo_equipo, e.marca as marca_equipo, e.modelo as modelo_equipo, e.numero_serie as serie_equipo,
                   t.nombre as nombre_tecnico, t.apellido as apellido_tecnico,
                   s.descripcion as descripcion_solicitud, s.urgencia as urgencia_solicitud
            FROM reparaciones r
            LEFT JOIN equipos e ON r.id_equipo = e.id_equipo
            LEFT JOIN tecnicos t ON r.id_tecnico = t.id_tecnico
            LEFT JOIN solicitudes s ON r.id_solicitud = s.id_solicitud
            WHERE r.id_reparacion = ?
        `;
        return db.query(query, [id]);
    }

    static async getReparacionesByTecnico(idTecnico) {
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
        return db.query(query, [idTecnico]);
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