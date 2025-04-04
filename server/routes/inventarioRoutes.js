const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

router.get('/', inventarioController.getAllInventario);
router.get('/:id', inventarioController.getInventarioById);
router.post('/', inventarioController.createInventario);
router.put('/:id', inventarioController.updateInventario);
router.delete('/:id', inventarioController.deleteInventario);

module.exports = router;