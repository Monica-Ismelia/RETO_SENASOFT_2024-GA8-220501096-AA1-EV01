// AdminDashboard.jsx
import React from 'react';
import GananciasMensuales from './GananciasMensuales';
import PublicarEvento from './PublicarEvento';
import MapaBicicletas from '../components/MapaBicicletas';
import ListaBicicletasAlquiladas from '../components/ListaBicicletasAlquiladas';
import GestionUsuarios from '../components/GestionUsuarios';

function AdminDashboard() {
  return (
    <>
      <h1>Panel de Administrador</h1>
      
      <div className="section">
        <GananciasMensuales />
      </div>

      <div className="section">
        <ListaBicicletasAlquiladas />
      </div>

      <div className="section">
        <MapaBicicletas />
      </div>

      <div className="section">
        <PublicarEvento />
      </div>

      <div className="section">
        <GestionUsuarios />
      </div>
    </>
  );
}

export default AdminDashboard;
