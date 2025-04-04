
const db = require('../config/db');

class SolicitudesModel {
    static async getAllSolicitudes() {
        return db.query('SELECT * FROM solicitudes');
    }

    static async getSolicitudById(id) {
        return db.query('SELECT * FROM solicitudes WHERE id_solicitud = ?', [id]);
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
}

module.exports = SolicitudesModel;
