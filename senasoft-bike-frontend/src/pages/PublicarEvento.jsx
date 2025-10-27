import React, { useState } from 'react';
import axios from 'axios';

function PublicarEvento() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaHora, setFechaHora] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [creadoPorAdmin, setCreadoPorAdmin] = useState(1);
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/eventos', {
                nombre,
                descripcion,
                fecha_hora: fechaHora,
                ubicacion,
                creado_por_admin: creadoPorAdmin
            });

            setMensaje('✅ Evento publicado exitosamente.');
            // Limpiar el formulario
            setNombre('');
            setDescripcion('');
            setFechaHora('');
            setUbicacion('');
        } catch (error) {
            setMensaje('❌ Error al publicar el evento. Verifica los datos.');
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Publicar Nuevo Evento de Ciclopaseo</h2>
            {mensaje && <p style={{ color: mensaje.includes('Error') ? 'red' : 'green' }}>{mensaje}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Nombre del Evento *</label>
                    <input
                        type="text"
                        name="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Descripción *</label>
                    <textarea
                        name="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                        rows="4"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                    ></textarea>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Fecha y Hora del Evento *</label>
                    <input
                        type="datetime-local"
                        name="fechaHora"
                        value={fechaHora}
                        onChange={(e) => setFechaHora(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Ubicación *</label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                    />
                </div>

                <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Publicar Evento
                </button>
            </form>
        </div>
    );
}

export default PublicarEvento;
