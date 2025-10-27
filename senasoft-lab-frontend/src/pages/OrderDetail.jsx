// src/pages/OrderDetail.jsx
import React, { useState, useEffect } from 'react';

function OrderDetail({ orderId, onBack }) {
    const [orden, setOrden] = useState(null);
    const [grupos, setGrupos] = useState([]);

    // Simulamos una llamada al backend para obtener los detalles de la orden
    useEffect(() => {
        // En un sistema real, esto sería una petición a http://localhost:5000/api/ordenes/1
        const ordenSimulada = {
            id: 1,
            fecha: '2024-09-01',
            codigo_documento: 'DOC001',
            numero_orden: 'ORD001',
            paciente_id: 1
        };

        // Simulamos los resultados agrupados por tipo de examen
        const resultadosSimulados = [
            {
                grupo: 'Química sanguínea',
                procedimientos: [
                    { nombre: 'Glucometría', resultado: '95 mg/dL', rango_normal: '70-100 mg/dL' },
                    { nombre: 'Hierro total', resultado: '120 µg/dL', rango_normal: '60-170 µg/dL' },
                    { nombre: 'Triglicéridos', resultado: '150 mg/dL', rango_normal: '<150 mg/dL' }
                ]
            },
            {
                grupo: 'Hematología',
                procedimientos: [
                    { nombre: 'Hemoglobina', resultado: '14.2 g/dL', rango_normal: '12-16 g/dL' },
                    { nombre: 'Hematocrito', resultado: '42%', rango_normal: '36-48%' },
                    { nombre: 'Plaquetas', resultado: '250,000/µL', rango_normal: '150,000-450,000/µL' }
                ]
            }
        ];

        setOrden(ordenSimulada);
        setGrupos(resultadosSimulados);
    }, [orderId]);

    if (!orden) {
        return <div>Cargando...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={onBack} style={{ marginBottom: '20px', backgroundColor: '#6c757d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                ← Volver al Listado
            </button>

            <h2>Detalle de la Orden</h2>
            <p><strong>Fecha:</strong> {orden.fecha}</p>
            <p><strong>Código del Documento:</strong> {orden.codigo_documento}</p>
            <p><strong>Número de Orden:</strong> {orden.numero_orden}</p>

            <h3 style={{ marginTop: '30px' }}>Resultados</h3>
            {grupos.map((grupo, index) => (
                <div key={index} style={{ marginBottom: '30px', border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                    <h4>{grupo.grupo}</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>Procedimiento</th>
                                <th>Resultado</th>
                                <th>Rango Normal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grupo.procedimientos.map((proc, idx) => (
                                <tr key={idx}>
                                    <td>{proc.nombre}</td>
                                    <td>{proc.resultado}</td>
                                    <td>{proc.rango_normal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default OrderDetail;
