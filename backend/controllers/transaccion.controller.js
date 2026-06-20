const Transaccion = require('../models/transaccion.model');

const crearTransaccion = async (req, res) => {
    try {
        const { monto, tipo, id_usuario, id_categoria } = req.body;

        if (!monto || !tipo || !id_usuario || !id_categoria) {
            return res.status(400).json({ 
                error: "Faltan campos obligatorios (monto, tipo, id_usuario, id_categoria)." 
            });
        }

        // Validar que el tipo sea correcto
        if (tipo !== 'ingreso' && tipo !== 'gasto') {
            return res.status(400).json({ 
                error: "El tipo de transacción debe ser 'ingreso' o 'gasto'." 
            });
        }

        // Validar que el monto sea un número positivo válido
        if (isNaN(monto) || parseFloat(monto) <= 0) {
            return res.status(400).json({ 
                error: "El monto debe ser un número mayor a cero." 
            });
        }

        // Crear registro en la base de datos
        const nuevaTransaccion = await Transaccion.create({
            monto: parseFloat(monto),
            tipo,
            id_usuario, 
            id_categoria  
        });

        return res.status(201).json({
            message: "Transacción registrada con éxito.",
            transaccion: nuevaTransaccion
        });

    } catch (error) {
        console.error("Error en crearTransaccion:", error);
        return res.status(500).json({ 
            error: "Hubo un problema interno al registrar la transacción." 
        });
    }
};

module.exports = {
    crearTransaccion
};