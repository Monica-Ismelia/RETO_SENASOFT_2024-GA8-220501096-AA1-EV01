// src/components/GestionUsuarios.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Llama a la API para obtener usuarios
    axios.get('http://localhost:5000/api/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="card">
      <h2>Gestión de Usuarios</h2>
      {usuarios.length === 0 ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre_completo}</td>
                <td>{u.correo}</td>
                <td>{u.es_admin ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}