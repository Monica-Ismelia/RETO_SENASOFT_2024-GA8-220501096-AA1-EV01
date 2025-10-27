// ListaEventos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListaEventos({ usuarioId }) {
  const [eventos, setEventos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/eventos');
        setEventos(response.data);
      } catch (error) {
        setMensaje('❌ Error al cargar los eventos.');
      }
    };
    cargarEventos();
  }, []);

  const participarEnEvento = async (eventoId) => {
    if (!usuarioId) {
      setMensaje('❌ Debes iniciar sesión para participar en un evento.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/eventos/participar', {
        usuario_id: usuarioId,
        evento_id: eventoId
      });
      setMensaje('✅ ¡Te has inscrito exitosamente en el evento!');
    } catch (error) {
      setMensaje('❌ Error al inscribirse en el evento. Ya estás inscrito o el evento no existe.');
    }
  };

  return (
    <div className="card">
      <h2>Eventos de Ciclopaseo</h2>
      {mensaje && (
        <div className={`message ${mensaje.includes('Error') ? 'error' : 'success'}`}>
          {mensaje}
        </div>
      )}

      {eventos.length === 0 ? (
        <p>No hay eventos programados en este momento.</p>
      ) : (
        <div className="grid">
          {eventos.map(evento => (
            <div key={evento.id} className="card">
              <h3>{evento.nombre}</h3>
              <p><strong>Fecha y Hora:</strong> {new Date(evento.fecha_hora).toLocaleString()}</p>
              <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
              <p>{evento.descripcion}</p>
              <button onClick={() => participarEnEvento(evento.id)} className="btn btn-secondary">
                Participar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaEventos;