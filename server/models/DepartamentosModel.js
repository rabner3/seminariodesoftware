
const db = require('../config/db');

class DepartamentosModel {
    static async getAllDepartamentos() {
        const query = `
            SELECT d.*, u.nombre as responsable_nombre, u.apellido as responsable_apellido 
            FROM departamentos d
            LEFT JOIN usuarios u ON d.id_responsable = u.id_usuarios
        `;
        return db.query(query);
    }

    static async getDepartamentoById(id) {
        const query = `
            SELECT d.*, u.nombre as responsable_nombre, u.apellido as responsable_apellido 
            FROM departamentos d
            LEFT JOIN usuarios u ON d.id_responsable = u.id_usuarios
            WHERE d.id_departamento = ?
        `;
        return db.query(query, [id]);
    }

    static async createDepartamento(departamentoData) {

        departamentoData.fecha_creacion = departamentoData.fecha_creacion || new Date();
        departamentoData.fecha_actualizacion = new Date();
        
        return db.query('INSERT INTO departamentos SET ?', [departamentoData]);
    }

    static async updateDepartamento(id, departamentoData) {

        departamentoData.fecha_actualizacion = new Date();
        
        return db.query('UPDATE departamentos SET ? WHERE id_departamento = ?', [departamentoData, id]);
    }

    static async deleteDepartamento(id) {
        return db.query('DELETE FROM departamentos WHERE id_departamento = ?', [id]);
    }
}

module.exports = DepartamentosModel;