import React, { useState } from 'react';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import '../styles/components/TransaccionesList.css';

export default function TransaccionesList({ transacciones = [] }) {
    const [verTodas, setVerTodas] = useState(false);

    const transaccionesAMostrar = verTodas ? transacciones : transacciones.slice(0, 3);

    return (
        <div className="transacciones-lista-card">
            <div className="transacciones-lista-header">
                <h3 className="transacciones-lista-titulo">Ultimas transacciones</h3>
            </div>

            {transacciones.length === 0 ? (
                <p className="transacciones-lista-empty">No hay transacciones recientes.</p>
            ) : (
                <>
                    <ul className="transacciones-lista">
                        {transaccionesAMostrar.map((t) => (
                            <li key={t.id_transaccion} className="transacciones-item">
                                <div className={`transacciones-icon ${t.tipo === 'ingreso' ? 'income' : 'expense'}`}>
                                    {t.tipo === 'ingreso'
                                        ? <FiArrowUpRight size={18} />
                                        : <FiArrowDownRight size={18} />}
                                </div>
                                <div className="transacciones-info">
                                    <span className="transacciones-desc">{t.descripcion}</span>
                                    <span className="transacciones-category">{t.categoria || 'Sin categoría'}</span>
                                </div>
                                <div className="transacciones-right">
                                    <span className={`transacciones-amount ${t.tipo === 'ingreso' ? 'income' : 'expense'}`}>
                                        {t.tipo === 'ingreso' ? '+' : '-'}${Math.abs(t.monto).toLocaleString()}
                                    </span>
                                    <span className="transacciones-date">
                                        {new Date(t.fecha).toLocaleDateString('es-AR')}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {transacciones.length > 3 && (
                        <button
                            className="transacciones-lista-btn"
                            onClick={() => setVerTodas(!verTodas)}
                        >
                            {verTodas ? 'Ver menos' : 'Ver todas las transacciones'}
                        </button>
                    )}
                </>
            )}
        </div>
    );
}