import React from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage({ onLogin }) {
    return (
        <div className="LoginPage">
            <LoginForm onLogin={onLogin} />
        </div>
    );
}

export default LoginPage;
