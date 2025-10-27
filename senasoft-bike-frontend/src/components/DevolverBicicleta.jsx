import React, { useState } from 'react';
import axios from 'axios';

function DevolverBicicleta({ usuarioId }) {
    const [alquilerId, setAlquilerId] = useState('');
    const [horasUso, setHorasUso] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!alquilerId || !horasUso) {
            setMensaje('❌ El ID del alquiler y las horas de uso son obligatorios.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/bicicletas/devolver', {
                alquiler_id: parseInt(alquilerId),
                horas_uso: parseInt(horasUso)
            });

            setMensaje(`✅ ${response.data.message} Valor a pagar: $${response.data.valor_a_pagar} (Descuento: ${response.data.descuento_aplicado})`);
            setAlquilerId('');
            setHorasUso('');
        } catch (error) {
            setMensaje('❌ Error al devolver la bicicleta. Verifica los datos.');
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Devolver Bicicleta</h2>
            {mensaje && <p style={{ color: mensaje.includes('Error') ? 'red' : 'green' }}>{mensaje}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>ID del Alquiler *</label>
                    <input
                        type="number"
                        value={alquilerId}
                        onChange={(e) => setAlquilerId(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Horas de Uso *</label>
                    <input
                        type="number"
                        value={horasUso}
                        onChange={(e) => setHorasUso(e.target.value)}
                        required
                        min="1"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                    />
                </div>

                <button type="submit" style={{ backgroundColor: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Devolver Bicicleta
                </button>
            </form>
        </div>
    );
}

export default DevolverBicicleta;
