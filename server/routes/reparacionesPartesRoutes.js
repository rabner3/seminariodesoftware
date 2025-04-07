// server/routes/reparacionesPartesRoutes.js
const express = require('express');
const router = express.Router();
const reparacionesPartesController = require('../controllers/reparacionesPartesController');

router.get('/', reparacionesPartesController.getAllReparacionesPartes);
router.get('/:id', reparacionesPartesController.getReparacionParteById);
router.get('/reparacion/:id', reparacionesPartesController.getReparacionesByReparacion);
router.post('/', reparacionesPartesController.createReparacionParte);
router.put('/:id', reparacionesPartesController.updateReparacionParte);
router.delete('/:id', reparacionesPartesController.deleteReparacionParte);

module.exports = router;