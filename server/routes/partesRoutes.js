
const express = require('express');
const router = express.Router();
const partesController = require('../controllers/partesController');

router.get('/', partesController.getAllPartes);
router.get('/:id', partesController.getParteById);
router.post('/', partesController.createParte);
router.put('/:id', partesController.updateParte);
router.delete('/:id', partesController.deleteParte);

module.exports = router;
