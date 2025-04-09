
const EstadisticasAvanzadasModel = require('../models/EstadisticasAvanzadasModel');

exports.getEquiposPorEstado = async (req, res, next) => {
    try {
        const [datos] = await EstadisticasAvanzadasModel.getEquiposPorEstado();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getEquiposPorDepartamento = async (req, res, next) => {
    try {
        const [datos] = await EstadisticasAvanzadasModel.getEquiposPorDepartamento();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getReparacionesPorTecnico = async (req, res, next) => {
    try {
        const [datos] = await EstadisticasAvanzadasModel.getReparacionesPorTecnico();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getTiempoPromedioReparacion = async (req, res, next) => {
    try {
        const [datos] = await EstadisticasAvanzadasModel.getTiempoPromedioReparacion();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getSolicitudesPorDepartamento = async (req, res, next) => {
    try {
        const [datos] = await EstadisticasAvanzadasModel.getSolicitudesPorDepartamento();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getEquiposConMasReparaciones = async (req, res, next) => {
    try {
        const [datos] = await EstadisticasAvanzadasModel.getEquiposConMasReparaciones();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getAsignacionesMensuales = async (req, res, next) => {
    try {
        const [datos] = await EstadisticasAvanzadasModel.getAsignacionesMensuales();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getReparacionesMensuales = async (req, res, next) => {
    try {
        const [datos] = await EstadisticasAvanzadasModel.getReparacionesMensuales();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getRankingDepartamentosPorCostos = async (req, res, next) => {
    try {
        const [datos] = await EstadisticasAvanzadasModel.getRankingDepartamentosPorCostos();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

// Método para obtener un dashboard completo con todas las estadísticas
exports.getDashboardCompleto = async (req, res, next) => {
    try {
        const [equiposPorEstado] = await EstadisticasAvanzadasModel.getEquiposPorEstado();
        const [equiposPorDepartamento] = await EstadisticasAvanzadasModel.getEquiposPorDepartamento();
        const [reparacionesPorTecnico] = await EstadisticasAvanzadasModel.getReparacionesPorTecnico();
        const [tiempoPromedioReparacion] = await EstadisticasAvanzadasModel.getTiempoPromedioReparacion();
        const [solicitudesPorDepartamento] = await EstadisticasAvanzadasModel.getSolicitudesPorDepartamento();
        const [equiposConMasReparaciones] = await EstadisticasAvanzadasModel.getEquiposConMasReparaciones();
        const [asignacionesMensuales] = await EstadisticasAvanzadasModel.getAsignacionesMensuales();
        const [reparacionesMensuales] = await EstadisticasAvanzadasModel.getReparacionesMensuales();
        
        res.json({
            equiposPorEstado,
            equiposPorDepartamento,
            reparacionesPorTecnico,
            tiempoPromedioReparacion,
            solicitudesPorDepartamento,
            equiposConMasReparaciones,
            asignacionesMensuales,
            reparacionesMensuales
        });
    } catch (error) {
        next(error);
    }
};