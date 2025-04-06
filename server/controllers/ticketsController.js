const TicketsModel = require('../models/ticketsModel');

exports.getAllTickets = async (req, res, next) => { // Añadir next para manejo de errores
    try {
        // db.query devuelve [rows, fields], nos quedamos con rows ([asignaciones])
        const [tickets] = await TicketsModel.getAllTickets();
        res.json(tickets); // El array ahora contiene objetos con datos unidos
    } catch (error) {
        // Pasamos el error al siguiente middleware (el de manejo de errores)
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.getTicketsById = async (req, res, next) => {
    try {
        const [tickets] = await TicketsModel.getTicketsById(req.params.id);
        // Como getById devuelve un array, verificamos si tiene elementos
        if (tickets.length === 0) {
            // Usamos return para salir después de enviar la respuesta
            return res.status(404).json({ message: 'Tickets not found' });
        }
        // Devolvemos el primer (y único) elemento del array
        res.json(tickets[0]); // El objeto ahora contiene datos unidos
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

// create, update, delete no cambian su lógica principal aquí
exports.createTickets = async (req, res, next) => {
    try {
        // Validar req.body aquí sería ideal
        const [result] = await TickectsModel.createTickets(req.body);
        // Devolvemos el ID insertado y los datos enviados
        res.status(201).json({ id_tickets: result.insertId, ...req.body });
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.updateTickets = async (req, res, next) => {
    try {
        // Validar req.body y req.params.id aquí sería ideal
        const [result] = await TicketsModel.updateTickets(req.params.id, req.body);
        // AffectedRows indica si se actualizó algo
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tickets not found or no data changed' });
        }
        res.json({ message: 'Tickets updated successfully' });
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.deleteTickets = async (req, res, next) => {
    try {
        // Validar req.params.id aquí sería ideal
        const [result] = await TicketsModel.deleteTickets(req.params.id);
        // AffectedRows indica si se eliminó algo
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tickets not found' });
        }
        res.json({ message: 'Tickets deleted successfully' });
        // Algunas APIs devuelven 204 No Content en DELETE exitoso
        // res.status(204).send();
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};