import React, { useState } from 'react';
import { FiLayout, FiList, FiPlus, FiSettings } from 'react-icons/fi';
import { BiWalletAlt } from 'react-icons/bi';
import ModalConfiguracion from './ModalConfiguracion';
import '../styles/components/Navbar.css';

export default function Navbar({ onLogout, onAbrirModal, onAbrirHistorial }) {
    const [modalAbierto, setModalAbierto] = useState(false);

    return (
        <>
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
                    <li onClick={onAbrirHistorial} style={{cursor: 'pointer'}}>
                        <FiList size={18} />
                        Historial
                    </li>
                </ul>

                <div className="navbar-actions">
                    <button className="btn-nueva-transaccion" onClick={onAbrirModal}><FiPlus size={18}/>Nueva transacción</button>
                    <button className="btn-configuracion" onClick={() => setModalAbierto(true)}>
                        <FiSettings size={18}/> Configuración
                    </button>
                    <button className="btn-logout" onClick={onLogout}>Cerrar Sesión</button>
                </div>
            </nav>

            {modalAbierto && (<ModalConfiguracion onCerrar={() => setModalAbierto(false)} />)}
        </>
    );
}