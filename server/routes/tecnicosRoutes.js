
const express = require('express');
const router = express.Router();
const tecnicosController = require('../controllers/tecnicosController');

router.get('/', tecnicosController.getAllTecnicos);
router.get('/:id', tecnicosController.getTecnicoById);
router.post('/', tecnicosController.createTecnico);
router.put('/:id', tecnicosController.updateTecnico);
router.delete('/:id', tecnicosController.deleteTecnico);
router.get('/usuario/:userId', tecnicosController.getTecnicoByUsuario);

module.exports = router;
