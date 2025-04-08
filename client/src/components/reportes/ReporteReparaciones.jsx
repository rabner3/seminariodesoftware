
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
    
    const [loading, setLoading] = useState(true); // Variable de estado 'loading' y función 'setLoading'
    const [error, setError] = useState(null);     // Variable de estado 'error' y función 'setError'
    
    const [vistaPrevia, setVistaPrevia] = useState(false);

    
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
        
        cargarDatos();

        
        const hoy = new Date();
        const unMesAtras = new Date(hoy);
        unMesAtras.setMonth(hoy.getMonth() - 1);

        setFechaHasta(hoy.toISOString().split('T')[0]);
        setFechaDesde(unMesAtras.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        
        if (reparaciones.length > 0) {
            generarDatosGraficos();
        }
        
    }, [reparaciones, fechaDesde, fechaHasta]); // Dependencias para regenerar gráficos

    const cargarDatos = async () => {
        console.log("Iniciando carga de datos..."); // Log inicial
        try {
            setLoading(true);
            setError(null); // Limpia errores previos

            console.log("Cargando reparaciones desde:", 'http://localhost:8080/api/reparaciones');
            const responseReparaciones = await axios.get('http://localhost:8080/api/reparaciones');
            console.log("Reparaciones recibidas:", responseReparaciones.data); // Log de datos
            setReparaciones(responseReparaciones.data);

            console.log("Cargando técnicos desde:", 'http://localhost:8080/api/tecnicos');
            const responseTecnicos = await axios.get('http://localhost:8080/api/tecnicos');
            console.log("Técnicos recibidos:", responseTecnicos.data); // Log de datos
            setTecnicos(responseTecnicos.data);

            console.log("Cargando equipos desde:", 'http://localhost:8080/api/equipos');
            const responseEquipos = await axios.get('http://localhost:8080/api/equipos');
            console.log("Equipos recibidos:", responseEquipos.data); // Log de datos
            setEquipos(responseEquipos.data);

            setLoading(false);
            console.log("Carga de datos completada.");

        } catch (err) {
            console.error("Error en cargarDatos:", err); // Log del error completo
            let errorMessage = `Error al cargar datos: ${err.message}`;
            if (err.response) {
                
                errorMessage += ` (Status: ${err.response.status}, Data: ${JSON.stringify(err.response.data)})`;
            } else if (err.request) {
                
                errorMessage += " (No se recibió respuesta del servidor. ¿Está corriendo? ¿Problema de CORS?)";
            }
            
            setError(errorMessage);
            setLoading(false);
        }
    };

    const generarDatosGraficos = () => {
        
        const conteoEstados = {
            pendiente: 0,
            diagnostico: 0,
            en_reparacion: 0,
            espera_repuestos: 0,
            completada: 0,
            descarte: 0
        };

        reparaciones.forEach(reparacion => {
            if (reparacion.estado && conteoEstados.hasOwnProperty(reparacion.estado)) { // Asegurar que el estado existe
                conteoEstados[reparacion.estado]++;
            } else if (reparacion.estado) {
                console.warn(`Estado desconocido encontrado: ${reparacion.estado}`); // Advertir sobre estados inesperados
            }
        });

        setDatosGraficoEstado({
            labels: Object.keys(conteoEstados),
            datasets: [
                {
                    label: 'Reparaciones por Estado',
                    data: Object.values(conteoEstados),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',  // pendiente (rojo)
                        'rgba(54, 162, 235, 0.6)',  // diagnostico (azul)
                        'rgba(255, 206, 86, 0.6)',  // en_reparacion (amarillo)
                        'rgba(153, 102, 255, 0.6)', // espera_repuestos (morado)
                        'rgba(75, 192, 192, 0.6)',  // completada (verde-azulado)
                        'rgba(100, 100, 100, 0.6)'  // descarte (gris)
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(100, 100, 100, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        });

        
        const tiemposPorTecnico = {};
        const reparacionesPorTecnico = {};

        reparaciones
            .filter(r => r.estado === 'completada' && r.tiempo_total != null && r.id_tecnico != null) // Usar != null para cubrir 0 también
            .forEach(reparacion => {
                if (!tiemposPorTecnico[reparacion.id_tecnico]) {
                    tiemposPorTecnico[reparacion.id_tecnico] = 0;
                    reparacionesPorTecnico[reparacion.id_tecnico] = 0;
                }

                
                const tiempo = Number(reparacion.tiempo_total);
                if (!isNaN(tiempo)) {
                    tiemposPorTecnico[reparacion.id_tecnico] += tiempo;
                    reparacionesPorTecnico[reparacion.id_tecnico]++;
                } else {
                     console.warn(`Tiempo total inválido para reparación ${reparacion.id_reparacion}: ${reparacion.tiempo_total}`);
                }
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
            return tecnico ? `${tecnico.nombre} ${tecnico.apellido}` : `Técnico ID: ${idTecnico}`;
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

        
        const reparacionesFechadas = reparaciones.filter(reparacion => {
            // Usaremos fecha_fin para costos, asegurándonos que exista y sea válida
            if (!reparacion.fecha_fin) return false;
            try {
                const fechaFin = new Date(reparacion.fecha_fin);
                 // Validar si la fecha es realmente una fecha válida
                if (isNaN(fechaFin.getTime())) {
                    console.warn(`Fecha fin inválida para reparación ${reparacion.id_reparacion}: ${reparacion.fecha_fin}`);
                    return false;
                }

                const desde = fechaDesde ? new Date(fechaDesde + 'T00:00:00') : null; // Asegurar inicio del día
                const hasta = fechaHasta ? new Date(fechaHasta + 'T23:59:59') : null; // Asegurar fin del día

                if (desde && fechaFin < desde) return false;
                if (hasta && fechaFin > hasta) return false;

                return true;
            } catch (e) {
                 console.warn(`Error parseando fecha_fin para reparación ${reparacion.id_reparacion}: ${reparacion.fecha_fin}`, e);
                 return false;
            }
        });

        
        const costosPorMes = {};

        reparacionesFechadas.forEach(reparacion => {
             
            const costo = Number(reparacion.costo_final);
            if (reparacion.fecha_fin && !isNaN(costo)) {
                const fecha = new Date(reparacion.fecha_fin);
                
                const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                const año = fecha.getFullYear();
                const mesAño = `${año}-${mes}`; // Usar YYYY-MM para ordenamiento natural

                if (!costosPorMes[mesAño]) {
                    costosPorMes[mesAño] = 0;
                }
                costosPorMes[mesAño] += costo;
            } else if (reparacion.fecha_fin && reparacion.costo_final != null) {
                 console.warn(`Costo final inválido para reparación ${reparacion.id_reparacion}: ${reparacion.costo_final}`);
            }
        });

        
        const mesesOrdenados = Object.keys(costosPorMes).sort();

        
        const etiquetasMeses = mesesOrdenados.map(mesAño => {
            const [año, mes] = mesAño.split('-');
            return `${mes}/${año}`;
        });


        setDatosGraficoCostos({
            labels: etiquetasMeses, // Usar etiquetas legibles
            datasets: [
                {
                    label: 'Costos de Reparación por Mes ($)',
                    data: mesesOrdenados.map(mes => costosPorMes[mes]), // Usar claves ordenadas
                    fill: false, // Para gráfico de línea
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1 // Suavizar línea
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

        
        if (fechaDesde || fechaHasta) {
            reparacionesFiltradas = reparacionesFiltradas.filter(reparacion => {
                if (!reparacion.fecha_recepcion) return false; // Si no hay fecha, no se puede filtrar

                try {
                    const fechaRecepcion = new Date(reparacion.fecha_recepcion);
                     if (isNaN(fechaRecepcion.getTime())) return false; // Ignorar fechas inválidas

                    
                    const desde = fechaDesde ? new Date(fechaDesde + 'T00:00:00') : null;
                    const hasta = fechaHasta ? new Date(fechaHasta + 'T23:59:59') : null;

                    if (desde && fechaRecepcion < desde) return false;
                    if (hasta && fechaRecepcion > hasta) return false;

                    return true;
                } catch(e) {
                     console.warn(`Error parseando fecha_recepcion para reparación ${reparacion.id_reparacion}: ${reparacion.fecha_recepcion}`, e);
                     return false;
                }
            });
        }

        return reparacionesFiltradas;
    };

    const calcularEstadisticas = (reparacionesFiltradas) => {
        const totalReparaciones = reparacionesFiltradas.length;
        const reparacionesCompletadasLista = reparacionesFiltradas.filter(r => r.estado === 'completada');
        const reparacionesCompletadas = reparacionesCompletadasLista.length;
        const reparacionesDescartadas = reparacionesFiltradas.filter(r => r.estado === 'descarte').length;

        
        const tiempoTotal = reparacionesCompletadasLista
            .map(r => Number(r.tiempo_total)) // Convertir a número
            .filter(t => !isNaN(t) && t != null) // Filtrar inválidos o nulos
            .reduce((sum, t) => sum + t, 0);

        const numeroRepConTiempoValido = reparacionesCompletadasLista.filter(r => !isNaN(Number(r.tiempo_total)) && r.tiempo_total != null).length;

        const tiempoPromedio = numeroRepConTiempoValido > 0
            ? tiempoTotal / numeroRepConTiempoValido
            : 0;

        
        const costoTotal = reparacionesCompletadasLista
            .map(r => Number(r.costo_final)) // Convertir a número
            .filter(c => !isNaN(c) && c != null) // Filtrar inválidos o nulos
            .reduce((sum, c) => sum + c, 0);

         const numeroRepConCostoValido = reparacionesCompletadasLista.filter(r => !isNaN(Number(r.costo_final)) && r.costo_final != null).length;

        const costoPromedio = numeroRepConCostoValido > 0
            ? costoTotal / numeroRepConCostoValido
            : 0;

        
         const costoTotalGeneral = reparacionesFiltradas
             .map(r => Number(r.costo_final))
             .filter(c => !isNaN(c) && c != null)
             .reduce((sum, c) => sum + c, 0);

        return {
            totalReparaciones,
            reparacionesCompletadas,
            reparacionesDescartadas,
            tiempoPromedio,
            costoPromedio, // Costo promedio de las completadas
            costoTotalGeneral // Costo total de todas las filtradas
        };
    };

    const generarPDF = () => {
        const reparacionesFiltradas = filtrarReparaciones();
        const estadisticas = calcularEstadisticas(reparacionesFiltradas);
        const doc = new jsPDF();

       
        doc.setFontSize(16);
        doc.text('Reporte de Reparaciones', 105, 15, { align: 'center' });

        
        doc.setFontSize(10);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });

        
        doc.setFontSize(12);
        doc.text('Filtros Aplicados:', 14, 30);
        doc.setFontSize(10);

        const tecnicoSeleccionado = filtroTecnico !== 'todos'
            ? tecnicos.find(t => t.id_tecnico === parseInt(filtroTecnico))
            : null;

        doc.text(`Técnico: ${tecnicoSeleccionado ? `${tecnicoSeleccionado.nombre} ${tecnicoSeleccionado.apellido}` : 'Todos'}`, 14, 36);
        doc.text(`Estado: ${filtroEstado === 'todos' ? 'Todos' : filtroEstado}`, 14, 42);
        doc.text(`Periodo (Fecha Recepción): ${fechaDesde || 'Inicio'} - ${fechaHasta || 'Actualidad'}`, 14, 48);

        // Resumen estadístico
        doc.setFontSize(12);
        doc.text('Resumen Estadístico (Basado en filtros)', 14, 56);

        doc.setFontSize(10);
        doc.text(`Total Reparaciones Filtradas: ${estadisticas.totalReparaciones}`, 14, 62);
        doc.text(`- Completadas: ${estadisticas.reparacionesCompletadas}`, 20, 68);
        doc.text(`- Descartadas: ${estadisticas.reparacionesDescartadas}`, 20, 74);
        doc.text(`Tiempo Promedio (Completadas): ${estadisticas.tiempoPromedio.toFixed(2)} minutos`, 14, 80);
        doc.text(`Costo Promedio (Completadas): $${estadisticas.costoPromedio.toFixed(2)}`, 14, 86);
        doc.text(`Costo Total (Todas las filtradas): $${estadisticas.costoTotalGeneral.toFixed(2)}`, 14, 92);

        
        const tableColumn = ['ID', 'Equipo', 'Técnico', 'F. Recep.', 'Estado', 'Tiempo (min)', 'Costo ($)'];
        const tableRows = [];

        reparacionesFiltradas.forEach(reparacion => {
            const tecnico = tecnicos.find(t => t.id_tecnico === reparacion.id_tecnico);
            const equipo = equipos.find(e => e.id_equipo === reparacion.id_equipo);

            const equipoInfo = equipo
                ? `${equipo.tipo} ${equipo.marca} ${equipo.modelo}`.substring(0, 25) // Limitar longitud para PDF
                : `ID: ${reparacion.id_equipo}`;

            const nombreTecnico = tecnico
                ? `${tecnico.nombre} ${tecnico.apellido}`.substring(0, 20) // Limitar longitud
                : (reparacion.id_tecnico ? `ID: ${reparacion.id_tecnico}` : 'N/A');

            const fechaRecepcionStr = reparacion.fecha_recepcion
                ? new Date(reparacion.fecha_recepcion).toLocaleDateString()
                : 'N/A';

            // Mostrar N/A si tiempo o costo son null/undefined
             const tiempoStr = reparacion.tiempo_total != null ? reparacion.tiempo_total : 'N/A';
             const costoStr = reparacion.costo_final != null ? `$${Number(reparacion.costo_final).toFixed(2)}` : 'N/A';


            const reparacionData = [
                reparacion.id_reparacion,
                equipoInfo,
                nombreTecnico,
                fechaRecepcionStr,
                reparacion.estado || 'N/A',
                tiempoStr,
                costoStr
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
                cellPadding: 1.5, 
                overflow: 'linebreak' 
            },
            headStyles: {
                fillColor: [41, 128, 185], 
                textColor: 255,
                fontStyle: 'bold'
            },
             columnStyles: { // Ajustar anchos si es necesario
                 0: { cellWidth: 10 }, 
                 1: { cellWidth: 40 }, 
                 2: { cellWidth: 30 }, 
                 3: { cellWidth: 20 }, 
                 4: { cellWidth: 25 }, 
                 5: { cellWidth: 20 }, 
                 6: { cellWidth: 20 }  
             }
        });

        
        const nombreArchivo = `reporte_reparaciones_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(nombreArchivo);
    };

    
    if (loading) {
        return <div className="reporte-reparaciones"><p>Cargando datos...</p></div>;
    }

    if (error) {
        return <div className="reporte-reparaciones"><p style={{ color: 'red' }}>Error al cargar: {error}</p></div>;
    }
    

   
    return (
        <div className="reporte-reparaciones">
            <div className="reporte-header">
                <h3>Reporte de Reparaciones</h3>
            </div>

            <div className="filtros-reporte">
                <div className="filtro-grupo">
                    <label htmlFor="filtro-tecnico">Técnico:</label>
                    <select
                        id="filtro-tecnico"
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
                    <label htmlFor="filtro-estado">Estado:</label>
                    <select
                        id="filtro-estado"
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
                    <label htmlFor="fecha-desde">Desde (Recep.):</label>
                    <input
                        id="fecha-desde"
                        type="date"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />
                </div>

                <div className="filtro-grupo">
                    <label htmlFor="fecha-hasta">Hasta (Recep.):</label>
                    <input
                        id="fecha-hasta"
                        type="date"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                        max={new Date().toISOString().split("T")[0]} // No permitir fechas futuras
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
                    <h4>Vista Previa del Reporte (Datos Filtrados)</h4>

                    <div className="graficas-container">
                        <div className="grafica">
                            <h5>Distribución por Estado</h5>
                            {/* Asegurarse que hay datos antes de renderizar el gráfico */}
                            {datosGraficoEstado.labels && datosGraficoEstado.labels.length > 0 && datosGraficoEstado.datasets[0].data.some(d => d > 0) ? (
                                <Pie
                                    data={datosGraficoEstado}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { position: 'right' },
                                            title: { display: false } // Título ya está arriba
                                        }
                                    }}
                                />
                            ) : (
                                <p>No hay datos para este gráfico con los filtros actuales.</p>
                            )}
                        </div>

                        <div className="grafica">
                            <h5>Tiempo Promedio por Técnico (Completadas)</h5>
                             {datosGraficoTiempo.labels && datosGraficoTiempo.labels.length > 0 ? (
                                <Bar
                                    data={datosGraficoTiempo}
                                    options={{
                                        responsive: true,
                                         indexAxis: 'y', 
                                        plugins: {
                                            legend: { display: false },
                                            title: { display: true, text: 'Minutos Promedio por Reparación' }
                                        },
                                        scales: {
                                            x: { beginAtZero: true }
                                        }
                                    }}
                                />
                             ) : (
                                <p>No hay datos de tiempo promedio con los filtros actuales.</p>
                             )}
                        </div>

                         <div className="grafica grafica-full">
                             <h5>Costos de Reparación por Mes (Fecha Finalización)</h5>
                             {datosGraficoCostos.labels && datosGraficoCostos.labels.length > 0 ? (
                                <Line
                                    data={datosGraficoCostos}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { position: 'top' },
                                            title: { display: true, text: 'Costos Mensuales ($) por Fecha de Finalización' }
                                        },
                                         scales: {
                                            y: { beginAtZero: true }
                                        }
                                    }}
                                />
                            ) : (
                                <p>No hay datos de costos con el rango de fechas de finalización seleccionado.</p>
                            )}
                        </div>
                    </div>

                    <div className="estadisticas-resumen">
                        <h5>Resumen Estadístico (Datos Filtrados)</h5>
                        {(() => {
                            const reparacionesFiltradasEst = filtrarReparaciones(); 
                            const estadisticas = calcularEstadisticas(reparacionesFiltradasEst);

                            
                            if (reparacionesFiltradasEst.length === 0) {
                                return <p>No hay reparaciones que coincidan con los filtros seleccionados.</p>;
                            }

                            return (
                                <div className="stats-cards">
                                    <div className="stat-card">
                                        <div className="stat-title">Total Filtradas</div>
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
                                        <div className="stat-title">Tiempo Prom. (Comp.)</div>
                                        <div className="stat-value">{estadisticas.tiempoPromedio.toFixed(0)} min</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-title">Costo Prom. (Comp.)</div>
                                        <div className="stat-value">${estadisticas.costoPromedio.toFixed(2)}</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-title">Costo Total (Filtr.)</div>
                                        <div className="stat-value">${estadisticas.costoTotalGeneral.toFixed(2)}</div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    <div className="tabla-container">
                        <h5>Listado de Reparaciones ({filtrarReparaciones().length})</h5>
                        {filtrarReparaciones().length > 0 ? (
                            <table className="reporte-tabla">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Equipo</th>
                                        <th>Técnico</th>
                                        <th>F. Recep.</th>
                                        <th>Estado</th>
                                        <th>Tiempo (min)</th>
                                        <th>Costo ($)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrarReparaciones().map(reparacion => {
                                        const tecnico = tecnicos.find(t => t.id_tecnico === reparacion.id_tecnico);
                                        const equipo = equipos.find(e => e.id_equipo === reparacion.id_equipo);

                                        const fechaRecepcionStr = reparacion.fecha_recepcion
                                            ? new Date(reparacion.fecha_recepcion).toLocaleDateString()
                                            : 'N/A';
                                        const tiempoStr = reparacion.tiempo_total != null ? reparacion.tiempo_total : 'N/A';
                                        const costoStr = reparacion.costo_final != null ? `$${Number(reparacion.costo_final).toFixed(2)}` : 'N/A';


                                        return (
                                            <tr key={reparacion.id_reparacion}>
                                                <td>{reparacion.id_reparacion}</td>
                                                <td>{equipo ? `${equipo.tipo} ${equipo.marca} ${equipo.modelo}` : `ID: ${reparacion.id_equipo}`}</td>
                                                <td>{tecnico ? `${tecnico.nombre} ${tecnico.apellido}` : (reparacion.id_tecnico ? `ID: ${reparacion.id_tecnico}`: 'N/A')}</td>
                                                <td>{fechaRecepcionStr}</td>
                                                <td>{reparacion.estado || 'N/A'}</td>
                                                <td>{tiempoStr}</td>
                                                <td>{costoStr}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay reparaciones para mostrar con los filtros actuales.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReporteReparaciones;
