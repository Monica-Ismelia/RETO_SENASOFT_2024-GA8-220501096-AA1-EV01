import React, { useState } from 'react';
import axios from 'axios';

function GananciasMensuales() {
    const [mes, setMes] = useState('5'); // Mes por defecto: mayo
    const [anio, setAnio] = useState('2024'); // Año por defecto: 2024
    const [ganancias, setGanancias] = useState(null);
    const [error, setError] = useState('');

    const calcularGanancias = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/bicicletas/ganancias-mensuales?mes=${mes}&anio=${anio}`
            );
            setGanancias(response.data.ganancias_netas);
            setError('');
        } catch (err) {
            setError('Error al calcular las ganancias. Verifica los datos.');
            setGanancias(null);
        }
    };

    return (
        <div className="card">
            <h2>Calculadora de Ganancias Netas Mensuales</h2>
            <div style={{ marginBottom: '20px' }}>
                <label>Mes:</label>
                <select value={mes} onChange={(e) => setMes(e.target.value)}>
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {new Date(2024, i).toLocaleString('es-ES', { month: 'long' })}
                        </option>
                    ))}
                </select>

                <label>Año:</label>
                <input
                    type="number"
                    value={anio}
                    onChange={(e) => setAnio(e.target.value)}
                    min="2020"
                    max="2030"
                    style={{ marginLeft: '10px' }}
                />

                <button onClick={calcularGanancias} style={{ marginLeft: '10px', backgroundColor: '#007bff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px' }}>
                    Calcular
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {ganancias !== null && (
                <div style={{ padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3>Ganancias Netas del Mes</h3>
                    <p><strong>Total:</strong> ${ganancias}</p>
                </div>
            )}
        </div>
    );
}

export default GananciasMensuales;
