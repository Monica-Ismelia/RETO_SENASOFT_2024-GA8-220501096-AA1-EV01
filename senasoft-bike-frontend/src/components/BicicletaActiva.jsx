// src/components/BicicletaActiva.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BicicletaActiva({ usuarioId }) {
  const [bicicletaActiva, setBicicletaActiva] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarBicicletaActiva = async () => {
      if (!usuarioId) {
        setCargando(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/bicicletas/usuario/${usuarioId}/activa`);
        setBicicletaActiva(res.data || null);
      } catch (error) {
        console.error('Error al cargar bicicleta activa:', error);
        setBicicletaActiva(null);
      } finally {
        setCargando(false);
      }
    };

    cargarBicicletaActiva();
  }, [usuarioId]);

  if (cargando) {
    return <p>Cargando información de tu alquiler...</p>;
  }

  if (!bicicletaActiva) {
    return null; // No muestra nada si no hay bicicleta alquilada
  }

  // Calcular tiempo transcurrido
  const ahora = new Date();
  const inicio = new Date(bicicletaActiva.fecha_hora_inicio);
  const diffMs = ahora - inicio;
  const horas = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
  
  // Calcular valor estimado (sin descuento, porque el descuento se aplica al devolver)
  const valorEstimado = parseFloat(bicicletaActiva.precio_por_hora) * horas;

  return (
    <div className="card" style={{ borderLeft: '4px solid #28a745', backgroundColor: '#f8fff9' }}>
      <h3>🚴‍♂️ Tienes una bicicleta alquilada</h3>

      {bicicletaActiva.alquiler_id !== undefined && bicicletaActiva.alquiler_id !== null ? (
        <p><strong>ID de alquiler:</strong> <span style={{ backgroundColor: '#e9ecef', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>#{bicicletaActiva.alquiler_id}</span></p>
      ) : (
        <p><strong>ID de alquiler:</strong> <span style={{ color: '#6c757d' }}>No disponible</span></p>
      )}

      <p><strong>Marca:</strong> {bicicletaActiva.marca}</p>
      <p><strong>Color:</strong> {bicicletaActiva.color}</p>
      <p><strong>Ubicación:</strong> {bicicletaActiva.ubicacion_regional}</p>
      <p><strong>Alquilada desde:</strong> {new Date(bicicletaActiva.fecha_hora_inicio).toLocaleString('es-CO')}</p>
      <p><strong>Tiempo transcurrido:</strong> ~{horas} hora(s)</p>
      <p><strong>Valor estimado:</strong> ${valorEstimado.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      
      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '12px' }}>
        ⚠️ El valor final se calculará al devolver la bicicleta, aplicando tu descuento por estrato socioeconómico.
      </p>
    </div>
  );
}

export default BicicletaActiva;