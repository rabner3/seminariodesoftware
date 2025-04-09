
const db = require('../config/db');

class BitacorasAsignModel {
    static async getAllBitacoras() {
        const query = `
            SELECT ba.*, a.id_equipo, a.id_usuario, 
                   u.nombre AS nombre_usuario_responsable, 
                   u.apellido AS apellido_usuario_responsable
            FROM bitacoras_asign ba
            LEFT JOIN asignaciones a ON ba.id_asignacion = a.id_asignacion
            LEFT JOIN usuarios u ON ba.id_usuarios_responsable = u.id_usuarios
            ORDER BY ba.fecha_accion DESC
        `;
        return db.query(query);
    }

    static async getBitacoraById(id) {
        const query = `
            SELECT ba.*, a.id_equipo, a.id_usuario, 
                   u.nombre AS nombre_usuario_responsable, 
                   u.apellido AS apellido_usuario_responsable
            FROM bitacoras_asign ba
            LEFT JOIN asignaciones a ON ba.id_asignacion = a.id_asignacion
            LEFT JOIN usuarios u ON ba.id_usuarios_responsable = u.id_usuarios
            WHERE ba.id_bitacora = ?
        `;
        return db.query(query, [id]);
    }

    static async getBitacorasByAsignacion(idAsignacion) {
        const query = `
            SELECT ba.*, a.id_equipo, a.id_usuario, 
                   u.nombre AS nombre_usuario_responsable, 
                   u.apellido AS apellido_usuario_responsable
            FROM bitacoras_asign ba
            LEFT JOIN asignaciones a ON ba.id_asignacion = a.id_asignacion
            LEFT JOIN usuarios u ON ba.id_usuarios_responsable = u.id_usuarios
            WHERE ba.id_asignacion = ?
            ORDER BY ba.fecha_accion DESC
        `;
        return db.query(query, [idAsignacion]);
    }

    static async createBitacora(bitacoraData) {
        return db.query('INSERT INTO bitacoras_asign SET ?', [bitacoraData]);
    }

    static async updateBitacora(id, bitacoraData) {
        return db.query('UPDATE bitacoras_asign SET ? WHERE id_bitacora = ?', [bitacoraData, id]);
    }

    static async deleteBitacora(id) {
        return db.query('DELETE FROM bitacoras_asign WHERE id_bitacora = ?', [id]);
    }

    static async deleteBitacorasByAsignacion(idAsignacion) {
        return db.query('DELETE FROM bitacoras_asign WHERE id_asignacion = ?', [idAsignacion]);
    }
}

module.exports = BitacorasAsignModel;