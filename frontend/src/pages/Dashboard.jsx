import React from 'react';

export default function Dashboard({ onLogout }) {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Dashboard en construcción 🚧</h1>
        <button onClick={onLogout}>Cerrar Sesión</button>
        </div>
    );
}