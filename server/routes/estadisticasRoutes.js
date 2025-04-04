const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticasController');

router.get('/', estadisticasController.getAllEstadisticas);
router.get('/:id', estadisticasController.getEstadisticaById);
router.post('/', estadisticasController.createEstadistica);
router.put('/:id', estadisticasController.updateEstadistica);
router.delete('/:id', estadisticasController.deleteEstadistica);

module.exports = router;