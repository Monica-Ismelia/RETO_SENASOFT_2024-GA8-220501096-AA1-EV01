import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [formData, setFormData] = useState({
        nombre_completo: '',
        tipo_documento: 'Cédula',
        numero_documento: '',
        fecha_nacimiento: '',
        estrato_socioeconomico: 1,
        correo: '',
        contrasena: ''
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre_completo.trim()) newErrors.nombre_completo = 'Nombre completo es obligatorio.';
        if (!formData.tipo_documento) newErrors.tipo_documento = 'Tipo de documento es obligatorio.';
        if (!formData.numero_documento.trim()) newErrors.numero_documento = 'Número de documento es obligatorio.';
        if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'Fecha de nacimiento es obligatoria.';
        if (!formData.estrato_socioeconomico) newErrors.estrato_socioeconomico = 'Estrato socioeconómico es obligatorio.';
        if (!formData.correo.trim()) newErrors.correo = 'Correo es obligatorio.';
        if (!formData.contrasena.trim()) newErrors.contrasena = 'Contraseña es obligatoria.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            setMessage('🎉 Registro exitoso. Ahora puedes iniciar sesión.');
            setFormData({
                nombre_completo: '',
                tipo_documento: 'Cédula',
                numero_documento: '',
                fecha_nacimiento: '',
                estrato_socioeconomico: 1,
                correo: '',
                contrasena: ''
            });
        } catch (error) {
            setMessage('❌ Error al registrar. Verifica los datos.');
            console.error(error);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Registro de Usuario</h2>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Nombre Completo *</label>
                    <input
                        type="text"
                        name="nombre_completo"
                        value={formData.nombre_completo}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', border: errors.nombre_completo ? '2px solid red' : '1px solid #ccc' }}
                    />
                    {errors.nombre_completo && <span style={{ color: 'red' }}>{errors.nombre_completo}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Tipo de Documento *</label>
                    <select
                        name="tipo_documento"
                        value={formData.tipo_documento}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', border: errors.tipo_documento ? '2px solid red' : '1px solid #ccc' }}
                    >
                        <option value="Cédula">Cédula</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="Pasaporte">Pasaporte</option>
                    </select>
                    {errors.tipo_documento && <span style={{ color: 'red' }}>{errors.tipo_documento}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Número de Documento *</label>
                    <input
                        type="text"
                        name="numero_documento"
                        value={formData.numero_documento}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', border: errors.numero_documento ? '2px solid red' : '1px solid #ccc' }}
                    />
                    {errors.numero_documento && <span style={{ color: 'red' }}>{errors.numero_documento}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Fecha de Nacimiento *</label>
                    <input
                        type="date"
                        name="fecha_nacimiento"
                        value={formData.fecha_nacimiento}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', border: errors.fecha_nacimiento ? '2px solid red' : '1px solid #ccc' }}
                    />
                    {errors.fecha_nacimiento && <span style={{ color: 'red' }}>{errors.fecha_nacimiento}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Estrato Socioeconómico *</label>
                    <select
                        name="estrato_socioeconomico"
                        value={formData.estrato_socioeconomico}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', border: errors.estrato_socioeconomico ? '2px solid red' : '1px solid #ccc' }}
                    >
                        {[1, 2, 3, 4, 5, 6].map(estrato => (
                            <option key={estrato} value={estrato}>{estrato}</option>
                        ))}
                    </select>
                    {errors.estrato_socioeconomico && <span style={{ color: 'red' }}>{errors.estrato_socioeconomico}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Correo Electrónico *</label>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', border: errors.correo ? '2px solid red' : '1px solid #ccc' }}
                    />
                    {errors.correo && <span style={{ color: 'red' }}>{errors.correo}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Contraseña *</label>
                    <input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', border: errors.contrasena ? '2px solid red' : '1px solid #ccc' }}
                    />
                    {errors.contrasena && <span style={{ color: 'red' }}>{errors.contrasena}</span>}
                </div>

                <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Registrar
                </button>
            </form>
        </div>
    );
}

export default App;