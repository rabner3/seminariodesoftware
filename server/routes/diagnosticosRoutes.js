// server/routes/diagnosticosRoutes.js (modificado)
const express = require('express');
const router = express.Router();
const diagnosticosController = require('../controllers/diagnosticosController');

router.get('/', diagnosticosController.getAllDiagnosticos);
router.get('/:id', diagnosticosController.getDiagnosticoById);
router.get('/reparacion/:id', diagnosticosController.getDiagnosticosByReparacion);
router.get('/tecnico/:id', diagnosticosController.getDiagnosticosByTecnico);
router.post('/', diagnosticosController.createDiagnostico);
router.put('/:id', diagnosticosController.updateDiagnostico);
router.delete('/:id', diagnosticosController.deleteDiagnostico);

module.exports = router;