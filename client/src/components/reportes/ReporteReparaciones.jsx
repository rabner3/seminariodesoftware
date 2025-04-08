// client/src/components/reportes/ReporteReparaciones.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Registrar los componentes necesarios para Chart.js
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

function ReporteReparaciones() {
    const [reparaciones, setReparaciones] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [filtroTecnico, setFiltroTecnico] = useState('todos');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState(false);

    // Datos para gráficos
    const [datosGraficoEstado, setDatosGraficoEstado] = useState({
        labels: [],
        datasets: []
    });
    const [datosGraficoTiempo, setDatosGraficoTiempo] = useState({
        labels: [],
        datasets: []
    });
    const [datosGraficoCostos, setDatosGraficoCostos] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        // Cargar datos iniciales
        cargarDatos();

        // Establecer fechas por defecto (último mes)
        const hoy = new Date();
        const unMesAtras = new Date(hoy);
        unMesAtras.setMonth(hoy.getMonth() - 1);

        setFechaHasta(hoy.toISOString().split('T')[0]);
        setFechaDesde(unMesAtras.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        // Generar datos para gráficos cuando cambien las reparaciones
        if (reparaciones.length > 0) {
            generarDatosGraficos();
        }
    }, [reparaciones, fechaDesde, fechaHasta]);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            // Cargar reparaciones
            const responseReparaciones = await axios.get('http://localhost:8080/api/reparaciones');
            setReparaciones(responseReparaciones.data);

            // Cargar técnicos
            const responseTecnicos = await axios.get('http://localhost:8080/api/tecnicos');
            setTecnicos(responseTecnicos.data);

            // Cargar equipos
            const responseEquipos = await axios.get('http://localhost:8080/api/equipos');
            setEquipos(responseEquipos.data);

            setLoading(false);
        } catch (err) {
            setError(`Error al cargar datos: ${err.message}`);
            setLoading(false);
        }
    };

    const generarDatosGraficos = () => {
        // Datos para gráfico por estado
        const conteoEstados = {
            pendiente: 0,
            diagnostico: 0,
            en_reparacion: 0,
            espera_repuestos: 0,
            completada: 0,
            descarte: 0
        };

        reparaciones.forEach(reparacion => {
            if (reparacion.estado) {
                conteoEstados[reparacion.estado] = (conteoEstados[reparacion.estado] || 0) + 1;
            }
        });

        setDatosGraficoEstado({
            labels: Object.keys(conteoEstados),
            datasets: [
                {
                    label: 'Reparaciones por Estado',
                    data: Object.values(conteoEstados),
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(54, 235, 162, 0.6)',
                        'rgba(255, 99, 132, 0.6)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(54, 235, 162, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        });

        // Datos para gráfico de tiempo promedio por técnico
        const tiemposPorTecnico = {};
        const reparacionesPorTecnico = {};

        reparaciones
            .filter(r => r.estado === 'completada' && r.tiempo_total && r.id_tecnico)
            .forEach(reparacion => {
                if (!tiemposPorTecnico[reparacion.id_tecnico]) {
                    tiemposPorTecnico[reparacion.id_tecnico] = 0;
                    reparacionesPorTecnico[reparacion.id_tecnico] = 0;
                }

                tiemposPorTecnico[reparacion.id_tecnico] += reparacion.tiempo_total;
                reparacionesPorTecnico[reparacion.id_tecnico]++;
            });

        const promediosPorTecnico = {};
        Object.keys(tiemposPorTecnico).forEach(idTecnico => {
            if (reparacionesPorTecnico[idTecnico] > 0) {
                promediosPorTecnico[idTecnico] = tiemposPorTecnico[idTecnico] / reparacionesPorTecnico[idTecnico];
            }
        });

        const tecnicosConDatos = Object.keys(promediosPorTecnico);
        const nombresTecnicos = tecnicosConDatos.map(idTecnico => {
            const tecnico = tecnicos.find(t => t.id_tecnico === parseInt(idTecnico));
            return tecnico ? `${tecnico.nombre} ${tecnico.apellido}` : `Técnico ${idTecnico}`;
        });

        setDatosGraficoTiempo({
            labels: nombresTecnicos,
            datasets: [
                {
                    label: 'Tiempo Promedio de Reparación (minutos)',
                    data: tecnicosConDatos.map(idTecnico => promediosPorTecnico[idTecnico]),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        });

        // Datos para gráfico de costos por mes
        // Filtrar reparaciones por fecha
        const reparacionesFiltradas = reparaciones.filter(reparacion => {
            if (!reparacion.fecha_fin) return false;

            const fechaFin = new Date(reparacion.fecha_fin);
            const desde = fechaDesde ? new Date(fechaDesde) : null;
            const hasta = fechaHasta ? new Date(fechaHasta) : null;

            if (desde && fechaFin < desde) return false;
            if (hasta) {
                hasta.setHours(23, 59, 59);
                if (fechaFin > hasta) return false;
            }

            return true;
        });

        // Agrupar por mes/año
        const costosPorMes = {};

        reparacionesFiltradas.forEach(reparacion => {
            if (reparacion.fecha_fin && reparacion.costo_final) {
                const fecha = new Date(reparacion.fecha_fin);
                const mesAño = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

                if (!costosPorMes[mesAño]) {
                    costosPorMes[mesAño] = 0;
                }

                costosPorMes[mesAño] += reparacion.costo_final;
            }
        });

        // Ordenar por fecha
        const mesesOrdenados = Object.keys(costosPorMes).sort((a, b) => {
            const [mesA, añoA] = a.split('/').map(Number);
            const [mesB, añoB] = b.split('/').map(Number);

            if (añoA !== añoB) return añoA - añoB;
            return mesA - mesB;
        });

        setDatosGraficoCostos({
            labels: mesesOrdenados,
            datasets: [
                {
                    label: 'Costos de Reparación por Mes ($)',
                    data: mesesOrdenados.map(mes => costosPorMes[mes]),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        });
    };

    const filtrarReparaciones = () => {
        let reparacionesFiltradas = [...reparaciones];

        if (filtroTecnico !== 'todos') {
            reparacionesFiltradas = reparacionesFiltradas.filter(
                reparacion => reparacion.id_tecnico === parseInt(filtroTecnico)
            );
        }

        if (filtroEstado !== 'todos') {
            reparacionesFiltradas = reparacionesFiltradas.filter(
                reparacion => reparacion.estado === filtroEstado
            );
        }

        // Filtrar por fechas
        if (fechaDesde || fechaHasta) {
            reparacionesFiltradas = reparacionesFiltradas.filter(reparacion => {
                if (!reparacion.fecha_recepcion) return false;

                const fechaRecepcion = new Date(reparacion.fecha_recepcion);
                const desde = fechaDesde ? new Date(fechaDesde) : null;
                const hasta = fechaHasta ? new Date(fechaHasta) : null;

                if (desde && fechaRecepcion < desde) return false;
                if (hasta) {
                    hasta.setHours(23, 59, 59);
                    if (fechaRecepcion > hasta) return false;
                }

                return true;
            });
        }

        return reparacionesFiltradas;
    };

    const calcularEstadisticas = (reparacionesFiltradas) => {
        const totalReparaciones = reparacionesFiltradas.length;
        const reparacionesCompletadas = reparacionesFiltradas.filter(r => r.estado === 'completada').length;
        const reparacionesDescartadas = reparacionesFiltradas.filter(r => r.estado === 'descarte').length;

        // Calcular tiempo promedio
        const tiempoTotal = reparacionesFiltradas
            .filter(r => r.tiempo_total)
            .reduce((sum, r) => sum + r.tiempo_total, 0);

        const tiempoPromedio = reparacionesCompletadas > 0
            ? tiempoTotal / reparacionesCompletadas
            : 0;

        // Calcular costo promedio
        const costoTotal = reparacionesFiltradas
            .filter(r => r.costo_final)
            .reduce((sum, r) => sum + r.costo_final, 0);

        const costoPromedio = reparacionesCompletadas > 0
            ? costoTotal / reparacionesCompletadas
            : 0;

        return {
            totalReparaciones,
            reparacionesCompletadas,
            reparacionesDescartadas,
            tiempoPromedio,
            costoPromedio,
            costoTotal
        };
    };

    const generarPDF = () => {
        const reparacionesFiltradas = filtrarReparaciones();
        const estadisticas = calcularEstadisticas(reparacionesFiltradas);
        const doc = new jsPDF();

        // Título
        doc.setFontSize(16);
        doc.text('Reporte de Reparaciones', 105, 15, { align: 'center' });

        // Fecha de generación
        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });

        // Filtros aplicados
        doc.setFontSize(12);
        doc.text('Filtros aplicados:', 14, 30);
        doc.setFontSize(10);

        const tecnicoSeleccionado = filtroTecnico !== 'todos'
            ? tecnicos.find(t => t.id_tecnico === parseInt(filtroTecnico))
            : null;

        doc.text(`Técnico: ${tecnicoSeleccionado ? `${tecnicoSeleccionado.nombre} ${tecnicoSeleccionado.apellido}` : 'Todos'}`, 14, 36);
        doc.text(`Estado: ${filtroEstado === 'todos' ? 'Todos' : filtroEstado}`, 14, 42);
        doc.text(`Periodo: ${fechaDesde ? fechaDesde : 'Inicio'} - ${fechaHasta ? fechaHasta : 'Actualidad'}`, 14, 48);

        // Resumen estadístico
        doc.setFontSize(12);
        doc.text('Resumen Estadístico', 14, 56);

        doc.setFontSize(10);
        doc.text(`Total de Reparaciones: ${estadisticas.totalReparaciones}`, 14, 62);
        doc.text(`Reparaciones Completadas: ${estadisticas.reparacionesCompletadas}`, 14, 68);
        doc.text(`Reparaciones Descartadas: ${estadisticas.reparacionesDescartadas}`, 14, 74);
        doc.text(`Tiempo Promedio de Reparación: ${estadisticas.tiempoPromedio.toFixed(2)} minutos`, 14, 80);
        doc.text(`Costo Promedio de Reparación: $${estadisticas.costoPromedio.toFixed(2)}`, 14, 86);
        doc.text(`Costo Total: $${estadisticas.costoTotal.toFixed(2)}`, 14, 92);

        // Tabla de reparaciones
        const tableColumn = ['ID', 'Equipo', 'Técnico', 'Fecha Recepción', 'Estado', 'Tiempo (min)', 'Costo ($)'];
        const tableRows = [];

        reparacionesFiltradas.forEach(reparacion => {
            const tecnico = tecnicos.find(t => t.id_tecnico === reparacion.id_tecnico);
            const equipo = equipos.find(e => e.id_equipo === reparacion.id_equipo);

            const equipoInfo = equipo
                ? `${equipo.tipo} ${equipo.marca} ${equipo.modelo}`
                : `ID: ${reparacion.id_equipo}`;

            const nombreTecnico = tecnico
                ? `${tecnico.nombre} ${tecnico.apellido}`
                : `ID: ${reparacion.id_tecnico}`;

            const reparacionData = [
                reparacion.id_reparacion,
                equipoInfo,
                nombreTecnico,
                reparacion.fecha_recepcion ? new Date(reparacion.fecha_recepcion).toLocaleDateString() : 'N/A',
                reparacion.estado || 'N/A',
                reparacion.tiempo_total || 'N/A',
                reparacion.costo_final ? `$${reparacion.costo_final}` : 'N/A'
            ];
            tableRows.push(reparacionData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 100,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [66, 139, 202]
            }
        });

        // Guardar el PDF
        doc.save('reporte_reparaciones.pdf');
    };

    return (
        <div className="reporte-reparaciones">
            <div className="reporte-header">
                <h3>Reporte de Reparaciones</h3>
            </div>

            <div className="filtros-reporte">
                <div className="filtro-grupo">
                    <label>Técnico:</label>
                    <select
                        value={filtroTecnico}
                        onChange={(e) => setFiltroTecnico(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        {tecnicos.map(tecnico => (
                            <option key={tecnico.id_tecnico} value={tecnico.id_tecnico}>
                                {tecnico.nombre} {tecnico.apellido}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Estado:</label>
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="diagnostico">Diagnóstico</option>
                        <option value="en_reparacion">En Reparación</option>
                        <option value="espera_repuestos">Espera de Repuestos</option>
                        <option value="completada">Completada</option>
                        <option value="descarte">Descarte</option>
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Desde:</label>
                    <input
                        type="date"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />
                </div>

                <div className="filtro-grupo">
                    <label>Hasta:</label>
                    <input
                        type="date"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                    />
                </div>
            </div>

            <div className="reporte-acciones">
                <button className="button azul-claro" onClick={generarPDF}>
                    Exportar a PDF
                </button>
                <button
                    className="button"
                    onClick={() => setVistaPrevia(!vistaPrevia)}
                >
                    {vistaPrevia ? 'Ocultar Vista Previa' : 'Mostrar Vista Previa'}
                </button>
            </div>

            {vistaPrevia && (
                <div className="vista-previa">
                    <h4>Vista Previa del Reporte</h4>

                    <div className="graficas-container">
                        <div className="grafica">
                            <h5>Distribución por Estado</h5>
                            {datosGraficoEstado.labels.length > 0 && (
                                <Pie
                                    data={datosGraficoEstado}
                                    options={{

                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'right',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Reparaciones por Estado'
                                            }
                                        }
                                    }}
                                />
                            )}
                        </div>

                        <div className="grafica">
                            <h5>Tiempo Promedio por Técnico</h5>
                            {datosGraficoTiempo.labels.length > 0 && (
                                <Bar
                                    data={datosGraficoTiempo}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                            title: {
                                                display: true,
                                                text: 'Minutos Promedio por Reparación'
                                            }
                                        }
                                    }}
                                />
                            )}
                        </div>

                        <div className="grafica grafica-full">
                            <h5>Costos de Reparación por Mes</h5>
                            {datosGraficoCostos.labels.length > 0 && (
                                <Line
                                    data={datosGraficoCostos}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Costos Mensuales de Reparación'
                                            }
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="estadisticas-resumen">
                        <h5>Resumen Estadístico</h5>
                        {(() => {
                            const reparacionesFiltradas = filtrarReparaciones();
                            const estadisticas = calcularEstadisticas(reparacionesFiltradas);

                            return (
                                <div className="stats-cards">
                                    <div className="stat-card">
                                        <div className="stat-title">Total Reparaciones</div>
                                        <div className="stat-value">{estadisticas.totalReparaciones}</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-title">Completadas</div>
                                        <div className="stat-value">{estadisticas.reparacionesCompletadas}</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-title">Descartadas</div>
                                        <div className="stat-value">{estadisticas.reparacionesDescartadas}</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-title">Tiempo Promedio</div>
                                        <div className="stat-value">{estadisticas.tiempoPromedio.toFixed(0)} min</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-title">Costo Promedio</div>
                                        <div className="stat-value">${estadisticas.costoPromedio.toFixed(2)}</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-title">Costo Total</div>
                                        <div className="stat-value">${estadisticas.costoTotal.toFixed(2)}</div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    <div className="tabla-container">
                        <h5>Listado de Reparaciones ({filtrarReparaciones().length})</h5>
                        <table className="reporte-tabla">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Equipo</th>
                                    <th>Técnico</th>
                                    <th>Fecha Recepción</th>
                                    <th>Estado</th>
                                    <th>Tiempo (min)</th>
                                    <th>Costo ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrarReparaciones().map(reparacion => {
                                    const tecnico = tecnicos.find(t => t.id_tecnico === reparacion.id_tecnico);
                                    const equipo = equipos.find(e => e.id_equipo === reparacion.id_equipo);

                                    return (
                                        <tr key={reparacion.id_reparacion}>
                                            <td>{reparacion.id_reparacion}</td>
                                            <td>{equipo ? `${equipo.tipo} ${equipo.marca} ${equipo.modelo}` : `ID: ${reparacion.id_equipo}`}</td>
                                            <td>{tecnico ? `${tecnico.nombre} ${tecnico.apellido}` : `ID: ${reparacion.id_tecnico}`}</td>
                                            <td>{reparacion.fecha_recepcion ? new Date(reparacion.fecha_recepcion).toLocaleDateString() : 'N/A'}</td>
                                            <td>{reparacion.estado || 'N/A'}</td>
                                            <td>{reparacion.tiempo_total || 'N/A'}</td>
                                            <td>{reparacion.costo_final ? `$${reparacion.costo_final}` : 'N/A'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReporteReparaciones;