
const db = require('../config/db');

class DiagnosticosModel {
    static async getAllDiagnosticos() {
        return db.query('SELECT * FROM diagnosticos');
    }

    static async getDiagnosticoById(id) {
        return db.query('SELECT * FROM diagnosticos WHERE id_diagnostico = ?', [id]);
    }

    static async createDiagnostico(diagnosticoData) {
        return db.query('INSERT INTO diagnosticos SET ?', [diagnosticoData]);
    }

    static async updateDiagnostico(id, diagnosticoData) {
        return db.query('UPDATE diagnosticos SET ? WHERE id_diagnostico = ?', [diagnosticoData, id]);
    }

    static async deleteDiagnostico(id) {
        return db.query('DELETE FROM diagnosticos WHERE id_diagnostico = ?', [id]);
    }
}

module.exports = DiagnosticosModel;
