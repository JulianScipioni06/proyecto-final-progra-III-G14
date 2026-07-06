import React from 'react';
import { FiLayout, FiList, FiPlus } from 'react-icons/fi';
import { BiWalletAlt } from 'react-icons/bi';
import '../styles/components/Navbar.css';

export default function Navbar({ onLogout }) {
    return (
        <nav className="navbar-container">
        <div className="navbar-logo">
            <BiWalletAlt className="logo-icon" size={24} color="#2563eb" />
            <span>FinanzasPersonales</span>
        </div>

        <ul className="navbar-menu">
            <li className="active">
            <FiLayout size={18} />
            Dashboard
            </li>
            <li>
            <FiList size={18} />
            Historial
            </li>
        </ul>

        <div className="navbar-actions">
            <button className="btn-nueva-transaccion"><FiPlus size={18}/>Nueva transacción</button>
            
            <button className="btn-logout" onClick={onLogout}>Cerrar Sesión</button>

        </div>
        </nav>
    );
}