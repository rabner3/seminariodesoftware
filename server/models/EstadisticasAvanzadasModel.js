// server/models/EstadisticasAvanzadasModel.js
const db = require('../config/db');

class EstadisticasAvanzadasModel {
    // Obtener cantidad de equipos por estado
    static async getEquiposPorEstado() {
        const query = `
            SELECT estado, COUNT(*) as cantidad
            FROM equipos
            GROUP BY estado
            ORDER BY cantidad DESC
        `;
        return db.query(query);
    }

    // Obtener cantidad de equipos por departamento
    static async getEquiposPorDepartamento() {
        const query = `
            SELECT d.nombre as departamento, COUNT(e.id_equipo) as cantidad
            FROM departamentos d
            LEFT JOIN equipos e ON d.id_departamento = e.id_departamento
            GROUP BY d.id_departamento
            ORDER BY cantidad DESC
        `;
        return db.query(query);
    }

    // Obtener reparaciones por técnico
    static async getReparacionesPorTecnico() {
        const query = `
            SELECT t.id_tecnico, t.nombre, t.apellido, 
                   COUNT(r.id_reparacion) as total_reparaciones,
                   SUM(CASE WHEN r.estado = 'completada' THEN 1 ELSE 0 END) as reparaciones_completadas,
                   SUM(CASE WHEN r.estado = 'en_reparacion' THEN 1 ELSE 0 END) as reparaciones_en_proceso
            FROM tecnicos t
            LEFT JOIN reparaciones r ON t.id_tecnico = r.id_tecnico
            GROUP BY t.id_tecnico
            ORDER BY total_reparaciones DESC
        `;
        return db.query(query);
    }

    // Obtener tiempo promedio de reparación por técnico
    static async getTiempoPromedioReparacion() {
        const query = `
            SELECT t.id_tecnico, t.nombre, t.apellido, 
                   AVG(r.tiempo_total) as tiempo_promedio_minutos
            FROM tecnicos t
            JOIN reparaciones r ON t.id_tecnico = r.id_tecnico
            WHERE r.estado = 'completada' AND r.tiempo_total IS NOT NULL
            GROUP BY t.id_tecnico
            ORDER BY tiempo_promedio_minutos ASC
        `;
        return db.query(query);
    }

    // Obtener solicitudes por departamento
    static async getSolicitudesPorDepartamento() {
        const query = `
            SELECT d.nombre as departamento, COUNT(s.id_solicitud) as total_solicitudes,
                   SUM(CASE WHEN s.urgencia = 'alta' THEN 1 ELSE 0 END) as solicitudes_alta_prioridad,
                   SUM(CASE WHEN s.urgencia = 'media' THEN 1 ELSE 0 END) as solicitudes_media_prioridad,
                   SUM(CASE WHEN s.urgencia = 'baja' THEN 1 ELSE 0 END) as solicitudes_baja_prioridad
            FROM departamentos d
            JOIN usuarios u ON d.id_departamento = u.id_departamento
            LEFT JOIN solicitudes s ON u.id_usuarios = s.id_usuario
            GROUP BY d.id_departamento
            ORDER BY total_solicitudes DESC
        `;
        return db.query(query);
    }

    // Obtener equipos con más reparaciones
    static async getEquiposConMasReparaciones() {
        const query = `
            SELECT e.id_equipo, e.tipo, e.marca, e.modelo, e.numero_serie,
                   COUNT(r.id_reparacion) as total_reparaciones,
                   SUM(r.costo_final) as costo_total_reparaciones
            FROM equipos e
            JOIN reparaciones r ON e.id_equipo = r.id_equipo
            GROUP BY e.id_equipo
            ORDER BY total_reparaciones DESC
            LIMIT 10
        `;
        return db.query(query);
    }

    // Obtener estadísticas de asignaciones mensuales
    static async getAsignacionesMensuales() {
        const query = `
            SELECT 
                DATE_FORMAT(fecha_asignacion, '%Y-%m') as mes,
                COUNT(*) as total_asignaciones,
                COUNT(DISTINCT id_equipo) as equipos_asignados,
                COUNT(DISTINCT id_usuario) as usuarios_con_asignaciones
            FROM asignaciones
            WHERE fecha_asignacion >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY mes
            ORDER BY mes
        `;
        return db.query(query);
    }

    // Obtener estadísticas de reparaciones mensuales
    static async getReparacionesMensuales() {
        const query = `
            SELECT 
                DATE_FORMAT(fecha_recepcion, '%Y-%m') as mes,
                COUNT(*) as total_reparaciones,
                SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as reparaciones_completadas,
                SUM(CASE WHEN estado = 'descarte' THEN 1 ELSE 0 END) as equipos_descartados,
                AVG(tiempo_total) as tiempo_promedio_minutos,
                SUM(costo_final) as costo_total
            FROM reparaciones
            WHERE fecha_recepcion >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY mes
            ORDER BY mes
        `;
        return db.query(query);
    }

    // Obtener ranking de departamentos por costos de reparación
    static async getRankingDepartamentosPorCostos() {
        const query = `
            SELECT d.id_departamento, d.nombre as departamento,
                   SUM(r.costo_final) as costo_total_reparaciones,
                   COUNT(r.id_reparacion) as total_reparaciones,
                   AVG(r.costo_final) as costo_promedio_por_reparacion
            FROM departamentos d
            JOIN usuarios u ON d.id_departamento = u.id_departamento
            JOIN solicitudes s ON u.id_usuarios = s.id_usuario
            JOIN reparaciones r ON s.id_solicitud = r.id_solicitud
            WHERE r.costo_final IS NOT NULL
            GROUP BY d.id_departamento
            ORDER BY costo_total_reparaciones DESC
        `;
        return db.query(query);
    }
}

module.exports = EstadisticasAvanzadasModel;