// src/pages/PatientProfile.jsx
import React from 'react';

function PatientProfile({ paciente }) {
    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>Perfil del Paciente</h2>
            <p><strong>Tipo de Identificación:</strong> {paciente.tipo_documento}</p>
            <p><strong>Número de Identificación:</strong> {paciente.numero_documento}</p>
            <p><strong>Nombre Completo:</strong> {paciente.nombre_completo}</p>
            <p><strong>Fecha de Nacimiento:</strong> {paciente.fecha_nacimiento}</p>
            <p><strong>Sexo:</strong> {paciente.sexo}</p>
            <p><strong>Dirección:</strong> {paciente.direccion}</p>
            <p><strong>Celular:</strong> {paciente.celular}</p>
            <p><strong>Correo Electrónico:</strong> {paciente.correo}</p>
        </div>
    );
}

export default PatientProfile;
