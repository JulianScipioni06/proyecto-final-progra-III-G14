const validateInputTransaccion = (req, res, next) => {
    const { monto, tipo, id_usuario, id_categoria } = req.body;
    const error = [];
    const esCreacion = req.method === 'POST';

    // Validación del monto
    if (monto !== undefined) {
        if (isNaN(monto) || parseFloat(monto) <= 0) {
            error.push('El monto debe ser un número válido y mayor a cero.');
        }
    } else if (esCreacion) {
        error.push('El monto es obligatorio.');
    }

    // Validación del tipo
    if (tipo !== undefined) {
        if (tipo !== 'ingreso' && tipo !== 'gasto') {
            error.push("El tipo de transacción debe ser exclusivamente 'ingreso' o 'gasto'.");
        }
    } else if (esCreacion) {
        error.push('El tipo de transacción es obligatorio.');
    }

    // Validación del id_usuario
    if (id_usuario !== undefined) {
        if (!Number.isInteger(Number(id_usuario)) || Number(id_usuario) <= 0) {
            error.push('El ID del usuario debe ser un número entero válido.');
        }
    } else if (esCreacion) {
        error.push('El ID del usuario es obligatorio.');
    }

    // Validación del id_categoria
    if (id_categoria !== undefined) {
        if (!Number.isInteger(Number(id_categoria)) || Number(id_categoria) <= 0) {
            error.push('El ID de la categoría debe ser un número entero válido.');
        }
    } else if (esCreacion) {
        error.push('El ID de la categoría es obligatorio.');
    }

    if (error.length > 0) {
        return res.status(400).json({ errores: error });
    }

    next();
};

module.exports = { validateInputTransaccion };