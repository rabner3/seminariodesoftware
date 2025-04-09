// server/controllers/reportesAvanzadosController.js
const ReportesAvanzadosModel = require('../models/ReportesAvanzadosModel');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);


const asegurarDirectorio = async (ruta) => {
    try {
        await mkdirAsync(ruta, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
};

exports.getReporteInventarioCompleto = async (req, res, next) => {
    try {
        const [datos] = await ReportesAvanzadosModel.getReporteInventarioCompleto();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getReporteAsignacionesActivas = async (req, res, next) => {
    try {
        const [datos] = await ReportesAvanzadosModel.getReporteAsignacionesActivas();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getReporteHistorialAsignaciones = async (req, res, next) => {
    try {
 
        const filtros = {
            estado: req.query.estado,
            id_equipo: req.query.id_equipo,
            id_usuario: req.query.id_usuario,
            id_departamento: req.query.id_departamento,
            fecha_desde: req.query.fecha_desde,
            fecha_hasta: req.query.fecha_hasta
        };
        
        const [datos] = await ReportesAvanzadosModel.getReporteHistorialAsignaciones(filtros);
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getReporteReparacionesEnProceso = async (req, res, next) => {
    try {
        const [datos] = await ReportesAvanzadosModel.getReporteReparacionesEnProceso();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getReporteHistorialReparaciones = async (req, res, next) => {
    try {

        const filtros = {
            estado: req.query.estado,
            id_equipo: req.query.id_equipo,
            id_tecnico: req.query.id_tecnico,
            fecha_desde: req.query.fecha_desde,
            fecha_hasta: req.query.fecha_hasta
        };
        
        const [datos] = await ReportesAvanzadosModel.getReporteHistorialReparaciones(filtros);
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getReporteSolicitudesPendientes = async (req, res, next) => {
    try {
        const [datos] = await ReportesAvanzadosModel.getReporteSolicitudesPendientes();
        res.json(datos);
    } catch (error) {
        next(error);
    }
};

exports.getReporteCostosReparacion = async (req, res, next) => {
    try {
        const fechaDesde = req.query.fecha_desde || '2000-01-01';
        const fechaHasta = req.query.fecha_hasta || new Date().toISOString().split('T')[0];
        
        const [datos] = await ReportesAvanzadosModel.getReporteCostosReparacion(fechaDesde, fechaHasta);
        res.json(datos);
    } catch (error) {
        next(error);
    }
};


exports.generarYGuardarReporte = async (req, res, next) => {
    try {

        let datos;
        const tipoReporte = req.body.tipo;
        const formatoReporte = req.body.formato || 'json';
        
        switch (tipoReporte) {
            case 'inventario':
                [datos] = await ReportesAvanzadosModel.getReporteInventarioCompleto();
                break;
            case 'asignaciones':
                if (req.body.subtipo === 'activas') {
                    [datos] = await ReportesAvanzadosModel.getReporteAsignacionesActivas();
                } else {
                    [datos] = await ReportesAvanzadosModel.getReporteHistorialAsignaciones(req.body.filtros || {});
                }
                break;
            case 'reparaciones':
                if (req.body.subtipo === 'en_proceso') {
                    [datos] = await ReportesAvanzadosModel.getReporteReparacionesEnProceso();
                } else {
                    [datos] = await ReportesAvanzadosModel.getReporteHistorialReparaciones(req.body.filtros || {});
                }
                break;
            case 'solicitudes':
                [datos] = await ReportesAvanzadosModel.getReporteSolicitudesPendientes();
                break;
            case 'costos':
                const fechaDesde = req.body.fecha_desde || '2000-01-01';
                const fechaHasta = req.body.fecha_hasta || new Date().toISOString().split('T')[0];
                [datos] = await ReportesAvanzadosModel.getReporteCostosReparacion(fechaDesde, fechaHasta);
                break;
            default:
                return res.status(400).json({ message: 'Tipo de reporte no válido' });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const nombreArchivo = `reporte_${tipoReporte}_${timestamp}.${formatoReporte}`;
        
    
        const dirReportes = path.join(__dirname, '..', 'reportes');
        await asegurarDirectorio(dirReportes);
        

        const rutaArchivo = path.join(dirReportes, nombreArchivo);
        

        await writeFileAsync(
            rutaArchivo, 
            JSON.stringify(datos, null, 2), 
            'utf8'
        );
        
  
        const reporteData = {
            nombre: `Reporte de ${tipoReporte}`,
            tipo: tipoReporte,
            id_usuario_generador: req.body.id_usuario_generador || 1, 
            formato: formatoReporte,
            ruta_archivo: rutaArchivo,
            fecha_generacion: new Date(),
            parametro: JSON.stringify(req.body.filtros || {}),
            creado_por: req.body.id_usuario_generador || 1,
            fecha_creacion: new Date()
        };
        
        const [result] = await ReportesAvanzadosModel.guardarReporte(reporteData);
        
        res.json({
            message: 'Reporte generado exitosamente',
            id_reporte: result.insertId,
            nombre_archivo: nombreArchivo,
            ruta_archivo: rutaArchivo
        });
    } catch (error) {
        next(error);
    }
};


exports.getReporteById = async (req, res, next) => {
    try {
        const [reporte] = await ReportesAvanzadosModel.getReporteById(req.params.id);
        
        if (reporte.length === 0) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        

        const rutaArchivo = reporte[0].ruta_archivo;
        
        try {
            if (fs.existsSync(rutaArchivo)) {

                const contenido = fs.readFileSync(rutaArchivo, 'utf8');
                
   
                res.json({
                    ...reporte[0],
                    contenido: JSON.parse(contenido)
                });
            } else {
                res.status(404).json({ 
                    message: 'El archivo de reporte no existe',
                    metadata: reporte[0]
                });
            }
        } catch (fileError) {
            res.status(500).json({ 
                message: 'Error al leer el archivo de reporte',
                error: fileError.message,
                metadata: reporte[0]
            });
        }
    } catch (error) {
        next(error);
    }
};