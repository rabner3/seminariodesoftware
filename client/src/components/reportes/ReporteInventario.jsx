// client/src/components/reportes/ReporteInventario.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
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
    Title,
    Tooltip,
    Legend
);

function ReporteInventario() {
    const [equipos, setEquipos] = useState([]);
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroDepartamento, setFiltroDepartamento] = useState('todos');
    const [departamentos, setDepartamentos] = useState([]);
    const [ setLoading] = useState(true);
    const [setError] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState(false);

    // Datos para gráficos
    const [datosGraficoEstado, setDatosGraficoEstado] = useState({
        labels: [],
        datasets: []
    });
    const [datosGraficoDepartamento, setDatosGraficoDepartamento] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        // Cargar datos iniciales
        cargarDatos();
    }, []);

    useEffect(() => {
        // Generar datos para gráficos cuando cambien los equipos
        if (equipos.length > 0) {
            generarDatosGraficos();
        }
    }, [equipos]);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            // Cargar equipos
            const responseEquipos = await axios.get('http://localhost:8080/api/equipos');
            setEquipos(responseEquipos.data);

            // Cargar departamentos
            const responseDepartamentos = await axios.get('http://localhost:8080/api/departamentos');
            setDepartamentos(responseDepartamentos.data);

            setLoading(false);
        } catch (err) {
            setError(`Error al cargar datos: ${err.message}`);
            setLoading(false);
        }
    };

    const generarDatosGraficos = () => {
        // Datos para gráfico por estado
        const conteoEstados = {
            disponible: 0,
            asignado: 0,
            en_reparacion: 0,
            descarte: 0,
            baja: 0
        };

        equipos.forEach(equipo => {
            if (equipo.estado) {
                conteoEstados[equipo.estado] = (conteoEstados[equipo.estado] || 0) + 1;
            }
        });

        setDatosGraficoEstado({
            labels: Object.keys(conteoEstados),
            datasets: [
                {
                    label: 'Equipos por Estado',
                    data: Object.values(conteoEstados),
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(153, 102, 255, 0.6)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        });

        // Datos para gráfico por departamento
        const conteoDepartamentos = {};

        equipos.forEach(equipo => {
            if (equipo.id_departamento) {
                // Buscar nombre del departamento
                const departamento = departamentos.find(d => d.id_departamento === equipo.id_departamento);
                const nombreDepartamento = departamento ? departamento.nombre : `Depto ID: ${equipo.id_departamento}`;

                conteoDepartamentos[nombreDepartamento] = (conteoDepartamentos[nombreDepartamento] || 0) + 1;
            } else {
                conteoDepartamentos['Sin Departamento'] = (conteoDepartamentos['Sin Departamento'] || 0) + 1;
            }
        });

        setDatosGraficoDepartamento({
            labels: Object.keys(conteoDepartamentos),
            datasets: [
                {
                    label: 'Equipos por Departamento',
                    data: Object.values(conteoDepartamentos),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        });
    };

    const filtrarEquipos = () => {
        let equiposFiltrados = [...equipos];

        if (filtroTipo !== 'todos') {
            equiposFiltrados = equiposFiltrados.filter(equipo => equipo.tipo === filtroTipo);
        }

        if (filtroEstado !== 'todos') {
            equiposFiltrados = equiposFiltrados.filter(equipo => equipo.estado === filtroEstado);
        }

        if (filtroDepartamento !== 'todos') {
            equiposFiltrados = equiposFiltrados.filter(equipo =>
                equipo.id_departamento === parseInt(filtroDepartamento)
            );
        }

        return equiposFiltrados;
    };

    const generarPDF = () => {
        const equiposFiltrados = filtrarEquipos();
        const doc = new jsPDF();

        // Título
        doc.setFontSize(16);
        doc.text('Reporte de Inventario de Equipos', 105, 15, { align: 'center' });

        // Fecha de generación
        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });

        // Filtros aplicados
        doc.setFontSize(12);
        doc.text('Filtros aplicados:', 14, 30);
        doc.setFontSize(10);
        doc.text(`Tipo: ${filtroTipo}`, 14, 36);
        doc.text(`Estado: ${filtroEstado}`, 14, 42);
        doc.text(`Departamento: ${filtroDepartamento === 'todos' ? 'Todos' :
            departamentos.find(d => d.id_departamento === parseInt(filtroDepartamento))?.nombre || filtroDepartamento}`, 14, 48);

        // Tabla de equipos
        const tableColumn = ['ID', 'Tipo', 'Marca', 'Modelo', 'Serie', 'Estado', 'Departamento'];
        const tableRows = [];

        equiposFiltrados.forEach(equipo => {
            const departamento = departamentos.find(d => d.id_departamento === equipo.id_departamento);
            const equipoData = [
                equipo.id_equipo,
                equipo.tipo || '',
                equipo.marca || '',
                equipo.modelo || '',
                equipo.numero_serie || '',
                equipo.estado || '',
                departamento ? departamento.nombre : 'No asignado'
            ];
            tableRows.push(equipoData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [66, 139, 202]
            }
        });

        // Resumen estadístico
        const finalY = doc.autoTable.previous.finalY + 10;
        doc.setFontSize(12);
        doc.text('Resumen Estadístico', 14, finalY);

        doc.setFontSize(10);
        doc.text(`Total de Equipos: ${equiposFiltrados.length}`, 14, finalY + 6);

        // Conteo por estado
        const conteoEstados = {};
        equiposFiltrados.forEach(equipo => {
            if (equipo.estado) {
                conteoEstados[equipo.estado] = (conteoEstados[equipo.estado] || 0) + 1;
            }
        });

        let estadoY = finalY + 12;
        Object.entries(conteoEstados).forEach(([estado, cantidad]) => {
            doc.text(`${estado}: ${cantidad}`, 14, estadoY);
            estadoY += 6;
        });

        // Guardar el PDF
        doc.save('reporte_inventario.pdf');
    };

    // Obtener los tipos únicos de equipos
    const tiposUnicos = [...new Set(equipos.map(equipo => equipo.tipo).filter(Boolean))];

    return (
        <div className="reporte-inventario">
            <div className="reporte-header">
                <h3>Reporte de Inventario</h3>
            </div>

            <div className="filtros-reporte">
                <div className="filtro-grupo">
                    <label>Tipo de Equipo:</label>
                    <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        {tiposUnicos.map((tipo, index) => (
                            <option key={index} value={tipo}>{tipo}</option>
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
                        <option value="disponible">Disponible</option>
                        <option value="asignado">Asignado</option>
                        <option value="en_reparacion">En Reparación</option>
                        <option value="descarte">Descarte</option>
                        <option value="baja">Baja</option>
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Departamento:</label>
                    <select
                        value={filtroDepartamento}
                        onChange={(e) => setFiltroDepartamento(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        {departamentos.map(depto => (
                            <option key={depto.id_departamento} value={depto.id_departamento}>
                                {depto.nombre}
                            </option>
                        ))}
                    </select>
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
                                                text: 'Equipos por Estado'
                                            }
                                        }
                                    }}
                                />
                            )}
                        </div>

                        <div className="grafica">
                            <h5>Distribución por Departamento</h5>
                            {datosGraficoDepartamento.labels.length > 0 && (
                                <Bar
                                    data={datosGraficoDepartamento}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                            title: {
                                                display: true,
                                                text: 'Equipos por Departamento'
                                            }
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="tabla-container">
                        <h5>Listado de Equipos ({filtrarEquipos().length})</h5>
                        <table className="reporte-tabla">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Serie</th>
                                    <th>Estado</th>
                                    <th>Departamento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrarEquipos().map(equipo => {
                                    const departamento = departamentos.find(d => d.id_departamento === equipo.id_departamento);

                                    return (
                                        <tr key={equipo.id_equipo}>
                                            <td>{equipo.id_equipo}</td>
                                            <td>{equipo.tipo}</td>
                                            <td>{equipo.marca}</td>
                                            <td>{equipo.modelo}</td>
                                            <td>{equipo.numero_serie}</td>
                                            <td>{equipo.estado}</td>
                                            <td>{departamento ? departamento.nombre : 'No asignado'}</td>
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

export default ReporteInventario;