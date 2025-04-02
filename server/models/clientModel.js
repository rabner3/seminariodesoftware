const db = require('../config/db');

class ClientModel {
    static getAllClients() {
        return db.query('SELECT * FROM client');
    }

    static getClientById(id) {
        return db.query('SELECT * FROM client WHERE id = ?', [id]);
    }

    static createClient(clientData) {
        return db.query('INSERT INTO client SET ?', clientData);
    }

    static updateClient(id, clientData) {
        return db.query('UPDATE client SET ? WHERE id = ?', [clientData, id]);
    }

    static deleteClient(id) {
        return db.query('DELETE FROM client WHERE id = ?', [id]);
    }
}

module.exports = ClientModel;