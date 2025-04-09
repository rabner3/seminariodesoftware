// server/models/BitacorasReparModel.js
const db = require('../config/db');

class BitacorasReparModel {
    static async getAllBitacoras() {
        const query = `
            SELECT br.*, 
                   r.id_equipo, r.id_solicitud,
                   t.nombre AS nombre_tecnico, t.apellido AS apellido_tecnico,
                   u.nombre AS nombre_creador, u.apellido AS apellido_creador
            FROM bitacoras_repar br
            LEFT JOIN reparaciones r ON br.id_reparacion = r.id_reparacion
            LEFT JOIN tecnicos t ON br.id_tecnico = t.id_tecnico
            LEFT JOIN usuarios u ON br.creado_por = u.id_usuarios
            ORDER BY br.fecha_accion DESC
        `;
        return db.query(query);
    }

    static async getBitacoraById(id) {
        const query = `
            SELECT br.*, 
                   r.id_equipo, r.id_solicitud,
                   t.nombre AS nombre_tecnico, t.apellido AS apellido_tecnico,
                   u.nombre AS nombre_creador, u.apellido AS apellido_creador
            FROM bitacoras_repar br
            LEFT JOIN reparaciones r ON br.id_reparacion = r.id_reparacion
            LEFT JOIN tecnicos t ON br.id_tecnico = t.id_tecnico
            LEFT JOIN usuarios u ON br.creado_por = u.id_usuarios
            WHERE br.id_bitacora = ?
        `;
        return db.query(query, [id]);
    }

    static async getBitacorasByReparacion(idReparacion) {
        const query = `
            SELECT br.*, 
                   r.id_equipo, r.id_solicitud,
                   t.nombre AS nombre_tecnico, t.apellido AS apellido_tecnico,
                   u.nombre AS nombre_creador, u.apellido AS apellido_creador
            FROM bitacoras_repar br
            LEFT JOIN reparaciones r ON br.id_reparacion = r.id_reparacion
            LEFT JOIN tecnicos t ON br.id_tecnico = t.id_tecnico
            LEFT JOIN usuarios u ON br.creado_por = u.id_usuarios
            WHERE br.id_reparacion = ?
            ORDER BY br.fecha_accion DESC
        `;
        return db.query(query, [idReparacion]);
    }

    static async getBitacorasByTecnico(idTecnico) {
        const query = `
            SELECT br.*, 
                   r.id_equipo, r.id_solicitud,
                   t.nombre AS nombre_tecnico, t.apellido AS apellido_tecnico,
                   u.nombre AS nombre_creador, u.apellido AS apellido_creador
            FROM bitacoras_repar br
            LEFT JOIN reparaciones r ON br.id_reparacion = r.id_reparacion
            LEFT JOIN tecnicos t ON br.id_tecnico = t.id_tecnico
            LEFT JOIN usuarios u ON br.creado_por = u.id_usuarios
            WHERE br.id_tecnico = ?
            ORDER BY br.fecha_accion DESC
        `;
        return db.query(query, [idTecnico]);
    }

    static async createBitacora(bitacoraData) {
        const tiposValidos = ['recepcion', 'diagnostico', 'reparacion', 'espera', 'prueba', 'entrega', 'otro'];
        
        if (bitacoraData.tipo_accion && !tiposValidos.includes(bitacoraData.tipo_accion)) {
            bitacoraData.tipo_accion = 'otro';
        }
        
     
        if (bitacoraData.fecha_accion) {
            if (bitacoraData.fecha_accion instanceof Date) {
                bitacoraData.fecha_accion = bitacoraData.fecha_accion.toISOString().slice(0, 19).replace('T', ' ');
            } else if (typeof bitacoraData.fecha_accion === 'string') {
                const date = new Date(bitacoraData.fecha_accion);
                bitacoraData.fecha_accion = date.toISOString().slice(0, 19).replace('T', ' ');
            }
        }
        
        if (bitacoraData.fecha_creacion) {
            if (bitacoraData.fecha_creacion instanceof Date) {
                bitacoraData.fecha_creacion = bitacoraData.fecha_creacion.toISOString().slice(0, 19).replace('T', ' ');
            } else if (typeof bitacoraData.fecha_creacion === 'string') {
                const date = new Date(bitacoraData.fecha_creacion);
                bitacoraData.fecha_creacion = date.toISOString().slice(0, 19).replace('T', ' ');
            }
        }
        
        return db.query('INSERT INTO bitacoras_repar SET ?', [bitacoraData]);
    }

    static async updateBitacora(id, bitacoraData) {
  
        const tiposValidos = ['recepcion', 'diagnostico', 'reparacion', 'espera', 'prueba', 'entrega', 'otro'];
        
        if (bitacoraData.tipo_accion && !tiposValidos.includes(bitacoraData.tipo_accion)) {
            bitacoraData.tipo_accion = 'otro';
        }
        
     
        if (bitacoraData.fecha_accion) {
            if (bitacoraData.fecha_accion instanceof Date) {
                bitacoraData.fecha_accion = bitacoraData.fecha_accion.toISOString().slice(0, 19).replace('T', ' ');
            } else if (typeof bitacoraData.fecha_accion === 'string') {
                const date = new Date(bitacoraData.fecha_accion);
                bitacoraData.fecha_accion = date.toISOString().slice(0, 19).replace('T', ' ');
            }
        }
        
        if (bitacoraData.fecha_creacion) {
            if (bitacoraData.fecha_creacion instanceof Date) {
                bitacoraData.fecha_creacion = bitacoraData.fecha_creacion.toISOString().slice(0, 19).replace('T', ' ');
            } else if (typeof bitacoraData.fecha_creacion === 'string') {
                const date = new Date(bitacoraData.fecha_creacion);
                bitacoraData.fecha_creacion = date.toISOString().slice(0, 19).replace('T', ' ');
            }
        }
        
        return db.query('UPDATE bitacoras_repar SET ? WHERE id_bitacora = ?', [bitacoraData, id]);
    }

    static async deleteBitacora(id) {
        return db.query('DELETE FROM bitacoras_repar WHERE id_bitacora = ?', [id]);
    }

    static async deleteBitacorasByReparacion(idReparacion) {
        return db.query('DELETE FROM bitacoras_repar WHERE id_reparacion = ?', [idReparacion]);
    }
}

module.exports = BitacorasReparModel;