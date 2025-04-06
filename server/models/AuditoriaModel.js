
const db = require('../config/db');

class AuditoriaModel {
    static getAllAuditoria() {
        return db.query('SELECT * FROM auditoria ORDER BY fecha_accion DESC');
    }

    static getAuditoriaById(id) {
        return db.query('SELECT * FROM auditoria WHERE id_auditoria = ?', [id]);
    }

    static createAuditoria(auditoriaData) {
        return db.query('INSERT INTO auditoria SET ?', auditoriaData);
    }

    static updateAuditoria(id, auditoriaData) {
        return db.query('UPDATE auditoria SET ? WHERE id_auditoria = ?', [auditoriaData, id]);
    }

    static deleteAuditoria(id) {
        return db.query('DELETE FROM auditoria WHERE id_auditoria = ?', [id]);
    }
}

module.exports = AuditoriaModel;
