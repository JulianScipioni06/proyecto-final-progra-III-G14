import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import '../styles/components/FormularioTransaccion.css';
import '../styles/components/ModalConfirmacion.css'

export default function ModalConfirmacion({ isOpen, onClose, onConfirm}){
    if (!isOpen) return null;

    return(

        <div className="modal-overlay">
            <div className="modal-container confirmacion-container">
                <div className="confirmacion-icono">
                    <FiAlertTriangle/>
                </div>
                <h3>¿Estás seguro?</h3>
                <p className="confirmacion-texto">
                    Se va a eliminar la transaccion. Esta accion no se puede deshacer.
                </p>
                <div className="modal-bottons confirmacion-botones">
                    <button className="btn-cancelar" onClick={onClose}> Cancelar </button>
                    <button className="btn-guardar btn-peligro" onClick={onConfirm}>Eliminar</button>
                </div>
            </div>
        </div>

    )

}