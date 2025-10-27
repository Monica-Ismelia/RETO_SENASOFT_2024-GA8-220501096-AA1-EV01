import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [formData, setFormData] = useState({
        correo: '',
        contrasena: ''
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.correo.trim()) newErrors.correo = 'Correo es obligatorio.';
        if (!formData.contrasena.trim()) newErrors.contrasena = 'Contraseña es obligatoria.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            setMessage('✅ Login exitoso.');
            setIsLoggedIn(true);
        } catch (error) {
            setMessage('❌ Error al iniciar sesión. Verifica tus credenciales.');
            console.error(error);
        }
    };

    if (isLoggedIn) {
        return (
            <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>Bienvenido</h2>
                <p>Has iniciado sesión correctamente.</p>
                <button onClick={() => setIsLoggedIn(false)} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Cerrar Sesión
                </button>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Login de Usuario</h2>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
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
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}

export default App;