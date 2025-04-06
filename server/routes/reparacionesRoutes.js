
const express = require('express');
const router = express.Router();
const reparacionesController = require('../controllers/reparacionesController');

router.get('/', reparacionesController.getAllReparaciones);
router.get('/tecnico/:id', reparacionesController.getReparacionesByTecnico);
router.get('/:id', reparacionesController.getReparacionById);
router.post('/', reparacionesController.createReparacion);
router.put('/:id', reparacionesController.updateReparacion);
router.delete('/:id', reparacionesController.deleteReparacion);


module.exports = router;
