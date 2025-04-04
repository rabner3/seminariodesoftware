const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

router.get('/', ticketsController.getAllTickets);
router.get('/:id', ticketsController.getTickectsById);
router.post('/', ticketsController.createTickets);
router.put('/:id', ticketsController.updateTickets);
router.delete('/:id', ticketsController.deleteTickets);

module.exports = router;