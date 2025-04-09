const TicketsModel = require('../models/ticketsModel');

exports.getAllTickets = async (req, res, next) => {
    try {

        const [tickets] = await TicketsModel.getAllTickets();
        res.json(tickets); 
    } catch (error) {

        next(error);
  
    }
};

exports.getTicketsById = async (req, res, next) => {
    try {
        const [tickets] = await TicketsModel.getTicketsById(req.params.id);
s
        if (tickets.length === 0) {
   
            return res.status(404).json({ message: 'Tickets not found' });
        }
      
        res.json(tickets[0]); 
    } catch (error) {
        next(error);

    }
};


exports.createTickets = async (req, res, next) => {
    try {

        const [result] = await TickectsModel.createTickets(req.body);

        res.status(201).json({ id_tickets: result.insertId, ...req.body });
    } catch (error) {
        next(error);

    }
};

exports.updateTickets = async (req, res, next) => {
    try {

        const [result] = await TicketsModel.updateTickets(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tickets not found or no data changed' });
        }
        res.json({ message: 'Tickets updated successfully' });
    } catch (error) {
        next(error);

    }
};

exports.deleteTickets = async (req, res, next) => {
    try {
       
        const [result] = await TicketsModel.deleteTickets(req.params.id);
    
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tickets not found' });
        }
        res.json({ message: 'Tickets deleted successfully' });

    } catch (error) {
        next(error);

    }
};