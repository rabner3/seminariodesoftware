
const db = require('../config/db');

class DepartamentosModel {
    static async getAllDepartamentos() {
        return db.query('SELECT * FROM departamentos');
    }

    static async getDepartamentoById(id) {
        return db.query('SELECT * FROM departamentos WHERE id_departamento = ?', [id]);
    }

    static async createDepartamento(departamentoData) {
        return db.query('INSERT INTO departamentos SET ?', [departamentoData]);
    }

    static async updateDepartamento(id, departamentoData) {
        return db.query('UPDATE departamentos SET ? WHERE id_departamento = ?', [departamentoData, id]);
    }

    static async deleteDepartamento(id) {
        return db.query('DELETE FROM departamentos WHERE id_departamento = ?', [id]);
    }
}

module.exports = DepartamentosModel;
