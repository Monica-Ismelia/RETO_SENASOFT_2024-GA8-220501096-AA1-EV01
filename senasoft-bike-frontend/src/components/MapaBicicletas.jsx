import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Solución para el error de los íconos en Vite
import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapaBicicletas() {
    const [bicicletas, setBicicletas] = useState([]);

    useEffect(() => {
        // Cargar las bicicletas alquiladas desde el backend
        const cargarBicicletas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/bicicletas/alquiladas');
                setBicicletas(response.data);
            } catch (error) {
                console.error('Error al cargar las bicicletas:', error);
            }
        };

        cargarBicicletas();
    }, []);

    useEffect(() => {
        // Inicializar el mapa solo una vez
        const map = L.map('mapa').setView([4.7110, -74.0721], 6); // Vista inicial: Colombia

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Añadir marcadores para cada bicicleta
        bicicletas.forEach(bici => {
            if (bici.coordenadas) {
                L.marker([bici.coordenadas[1], bici.coordenadas[0]])
                    .addTo(map)
                    .bindPopup(`
                        <b>Bicicleta ID:</b> ${bici.id}<br>
                        <b>Marca:</b> ${bici.marca}<br>
                        <b>Color:</b> ${bici.color}<br>
                        <b>Regional:</b> ${bici.ubicacion_regional}
                    `);
            }
        });

        // Limpiar el mapa cuando el componente se desmonte
        return () => {
            map.remove();
        };
    }, [bicicletas]); // Este efecto se ejecuta cada vez que 'bicicletas' cambia

    return (
  <div className="card">
    <h2>Mapa de Bicicletas Alquiladas</h2>
    <div id="mapa" style={{ height: '500px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}></div>
  </div>
);
}

export default MapaBicicletas;
