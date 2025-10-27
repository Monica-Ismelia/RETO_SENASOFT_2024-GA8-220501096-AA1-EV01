// src/pages/UserDashboard.jsx
import React from 'react';
import BicicletaActiva from '../components/BicicletaActiva'; // ✅ Importación correcta
import ListaBicicletas from '../components/ListaBicicletas';
import DevolverBicicleta from '../components/DevolverBicicleta';
import ListaEventos from '../components/ListaEventos';

function UserDashboard({ usuarioId }) {
  return (
    <>
      <h1>Panel del Usuario</h1>
      <p>Selecciona una acción para comenzar.</p>

      {/* ✅ Sección de bicicleta activa */}
      <div className="section">
        <BicicletaActiva usuarioId={usuarioId} />
      </div>

      <div className="section">
        <ListaBicicletas usuarioId={usuarioId} />
      </div>

      <div className="section">
        <DevolverBicicleta usuarioId={usuarioId} />
      </div>

      <div className="section">
        <ListaEventos usuarioId={usuarioId} />
      </div>
    </>
  );
}

export default UserDashboard;