import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    const [usuarioLogueado, setUsuarioLogueado] = useState(null);

    const handleLogin = (userData) => {
        setUsuarioLogueado(userData);
    };

    const handleLogout = () => {
        setUsuarioLogueado(null);
    };

    if (!usuarioLogueado) {
        return <LoginForm onLogin={handleLogin} />;
    }

    return (
        <div className="App">
            
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Bienvenido, {usuarioLogueado.nombre_completo}</h2>
                <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Cerrar Sesión
                </button>
            </div>

            {usuarioLogueado.es_admin ? (
                <AdminDashboard />
            ) : (
                <UserDashboard usuarioId={usuarioLogueado.id} />
            )}
        </div>
    );
}

export default App;
