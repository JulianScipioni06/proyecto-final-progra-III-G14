import React from 'react';
import { FiLayout, FiList, FiPlus } from 'react-icons/fi';
import { BiWalletAlt } from 'react-icons/bi';
import '../styles/components/Navbar.css';

export default function Navbar({ onLogout, onAbrirModal }) {
    return (
        <nav className="navbar-container">
            <div className="navbar-logo">
                <BiWalletAlt className="logo-icon" size={24} color="#2563eb" />
                <span>FinanzasPersonales</span>
            </div>

            <div className="navbar-actions">
                <button 
                    className="btn-nueva-transaccion" 
                    onClick={onAbrirModal}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    <FiPlus /> Nueva transacción
                </button>

                <button className="btn-configuracion">
                    Configuración
                </button>
                
                <button className="btn-logout" onClick={onLogout}>
                    Cerrar Sesión
                </button>

            </div>
        </nav>
    );
}