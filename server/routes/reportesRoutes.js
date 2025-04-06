const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesControllers');

router.get('/', reportesController.getAllReportes);
router.get('/:id', reportesController.getReportesById);
router.post('/', reportesController.createReportes);
router.put('/:id', reportesController.updateReportes);
router.delete('/:id', reportesController.deleteReportes);

module.exports = router;