import React from 'react';
import '../styles/components/BotonPrincipal.css'; 

export default function BotonPrincipal({ texto, tipo = "button", onClick }) {
    return (
        <button 
            type={tipo} 
            className="boton-principal" 
            onClick={onClick}
        >
            {texto}
        </button>
    );
}