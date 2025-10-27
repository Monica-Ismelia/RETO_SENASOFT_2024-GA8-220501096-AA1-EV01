// LoginForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLogin }) {
  const [tipoLogin, setTipoLogin] = useState('usuario');
  const [formData, setFormData] = useState({
    numero_documento: '',
    fecha_nacimiento: '',
    correo: '',
    contrasena: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (tipoLogin === 'usuario') {
      if (!formData.numero_documento.trim()) newErrors.numero_documento = 'Número de documento es obligatorio.';
      if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'Fecha de nacimiento es obligatoria.';
    } else {
      if (!formData.correo.trim()) newErrors.correo = 'Correo es obligatorio.';
      if (!formData.contrasena.trim()) newErrors.contrasena = 'Contraseña es obligatoria.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        tipo_login: tipoLogin,
        ...formData
      });
      setMessage('✅ Login exitoso.');
      onLogin(response.data.user);
    } catch (error) {
      setMessage('❌ Error al iniciar sesión. Verifica tus datos.');
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setTipoLogin('usuario')}
          className={`btn ${tipoLogin === 'usuario' ? 'btn-secondary' : 'btn-outline'}`}
          style={{ marginRight: '10px' }}
        >
          Usuario
        </button>
        <button
          type="button"
          onClick={() => setTipoLogin('admin')}
          className={`btn ${tipoLogin === 'admin' ? 'btn-secondary' : 'btn-outline'}`}
        >
          Administrador
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {tipoLogin === 'usuario' ? (
          <>
            <div className="form-group">
              <label>Número de Documento *</label>
              <input
                type="text"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleChange}
                className={errors.numero_documento ? 'error' : ''}
              />
              {errors.numero_documento && <span className="message error">{errors.numero_documento}</span>}
            </div>
            <div className="form-group">
              <label>Fecha de Nacimiento *</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className={errors.fecha_nacimiento ? 'error' : ''}
              />
              {errors.fecha_nacimiento && <span className="message error">{errors.fecha_nacimiento}</span>}
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Correo Electrónico *</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className={errors.correo ? 'error' : ''}
              />
              {errors.correo && <span className="message error">{errors.correo}</span>}
            </div>
            <div className="form-group">
              <label>Contraseña *</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                className={errors.contrasena ? 'error' : ''}
              />
              {errors.contrasena && <span className="message error">{errors.contrasena}</span>}
            </div>
          </>
        )}

        <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default LoginForm;