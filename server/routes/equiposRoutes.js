
const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equiposController');

router.get('/ultimoId', equiposController.getUltimoId);
router.get('/', equiposController.getAllEquipos);
router.get('/:id', equiposController.getEquipoById);
router.post('/', equiposController.createEquipo);
router.put('/:id', equiposController.updateEquipo);
router.delete('/:id', equiposController.deleteEquipo);
router.get('/departamento/:id_departamento', equiposController.getEquiposByDepartamento);

module.exports = router;
