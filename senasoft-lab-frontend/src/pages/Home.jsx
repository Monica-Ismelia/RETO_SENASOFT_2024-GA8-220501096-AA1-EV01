// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';

function Home({ pacienteId, onVerOrden }) {
    const [ordenes, setOrdenes] = useState([]);
    const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [ordenAscendente, setOrdenAscendente] = useState(false);

    // Estados para los filtros
    const [filtroNumeroOrden, setFiltroNumeroOrden] = useState('');
    const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
    const [filtroFechaFin, setFiltroFechaFin] = useState('');

    // Simulamos una llamada al backend para obtener las órdenes del paciente
    useEffect(() => {
        const ordenesSimuladas = [
    { id: 1, fecha: '2024-09-01', codigo_documento: 'DOC001', numero_orden: 'ORD001' },
    { id: 2, fecha: '2024-08-15', codigo_documento: 'DOC002', numero_orden: 'ORD002' },
    { id: 3, fecha: '2024-07-30', codigo_documento: 'DOC003', numero_orden: 'ORD003' },
    { id: 4, fecha: '2024-06-20', codigo_documento: 'DOC004', numero_orden: 'ORD004' },
    { id: 5, fecha: '2024-05-10', codigo_documento: 'DOC005', numero_orden: 'ORD005' },
    { id: 6, fecha: '2024-04-05', codigo_documento: 'DOC006', numero_orden: 'ORD006' },
    { id: 7, fecha: '2024-03-01', codigo_documento: 'DOC007', numero_orden: 'ORD007' },
    { id: 8, fecha: '2024-02-15', codigo_documento: 'DOC008', numero_orden: 'ORD008' },
    { id: 9, fecha: '2024-01-10', codigo_documento: 'DOC009', numero_orden: 'ORD009' },
    { id: 10, fecha: '2023-12-01', codigo_documento: 'DOC010', numero_orden: 'ORD010' }
        ];

        setOrdenes(ordenesSimuladas);
        setOrdenesFiltradas(ordenesSimuladas);
        setTotalPaginas(Math.ceil(ordenesSimuladas.length / 10));
    }, [pacienteId]);

    // Aplicar filtros y ordenamiento
    useEffect(() => {
        let resultado = [...ordenes];

        // Filtro por número de orden
        if (filtroNumeroOrden) {
            resultado = resultado.filter(orden =>
                orden.numero_orden.toLowerCase().includes(filtroNumeroOrden.toLowerCase())
            );
        }

        // Filtro por rango de fechas
        if (filtroFechaInicio) {
            resultado = resultado.filter(orden => orden.fecha >= filtroFechaInicio);
        }
        if (filtroFechaFin) {
            resultado = resultado.filter(orden => orden.fecha <= filtroFechaFin);
        }

        // Ordenar por fecha
        resultado.sort((a, b) => {
            return ordenAscendente
                ? new Date(a.fecha) - new Date(b.fecha)
                : new Date(b.fecha) - new Date(a.fecha);
        });

        setOrdenesFiltradas(resultado);
        setPaginaActual(1);
        setTotalPaginas(Math.ceil(resultado.length / 10));
    }, [ordenes, filtroNumeroOrden, filtroFechaInicio, filtroFechaFin, ordenAscendente]);

    const ordenesPaginadas = ordenesFiltradas.slice((paginaActual - 1) * 10, paginaActual * 10);

    const handlePaginaAnterior = () => {
        if (paginaActual > 1) setPaginaActual(paginaActual - 1);
    };

    const handlePaginaSiguiente = () => {
        if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
    };

    const toggleOrden = () => {
        setOrdenAscendente(!ordenAscendente);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Órdenes de Laboratorio</h2>

            {/* Filtros */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <h3>Filtros de Búsqueda</h3>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div>
                        <label>Número de Orden:</label>
                        <input
                            type="text"
                            value={filtroNumeroOrden}
                            onChange={(e) => setFiltroNumeroOrden(e.target.value)}
                            placeholder="Ej: ORD001"
                            style={{ marginLeft: '8px', padding: '6px', width: '150px' }}
                        />
                    </div>

                    <div>
                        <label>Fecha Inicio:</label>
                        <input
                            type="date"
                            value={filtroFechaInicio}
                            onChange={(e) => setFiltroFechaInicio(e.target.value)}
                            style={{ marginLeft: '8px', padding: '6px' }}
                        />
                    </div>

                    <div>
                        <label>Fecha Fin:</label>
                        <input
                            type="date"
                            value={filtroFechaFin}
                            onChange={(e) => setFiltroFechaFin(e.target.value)}
                            style={{ marginLeft: '8px', padding: '6px' }}
                        />
                    </div>

                    <button
                        onClick={toggleOrden}
                        style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Ordenar por Fecha ({ordenAscendente ? 'Asc' : 'Desc'})
                    </button>
                </div>
            </div>

            {/* Tabla de Órdenes */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Código del Documento</th>
                        <th>Número de Orden</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenesPaginadas.length > 0 ? (
                        ordenesPaginadas.map(orden => (
                            <tr key={orden.id}>
                                <td>{orden.fecha}</td>
                                <td>{orden.codigo_documento}</td>
                                <td>{orden.numero_orden}</td>
                                <td>
                                    <button onClick={() => onVerOrden(orden.id)} style={{ backgroundColor: '#007bff', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Ver Detalle
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                No se encontraron órdenes con los filtros aplicados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={handlePaginaAnterior} disabled={paginaActual === 1} style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Anterior
                </button>
                <span>Página {paginaActual} de {totalPaginas}</span>
                <button onClick={handlePaginaSiguiente} disabled={paginaActual === totalPaginas} style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default Home;
