// components/ListaBicicletasAlquiladas.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ListaBicicletasAlquiladas() {
  const [alquileres, setAlquileres] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/bicicletas/alquiladas/detallado')
      .then(res => setAlquileres(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="card">
      <h2>Bicicletas Alquiladas</h2>
      {alquileres.length === 0 ? (
        <p>No hay bicicletas alquiladas en este momento.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Bicicleta</th>
              <th>Usuario</th>
              <th>Desde</th>
              <th>Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {alquileres.map(a => (
              <tr key={a.alquiler_id}>
                <td>{a.marca} ({a.color}) - ID: {a.bicicleta_id}</td>
                <td>{a.nombre_completo} (Doc: {a.numero_documento})</td>
                <td>{new Date(a.fecha_hora_inicio).toLocaleString()}</td>
                <td>{a.ubicacion_regional}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}