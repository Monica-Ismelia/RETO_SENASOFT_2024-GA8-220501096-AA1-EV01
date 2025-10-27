import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import PatientProfile from './pages/PatientProfile';
import Home from './pages/Home';
import OrderDetail from './pages/OrderDetail';

function App() {
    const [pacienteLogueado, setPacienteLogueado] = useState(null);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

    const handleLogin = (pacienteData) => {
        setPacienteLogueado(pacienteData);
    };

    const handleLogout = () => {
        setPacienteLogueado(null);
        setOrdenSeleccionada(null);
    };

    const handleVerOrden = (orderId) => {
        setOrdenSeleccionada(orderId);
    };

    const handleVolverListado = () => {
        setOrdenSeleccionada(null);
    };

    if (!pacienteLogueado) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (ordenSeleccionada) {
        return <OrderDetail orderId={ordenSeleccionada} onBack={handleVolverListado} />;
    }

    return (
        <div className="App">
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Bienvenido, {pacienteLogueado.nombre_completo}</h2>
                <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Cerrar Sesión
                </button>
            </div>

            <PatientProfile paciente={pacienteLogueado} />
            <Home pacienteId={pacienteLogueado.id} onVerOrden={handleVerOrden} />
        </div>
    );
}

export default App;
