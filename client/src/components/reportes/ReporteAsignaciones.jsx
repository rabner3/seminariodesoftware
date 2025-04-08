// client/src/components/reportes/ReporteAsignaciones.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
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
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

function ReporteAsignaciones() {
    const [asignaciones, setAsignaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [filtroUsuario, setFiltroUsuario] = useState('todos');
    const [filtroDepartamento, setFiltroDepartamento] = useState('todos');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState(false);
    const [datosGraficoTiempo, setDatosGraficoTiempo] = useState({
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
        // Generar datos para gráficos cuando cambien las asignaciones
        if (asignaciones.length > 0) {
            generarDatosGraficos();
        }
    }, [asignaciones, fechaDesde, fechaHasta]);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            // Cargar asignaciones
            const responseAsignaciones = await axios.get('http://localhost:8080/api/asignaciones');
            setAsignaciones(responseAsignaciones.data);

            // Cargar usuarios
            const responseUsuarios = await axios.get('http://localhost:8080/api/usuarios');
            setUsuarios(responseUsuarios.data);

            // Cargar departamentos
            const responseDepartamentos = await axios.get('http://localhost:8080/api/departamentos');
            setDepartamentos(responseDepartamentos.data);

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
        // Filtrar asignaciones por fecha
        const asignacionesFiltradas = asignaciones.filter(asignacion => {
            if (!asignacion.fecha_asignacion) return false;

            const fechaAsignacion = new Date(asignacion.fecha_asignacion);
            const desde = fechaDesde ? new Date(fechaDesde) : null;
            const hasta = fechaHasta ? new Date(fechaHasta) : null;

            if (desde && fechaAsignacion < desde) return false;
            if (hasta) {
                hasta.setHours(23, 59, 59);
                if (fechaAsignacion > hasta) return false;
            }

            return true;
        });

        // Agrupar por mes/año
        const asignacionesPorMes = {};

        asignacionesFiltradas.forEach(asignacion => {
            if (asignacion.fecha_asignacion) {
                const fecha = new Date(asignacion.fecha_asignacion);
                const mesAño = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

                asignacionesPorMes[mesAño] = (asignacionesPorMes[mesAño] || 0) + 1;
            }
        });

        // Ordenar por fecha
        const mesesOrdenados = Object.keys(asignacionesPorMes).sort((a, b) => {
            const [mesA, añoA] = a.split('/').map(Number);
            const [mesB, añoB] = b.split('/').map(Number);

            if (añoA !== añoB) return añoA - añoB;
            return mesA - mesB;
        });

        setDatosGraficoTiempo({
            labels: mesesOrdenados,
            datasets: [
                {
                    label: 'Asignaciones por Mes',
                    data: mesesOrdenados.map(mes => asignacionesPorMes[mes]),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        });
    };

    const filtrarAsignaciones = () => {
        let asignacionesFiltradas = [...asignaciones];

        if (filtroUsuario !== 'todos') {
            asignacionesFiltradas = asignacionesFiltradas.filter(
                asignacion => asignacion.id_usuario === parseInt(filtroUsuario)
            );
        }

        if (filtroDepartamento !== 'todos') {
            // Filtrar por departamento implica buscar usuarios de ese departamento
            const usuariosDepartamento = usuarios.filter(
                usuario => usuario.id_departamento === parseInt(filtroDepartamento)
            ).map(usuario => usuario.id_usuarios);

            asignacionesFiltradas = asignacionesFiltradas.filter(
                asignacion => usuariosDepartamento.includes(asignacion.id_usuario)
            );
        }

        if (filtroEstado !== 'todos') {
            asignacionesFiltradas = asignacionesFiltradas.filter(
                asignacion => asignacion.estado === filtroEstado
            );
        }

        // Filtrar por fechas
        if (fechaDesde || fechaHasta) {
            asignacionesFiltradas = asignacionesFiltradas.filter(asignacion => {
                if (!asignacion.fecha_asignacion) return false;

                const fechaAsignacion = new Date(asignacion.fecha_asignacion);
                const desde = fechaDesde ? new Date(fechaDesde) : null;
                const hasta = fechaHasta ? new Date(fechaHasta) : null;

                if (desde && fechaAsignacion < desde) return false;
                if (hasta) {
                    hasta.setHours(23, 59, 59);
                    if (fechaAsignacion > hasta) return false;
                }

                return true;
            });
        }

        return asignacionesFiltradas;
    };

    const generarPDF = () => {
        const asignacionesFiltradas = filtrarAsignaciones();
        const doc = new jsPDF();

        // Título
        doc.setFontSize(16);
        doc.text('Reporte de Asignaciones de Equipos', 105, 15, { align: 'center' });

        // Fecha de generación
        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });

        // Filtros aplicados
        doc.setFontSize(12);
        doc.text('Filtros aplicados:', 14, 30);
        doc.setFontSize(10);

        const usuarioSeleccionado = filtroUsuario !== 'todos'
            ? usuarios.find(u => u.id_usuarios === parseInt(filtroUsuario))
            : null;

        const departamentoSeleccionado = filtroDepartamento !== 'todos'
            ? departamentos.find(d => d.id_departamento === parseInt(filtroDepartamento))
            : null;

        doc.text(`Usuario: ${usuarioSeleccionado ? `${usuarioSeleccionado.nombre} ${usuarioSeleccionado.apellido}` : 'Todos'}`, 14, 36);
        doc.text(`Departamento: ${departamentoSeleccionado ? departamentoSeleccionado.nombre : 'Todos'}`, 14, 42);
        doc.text(`Estado: ${filtroEstado === 'todos' ? 'Todos' : filtroEstado}`, 14, 48);
        doc.text(`Periodo: ${fechaDesde ? fechaDesde : 'Inicio'} - ${fechaHasta ? fechaHasta : 'Actualidad'}`, 14, 54);

        // Tabla de asignaciones
        const tableColumn = ['ID', 'Equipo', 'Usuario', 'Departamento', 'Fecha Asignación', 'Estado', 'Fecha Fin'];
        const tableRows = [];

        asignacionesFiltradas.forEach(asignacion => {
            const usuario = usuarios.find(u => u.id_usuarios === asignacion.id_usuario);
            const equipo = equipos.find(e => e.id_equipo === asignacion.id_equipo);
            const departamento = usuario && usuario.id_departamento
                ? departamentos.find(d => d.id_departamento === usuario.id_departamento)
                : null;

            const equipoInfo = equipo
                ? `${equipo.tipo} ${equipo.marca} ${equipo.modelo}`
                : `ID: ${asignacion.id_equipo}`;

            const nombreUsuario = usuario
                ? `${usuario.nombre} ${usuario.apellido}`
                : `ID: ${asignacion.id_usuario}`;

            const asignacionData = [
                asignacion.id_asignacion,
                equipoInfo,
                nombreUsuario,
                departamento ? departamento.nombre : 'N/A',
                asignacion.fecha_asignacion ? new Date(asignacion.fecha_asignacion).toLocaleDateString() : 'N/A',
                asignacion.estado || 'N/A',
                asignacion.fecha_finalizacion ? new Date(asignacion.fecha_finalizacion).toLocaleDateString() : 'N/A'
            ];
            tableRows.push(asignacionData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60,
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
        doc.text(`Total de Asignaciones: ${asignacionesFiltradas.length}`, 14, finalY + 6);

        // Conteo por estado
        const conteoEstados = {
            activa: 0,
            finalizada: 0
        };

        asignacionesFiltradas.forEach(asignacion => {
            if (asignacion.estado) {
                conteoEstados[asignacion.estado] = (conteoEstados[asignacion.estado] || 0) + 1;
            }
        });

        doc.text(`Asignaciones Activas: ${conteoEstados.activa || 0}`, 14, finalY + 12);
        doc.text(`Asignaciones Finalizadas: ${conteoEstados.finalizada || 0}`, 14, finalY + 18);

        // Guardar el PDF
        doc.save('reporte_asignaciones.pdf');
    };

    return (
        <div className="reporte-asignaciones">
            <div className="reporte-header">
                <h3>Reporte de Asignaciones</h3>
            </div>

            <div className="filtros-reporte">
                <div className="filtro-grupo">
                    <label>Usuario:</label>
                    <select
                        value={filtroUsuario}
                        onChange={(e) => setFiltroUsuario(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        {usuarios.map(usuario => (
                            <option key={usuario.id_usuarios} value={usuario.id_usuarios}>
                                {usuario.nombre} {usuario.apellido}
                            </option>
                        ))}
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

                <div className="filtro-grupo">
                    <label>Estado:</label>
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        <option value="activa">Activa</option>
                        <option value="finalizada">Finalizada</option>
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
                            <h5>Tendencia de Asignaciones</h5>
                            {datosGraficoTiempo.labels.length > 0 && (
                                <Line
                                    data={datosGraficoTiempo}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Asignaciones por Mes'
                                            }
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="tabla-container">
                        <h5>Listado de Asignaciones ({filtrarAsignaciones().length})</h5>
                        <table className="reporte-tabla">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Equipo</th>
                                    <th>Usuario</th>
                                    <th>Departamento</th>
                                    <th>Fecha Asignación</th>
                                    <th>Estado</th>
                                    <th>Fecha Fin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrarAsignaciones().map(asignacion => {
                                    const usuario = usuarios.find(u => u.id_usuarios === asignacion.id_usuario);
                                    const equipo = equipos.find(e => e.id_equipo === asignacion.id_equipo);
                                    const departamento = usuario && usuario.id_departamento
                                        ? departamentos.find(d => d.id_departamento === usuario.id_departamento)
                                        : null;

                                    return (
                                        <tr key={asignacion.id_asignacion}>
                                            <td>{asignacion.id_asignacion}</td>
                                            <td>{equipo ? `${equipo.tipo} ${equipo.marca} ${equipo.modelo}` : `ID: ${asignacion.id_equipo}`}</td>
                                            <td>{usuario ? `${usuario.nombre} ${usuario.apellido}` : `ID: ${asignacion.id_usuario}`}</td>
                                            <td>{departamento ? departamento.nombre : 'N/A'}</td>
                                            <td>{asignacion.fecha_asignacion ? new Date(asignacion.fecha_asignacion).toLocaleDateString() : 'N/A'}</td>
                                            <td>{asignacion.estado || 'N/A'}</td>
                                            <td>{asignacion.fecha_finalizacion ? new Date(asignacion.fecha_finalizacion).toLocaleDateString() : 'N/A'}</td>
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

export default ReporteAsignaciones;