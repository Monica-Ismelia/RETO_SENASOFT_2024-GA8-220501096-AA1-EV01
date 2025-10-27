import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

function LoginForm({ onLogin }) {
    const [formData, setFormData] = useState({
        tipo_identificacion: 'Cédula',
        numero_identificacion: '',
        fecha_nacimiento: ''
    });
    const [captchaValue, setCaptchaValue] = useState(null);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.tipo_identificacion) newErrors.tipo_identificacion = 'Tipo de identificación es obligatorio.';
        if (!formData.numero_identificacion.trim()) newErrors.numero_identificacion = 'Número de identificación es obligatorio.';
        if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'Fecha de nacimiento es obligatoria.';
        if (!captchaValue) newErrors.captcha = 'Por favor, verifica que no eres un robot.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            // En un sistema real, enviarías captchaValue al backend para validarlo
            const response = {
                paciente: {
                    id: 1,
                    nombre_completo: 'Ana Gómez',
                    tipo_documento: 'Cédula',
                    numero_documento: '123456789',
                    fecha_nacimiento: '1990-01-01',
                    sexo: 'Femenino',
                    direccion: 'Calle 123, Bogotá',
                    celular: '3101234567',
                    correo: 'ana@example.com'
                }
            };

            setMessage('✅ Login exitoso.');
            onLogin(response.paciente);
        } catch (error) {
            setMessage('❌ Error al iniciar sesión.');
            console.error(error);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Iniciar Sesión</h2>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Tipo de Identificación *</label>
                    <select name="tipo_identificacion" value={formData.tipo_identificacion} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                        <option value="Cédula">Cédula</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="Pasaporte">Pasaporte</option>
                    </select>
                    {errors.tipo_identificacion && <span style={{ color: 'red' }}>{errors.tipo_identificacion}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Número de Identificación *</label>
                    <input type="text" name="numero_identificacion" value={formData.numero_identificacion} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                    {errors.numero_identificacion && <span style={{ color: 'red' }}>{errors.numero_identificacion}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Fecha de Nacimiento *</label>
                    <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                    {errors.fecha_nacimiento && <span style={{ color: 'red' }}>{errors.fecha_nacimiento}</span>}
                </div>

                {/* CAPTCHA */}
                <div style={{ marginBottom: '15px' }}>
                    <ReCAPTCHA
                        sitekey="6Ld3yNMrAAAAAGFDUIJsm1AhI1_Z8-TCZa9Z-5nH" // 🔴 ¡TU_SITE_KEY_AQUÍ!
                        onChange={handleCaptchaChange}
                    />
                    {errors.captcha && <span style={{ color: 'red', display: 'block', marginTop: '5px' }}>{errors.captcha}</span>}
                </div>

                <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
