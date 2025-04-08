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
        // Formatear fechas correctamente para MySQL
        if (data.fecha_creacion) {
            if (data.fecha_creacion instanceof Date) {
                data.fecha_creacion = data.fecha_creacion.toISOString().slice(0, 19).replace('T', ' ');
            } else if (typeof data.fecha_creacion === 'string') {
                const fecha = new Date(data.fecha_creacion);
                data.fecha_creacion = fecha.toISOString().slice(0, 19).replace('T', ' ');
            }
        }
        
        return db.query('INSERT INTO reparaciones_partes SET ?', [data]);
    }

    static async updateReparacionParte(id, data) {
        // Formatear fechas correctamente para MySQL
        if (data.fecha_creacion) {
            if (data.fecha_creacion instanceof Date) {
                data.fecha_creacion = data.fecha_creacion.toISOString().slice(0, 19).replace('T', ' ');
            } else if (typeof data.fecha_creacion === 'string') {
                const fecha = new Date(data.fecha_creacion);
                data.fecha_creacion = fecha.toISOString().slice(0, 19).replace('T', ' ');
            }
        }
        
        return db.query('UPDATE reparaciones_partes SET ? WHERE id_reparacion_partes = ?', [data, id]);
    }

    static async deleteReparacionParte(id) {
        return db.query('DELETE FROM reparaciones_partes WHERE id_reparacion_partes = ?', [id]);
    }
}

module.exports = ReparacionesPartesModel;