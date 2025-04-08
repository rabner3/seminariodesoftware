const InventarioModel = require('../models/inventarioModel');

exports.getAllInventario = async (req, res, next) => { // Añadir next para manejo de errores
    try {
        // db.query devuelve [rows, fields], nos quedamos con rows ([asignaciones])
        const [inventario] = await InventarioModel.getAllInventario();
        res.json(inventario); // El array ahora contiene objetos con datos unidos
    } catch (error) {
        // Pasamos el error al siguiente middleware (el de manejo de errores)
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.getInventarioById = async (req, res, next) => {
    try {
        const [inventario] = await InventarioModel.getInventarioById(req.params.id);
        // Como getById devuelve un array, verificamos si tiene elementos
        if (inventario.length === 0) {
            // Usamos return para salir después de enviar la respuesta
            return res.status(404).json({ message: 'Inventario not found' });
        }
        // Devolvemos el primer (y único) elemento del array
        res.json(inventario[0]); // El objeto ahora contiene datos unidos
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

// create, update, delete no cambian su lógica principal aquí
exports.createInventario = async (req, res, next) => {
    try {
        // Validar req.body aquí sería ideal
        const [result] = await InventarioModel.createInventario(req.body);
        // Devolvemos el ID insertado y los datos enviados
        res.status(201).json({ id_inventario: result.insertId, ...req.body });
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.updateInventario = async (req, res, next) => {
    try {
        // Validar req.body y req.params.id aquí sería ideal
        const [result] = await InventarioModel.updateInventario(req.params.id, req.body);
        // AffectedRows indica si se actualizó algo
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Inventario not found or no data changed' });
        }
        res.json({ message: 'Inventario updated successfully' });
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.deleteInventario = async (req, res, next) => {
    try {
        // Validar req.params.id aquí sería ideal
        const [result] = await InventarioModel.deleteInventario(req.params.id);
        // AffectedRows indica si se eliminó algo
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Inventario not found' });
        }
        res.json({ message: 'Inventario deleted successfully' });
        // Algunas APIs devuelven 204 No Content en DELETE exitoso
        // res.status(204).send();
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};