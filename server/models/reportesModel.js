const db = require('../config/db');

class ReportesModel {
    static getAll() {
        return db.query('SELECT * FROM reportes ORDER BY fecha_creacion DESC');
    }

    static getReporteById(id) {
        return db.query('SELECT * FROM reportes WHERE id_reporte = ?', [id]);
    }

    static create(reporteData) {
        return db.query('INSERT INTO reportes SET ?', reporteData);
    }

    static update(id, reporteData) {
        return db.query('UPDATE reportes SET ? WHERE id_reporte = ?', [reporteData, id]);
    }

    static delete(id) {
        return db.query('DELETE FROM reportes WHERE id_reporte = ?', [id]);
    }
}

module.exports = ReportesModel;