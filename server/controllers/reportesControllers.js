const ReportesModel = require('../models/reportesModel');

exports.getAllReportes = async (req, res, next) => { // Añadir next para manejo de errores
    try {
        // db.query devuelve [rows, fields], nos quedamos con rows ([asignaciones])
        const [resportes] = await ReportesModel.getAllReportes();
        res.json(reportes); // El array ahora contiene objetos con datos unidos
    } catch (error) {
        // Pasamos el error al siguiente middleware (el de manejo de errores)
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.getReportesById = async (req, res, next) => {
    try {
        const [reportes] = await ReportesModel.getReportesById(req.params.id);
        // Como getById devuelve un array, verificamos si tiene elementos
        if (reportes.length === 0) {
            // Usamos return para salir después de enviar la respuesta
            return res.status(404).json({ message: 'Reportes not found' });
        }
        // Devolvemos el primer (y único) elemento del array
        res.json(reportes[0]); // El objeto ahora contiene datos unidos
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

// create, update, delete no cambian su lógica principal aquí
exports.createReportes = async (req, res, next) => {
    try {
        // Validar req.body aquí sería ideal
        const [result] = await RportesModel.createReportes(req.body);
        // Devolvemos el ID insertado y los datos enviados
        res.status(201).json({ id_reportes: result.insertId, ...req.body });
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.updateReportes = async (req, res, next) => {
    try {
        // Validar req.body y req.params.id aquí sería ideal
        const [result] = await ReportesModel.updateReportes(req.params.id, req.body);
        // AffectedRows indica si se actualizó algo
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reportes not found or no data changed' });
        }
        res.json({ message: 'Reportes updated successfully' });
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.deleteReportes = async (req, res, next) => {
    try {
        // Validar req.params.id aquí sería ideal
        const [result] = await ReportesModel.deleteReportes(req.params.id);
        // AffectedRows indica si se eliminó algo
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reportes not found' });
        }
        res.json({ message: 'Reportes deleted successfully' });
        // Algunas APIs devuelven 204 No Content en DELETE exitoso
        // res.status(204).send();
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};