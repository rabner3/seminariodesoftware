// server/models/DiagnosticosModel.js (con métodos adicionales)
const db = require('../config/db');

class DiagnosticosModel {
    static async getAllDiagnosticos() {
        return db.query('SELECT * FROM diagnosticos');
    }

    static async getDiagnosticoById(id) {
        return db.query('SELECT * FROM diagnosticos WHERE id_diagnostico = ?', [id]);
    }

    static async getDiagnosticosByReparacion(idReparacion) {
        return db.query('SELECT * FROM diagnosticos WHERE id_reparacion = ?', [idReparacion]);
    }

    static async getDiagnosticosByTecnico(idTecnico) {
        return db.query('SELECT * FROM diagnosticos WHERE id_tecnico = ?', [idTecnico]);
    }

    static async createDiagnostico(diagnosticoData) {
        // Formatear la fecha_diagnostico si existe
        if (diagnosticoData.fecha_diagnostico) {
            // Si la fecha es un objeto Date o una cadena en formato ISO
            if (diagnosticoData.fecha_diagnostico instanceof Date ||
                (typeof diagnosticoData.fecha_diagnostico === 'string' && diagnosticoData.fecha_diagnostico.includes('T'))) {

                const fecha = new Date(diagnosticoData.fecha_diagnostico);
                // Convertir a formato MySQL YYYY-MM-DD HH:MM:SS
                diagnosticoData.fecha_diagnostico = fecha.toISOString().slice(0, 19).replace('T', ' ');
            }
        } else {
            // Si no se proporciona fecha, usar la fecha actual formateada
            const fecha = new Date();
            diagnosticoData.fecha_diagnostico = fecha.toISOString().slice(0, 19).replace('T', ' ');
        }


        if (diagnosticoData.fecha_creacion) {
            if (diagnosticoData.fecha_creacion instanceof Date ||
                (typeof diagnosticoData.fecha_creacion === 'string' && diagnosticoData.fecha_creacion.includes('T'))) {

                const fecha = new Date(diagnosticoData.fecha_creacion);
                diagnosticoData.fecha_creacion = fecha.toISOString().slice(0, 19).replace('T', ' ');
            }
        }

        return db.query('INSERT INTO diagnosticos SET ?', [diagnosticoData]);
    }

    static async updateDiagnostico(id, diagnosticoData) {
        // También formatear fechas al actualizar
        if (diagnosticoData.fecha_diagnostico) {
            if (diagnosticoData.fecha_diagnostico instanceof Date ||
                (typeof diagnosticoData.fecha_diagnostico === 'string' && diagnosticoData.fecha_diagnostico.includes('T'))) {

                const fecha = new Date(diagnosticoData.fecha_diagnostico);
                diagnosticoData.fecha_diagnostico = fecha.toISOString().slice(0, 19).replace('T', ' ');
            }
        }

        if (diagnosticoData.fecha_creacion) {
            if (diagnosticoData.fecha_creacion instanceof Date ||
                (typeof diagnosticoData.fecha_creacion === 'string' && diagnosticoData.fecha_creacion.includes('T'))) {

                const fecha = new Date(diagnosticoData.fecha_creacion);
                diagnosticoData.fecha_creacion = fecha.toISOString().slice(0, 19).replace('T', ' ');
            }
        }

        return db.query('UPDATE diagnosticos SET ? WHERE id_diagnostico = ?', [diagnosticoData, id]);
    }

    static async deleteDiagnostico(id) {
        return db.query('DELETE FROM diagnosticos WHERE id_diagnostico = ?', [id]);
    }
}

module.exports = DiagnosticosModel;