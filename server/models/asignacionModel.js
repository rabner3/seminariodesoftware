const db = require('../config/db');

class AsignacionModel {
    static getAllAsignaciones() {
        return db.query('SELECT * FROM asignaciones');
    }

    static getAsignacionById(id) {
        return db.query('SELECT * FROM asignaciones WHERE id_asignacion = ?', [id]);
    }

    static createAsignacion(asignacionData) {
        return db.query('INSERT INTO asignaciones SET ?', asignacionData);
    }

    static updateAsignacion(id, asignacionData) {
        return db.query('UPDATE asignaciones SET ? WHERE id_asignacion = ?', [asignacionData, id]);
    }

    static deleteAsignacion(id) {
        return db.query('DELETE FROM asignaciones WHERE id_asignacion = ?', [id]);
    }
}

module.exports = AsignacionModel;