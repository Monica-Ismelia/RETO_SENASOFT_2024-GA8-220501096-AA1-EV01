// ListaBicicletas.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListaBicicletas({ usuarioId }) {
  const [bicicletas, setBicicletas] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarBicicletas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bicicletas/disponibles');
        setBicicletas(response.data);
      } catch (error) {
        setMensaje('❌ Error al cargar las bicicletas disponibles.');
      }
    };
    cargarBicicletas();
  }, []);

  const alquilarBicicleta = async (bicicletaId) => {
    if (!usuarioId) {
      setMensaje('❌ Debes iniciar sesión para alquilar una bicicleta.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/bicicletas/alquilar', {
        usuario_id: usuarioId,
        bicicleta_id: bicicletaId
      });
      setMensaje('✅ Bicicleta alquilada exitosamente.');
      const response = await axios.get('http://localhost:5000/api/bicicletas/disponibles');
      setBicicletas(response.data);
    } catch (error) {
      setMensaje('❌ Error al alquilar la bicicleta. Intenta de nuevo.');
    }
  };

  return (
    <div className="card">
      <h2>Bicicletas Disponibles para Alquiler</h2>
      {mensaje && (
        <div className={`message ${mensaje.includes('Error') ? 'error' : 'success'}`}>
          {mensaje}
        </div>
      )}

      {bicicletas.length === 0 ? (
        <p>No hay bicicletas disponibles en este momento.</p>
      ) : (
        <div className="grid">
          {bicicletas.map(bici => (
            <div key={bici.id} className="card" style={{ textAlign: 'center' }}>
              <h3>{bici.marca}</h3>
              <p><strong>Color:</strong> {bici.color}</p>
              <p><strong>Precio por hora:</strong> ${bici.precio_por_hora}</p>
              <p><strong>Ubicación:</strong> {bici.ubicacion_regional}</p>
              <button onClick={() => alquilarBicicleta(bici.id)} className="btn btn-primary">
                Alquilar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaBicicletas;