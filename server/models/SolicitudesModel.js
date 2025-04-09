
const db = require('../config/db');

class SolicitudesModel {
    static async getAllSolicitudes() {

        const query = `
            SELECT s.*, 
                   u.nombre AS nombre_usuario,
                   u.apellido AS apellido_usuario,
                   e.tipo AS tipo_equipo,
                   e.marca AS marca_equipo,
                   e.modelo AS modelo_equipo  
            FROM solicitudes s
            LEFT JOIN usuarios u ON s.id_usuario = u.id_usuarios
            LEFT JOIN equipos e ON s.id_equipo = e.id_equipo
            ORDER BY s.fecha_solicitud DESC
        `;
        return db.query(query);
    }

    static async getSolicitudById(id) {

        const query = `
            SELECT s.*, 
                   u.nombre AS nombre_usuario,
                   u.apellido AS apellido_usuario,
                   u.email AS email_usuario,
                   u.puesto AS puesto_usuario,
                   e.tipo AS tipo_equipo,
                   e.marca AS marca_equipo,
                   e.modelo AS modelo_equipo,
                   e.numero_serie AS serie_equipo  
            FROM solicitudes s
            LEFT JOIN usuarios u ON s.id_usuario = u.id_usuarios
            LEFT JOIN equipos e ON s.id_equipo = e.id_equipo
            WHERE s.id_solicitud = ?
        `;
        return db.query(query, [id]);
    }

    static async createSolicitud(solicitudData) {
        return db.query('INSERT INTO solicitudes SET ?', [solicitudData]);
    }

    static async updateSolicitud(id, solicitudData) {
        return db.query('UPDATE solicitudes SET ? WHERE id_solicitud = ?', [solicitudData, id]);
    }

    static async deleteSolicitud(id) {
        return db.query('DELETE FROM solicitudes WHERE id_solicitud = ?', [id]);
    }
    

    static async getSolicitudesByUsuario(idUsuario) {
        const query = `
            SELECT s.*, 
                   u.nombre AS nombre_usuario,
                   u.apellido AS apellido_usuario,
                   e.tipo AS tipo_equipo,
                   e.marca AS marca_equipo,
                   e.modelo AS modelo_equipo  
            FROM solicitudes s
            LEFT JOIN usuarios u ON s.id_usuario = u.id_usuarios
            LEFT JOIN equipos e ON s.id_equipo = e.id_equipo
            WHERE s.id_usuario = ?
            ORDER BY s.fecha_solicitud DESC
        `;
        return db.query(query, [idUsuario]);
    }
}

module.exports = SolicitudesModel;