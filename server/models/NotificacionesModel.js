
const db = require('../config/db');

class NotificacionesModel {
    static async getAllNotificaciones() {
        return db.query('SELECT * FROM notificaciones');
    }

    static async getNotificacionById(id) {
        return db.query('SELECT * FROM notificaciones WHERE id_notificacion = ?', [id]);
    }

    static async createNotificacion(notificacionData) {
        return db.query('INSERT INTO notificaciones SET ?', [notificacionData]);
    }

    static async updateNotificacion(id, notificacionData) {
        return db.query('UPDATE notificaciones SET ? WHERE id_notificacion = ?', [notificacionData, id]);
    }

    static async deleteNotificacion(id) {
        return db.query('DELETE FROM notificaciones WHERE id_notificacion = ?', [id]);
    }


    static async getNotificacionesByUsuario(idUsuario) {
        console.log('Modelo: Consultando notificaciones para usuario ID:', idUsuario);
        const query = 'SELECT * FROM notificaciones WHERE id_usuario_destino = ? ORDER BY fecha_envio DESC';
        return db.query(query, [idUsuario]);
    }

    static async getNotificacionesByTecnico(idTecnico) {
        console.log('Modelo: Consultando notificaciones para técnico ID:', idTecnico);
        const query = 'SELECT * FROM notificaciones WHERE id_tecnico_destino = ? ORDER BY fecha_envio DESC';
        return db.query(query, [idTecnico]);
    }

    static async marcarComoLeida(id) {
        return db.query(
            'UPDATE notificaciones SET estado = "leida", fecha_lectura = ? WHERE id_notificacion = ?', 
            [new Date(), id]
        );
    }

    static async getNotificacionesPendientes(idUsuario, idTecnico) {
        let query = 'SELECT * FROM notificaciones WHERE estado = "pendiente" AND ';
        let params = [];
        
        if (idUsuario) {
            query += 'id_usuario_destino = ?';
            params.push(idUsuario);
        } else if (idTecnico) {
            query += 'id_tecnico_destino = ?';
            params.push(idTecnico);
        }
        
        query += ' ORDER BY fecha_envio DESC';
        return db.query(query, params);
    }
}

module.exports = NotificacionesModel;