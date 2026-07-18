import React, { useState } from 'react';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import '../styles/components/TransaccionesList.css';

export default function TransaccionesList({ transacciones = [] }) {
    const [verTodas, setVerTodas] = useState(false);

    const ultimasTransacciones = 5;

    // que muestre las ultmas 5 transacicones registradas
    let transaccionesAMostrar;
    if (verTodas) {
        transaccionesAMostrar = transacciones;
    } else {
        transaccionesAMostrar = transacciones.slice(0, ultimasTransacciones);
    }

    // texto del botón
    let textoBoton;
    if (verTodas) {
        textoBoton = 'Ver menos';
    } else {
        textoBoton = 'Ver todas las transacciones';
    }

    return (
        <div className="transacciones-lista-card">
            <div className="transacciones-lista-header">
                {/* Le cambiamos un poco el título ya que ahora es el historial completo */}
                <h3 className="transacciones-lista-titulo">Historial de transacciones</h3>
            </div>

            {transacciones.length === 0 && (
                <p className="transacciones-lista-empty">No hay transacciones registradas.</p>
            )}

            {transacciones.length > 0 && (
                // A la etiqueta <ul> le agregamos una clase extra o usamos la que ya tiene
                <ul className="transacciones-lista scroll-activado">
                    {transacciones.map((t) => {
                        let icono;
                        let claseTipo;
                        let signo;

                        if (t.tipo === 'ingreso') {
                            icono = <FiArrowUpRight size={18} />;
                            claseTipo = 'income';
                            signo = '+';
                        } else {
                            icono = <FiArrowDownRight size={18} />;
                            claseTipo = 'expense';
                            signo = '-';
                        }

                        return (
                            <li key={t.id_transaccion} className="transacciones-item">
                                <div className={`transacciones-icon ${claseTipo}`}>
                                    {icono}
                                </div>
                                <div className="transacciones-info">
                                    <span className="transacciones-desc">{t.descripcion || 'Movimiento'}</span>
                                    <span className="transacciones-category">
                                        {t.categoria?.nombre_categoria || 'Sin categoría'}
                                    </span>
                                </div>
                                <div className="transacciones-right">
                                    <span className={`transacciones-amount ${claseTipo}`}>
                                        {signo}${Math.abs(t.monto).toLocaleString()}
                                    </span>
                                    <span className="transacciones-date">
                                        {new Date(t.fecha).toLocaleDateString('es-AR')}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}