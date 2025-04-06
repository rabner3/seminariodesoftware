
const express = require('express');
const router = express.Router();
const diagnosticosController = require('../controllers/diagnosticosController');

router.get('/', diagnosticosController.getAllDiagnosticos);
router.get('/:id', diagnosticosController.getDiagnosticoById);
router.post('/', diagnosticosController.createDiagnostico);
router.put('/:id', diagnosticosController.updateDiagnostico);
router.delete('/:id', diagnosticosController.deleteDiagnostico);

module.exports = router;
