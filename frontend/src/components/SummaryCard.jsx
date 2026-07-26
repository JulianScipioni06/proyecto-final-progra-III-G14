import React from 'react';
import { FiArrowUpRight, FiArrowDownRight} from 'react-icons/fi';
import '../styles/components/SummaryCard.css';

export default function SummaryCard({ title, amount, subtitle, type }) {
    const cardClassName = `summary-card ${type}`;

    // Lógica para mostrar el ícono  según el tipo de tarjeta
    const renderIcon = () => {
        if (type === 'income') return <FiArrowUpRight size={20} />;
        if (type === 'expense') return <FiArrowDownRight size={20} />;
        return null; 
    };

    return (
        <div className={cardClassName}>
        <div className="card-header">
            <h3 className="card-title">{title}</h3>
            {type !== 'main' && (
            <div className="card-icon-container">
                {renderIcon()}
            </div>
            )}
        </div>
        
        <div className="card-body">
            <h2 className="card-amount">{amount}</h2>
            <p className="card-subtitle">
            {type === 'income' && <FiArrowUpRight style={{marginRight: '4px'}}/>}
            {type === 'expense' && <FiArrowDownRight style={{marginRight: '4px'}}/>}
            {subtitle}
            </p>
        </div>
        </div>
    );
    }