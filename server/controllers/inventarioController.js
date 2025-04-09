const InventarioModel = require('.../models/InventarioModel');

exports.getAllInventario = async (req, res, next) => { 
    try {

        const [inventario] = await InventarioModel.getAllInventario();
        res.json(inventario); 
    } catch (error) {

        next(error);
 
    }
};

exports.getInventarioById = async (req, res, next) => {
    try {
        const [inventario] = await InventarioModel.getInventarioById(req.params.id);

        if (inventario.length === 0) {

            return res.status(404).json({ message: 'Inventario not found' });
        }

        res.json(inventario[0]); 
    } catch (error) {
        next(error);

    }
};


exports.createInventario = async (req, res, next) => {
    try {
  
        const [result] = await InventarioModel.createInventario(req.body);

        res.status(201).json({ id_inventario: result.insertId, ...req.body });
    } catch (error) {
        next(error);

    }
};

exports.updateInventario = async (req, res, next) => {
    try {

        const [result] = await InventarioModel.updateInventario(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Inventario not found or no data changed' });
        }
        res.json({ message: 'Inventario updated successfully' });
    } catch (error) {
        next(error);

    }
};

exports.deleteInventario = async (req, res, next) => {
    try {

        const [result] = await InventarioModel.deleteInventario(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Inventario not found' });
        }
        res.json({ message: 'Inventario deleted successfully' });
  
    } catch (error) {
        next(error);

    }
};