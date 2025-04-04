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
}

module.exports = NotificacionesModel;