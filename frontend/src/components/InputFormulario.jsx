import React from 'react';
import '../styles/components/InputFormulario.css';

export default function InputFormulario({ label, tipo, valor, alCambiar, placeholder }) {
    return (
        <div className="input-grupo">
            <label className="input-label">{label}</label>
            <input 
                type={tipo} 
                className="input-campo"
                value={valor} 
                onChange={alCambiar} 
                required 
                placeholder={placeholder}
            />
</div>
    );
}