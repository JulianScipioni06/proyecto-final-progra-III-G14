const Transaccion = require('../models/transaccion.model');
const Categoria = require('../models/categoria.model');
const { Op, Sequelize } = require('sequelize');

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
const obtenerHistorial = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { tipo, id_categoria, fechaInicio, fechaFin } = req.query;
    
        let filtros = { id_usuario };
    
        //Filtro por tipo de Ingreso o Gasto
        if (tipo) {
            filtros.tipo = tipo;
        }
    
        //Filtro por categoria
        if (id_categoria) {
            filtros.id_categoria = id_categoria;
        }
    
        //Filtro por rango de fechas
        if (fechaInicio || fechaFin) {
            filtros.fecha = {};
            if (fechaInicio) {
            filtros.fecha[Op.gte] = new Date(fechaInicio);
        }
        if (fechaFin) {
            filtros.fecha[Op.lte] = new Date(fechaFin);
        }
        }
    
        const transacciones = await Transaccion.findAll({
            where: filtros,
            include: [
            { model: Categoria, as: "categoria", attributes: ["nombre_categoria"] },
            ],
            order: [["fecha", "DESC"]],
        });
        res.json(transacciones);
        } catch (error) {
        res
            .status(500)
            .json({ error: "Error al obtener el historial de transacciones." });
        }
    };
    
const obtenerPorCategoria = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { id_categoria } = req.query; // El sistema o Postman va a mandar esto (?id_categoria=X)

        let filtros = { id_usuario };
        
        // Si mandan una categoría específica, la agregamos a los filtros
        if (id_categoria) {
            filtros.id_categoria = id_categoria;
        }

        const transacciones = await Transaccion.findAll({
            where: filtros,
            // Incluimos la categoría para que en cada fila veas reflejado su nombre
            include: [{ model: Categoria, as: "categoria", attributes: ["nombre_categoria"] }],
            order: [["fecha", "DESC"]] // Ordenadas de la más nueva a la más vieja
        });

        res.json(transacciones);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener transacciones por categoría.",
            detalle_del_error: error.message,
        });
    }
};

const obtenerPorTipo = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { tipo } = req.query; // El sistema o Postman va a mandar esto

        let filtros = { id_usuario };
        
        // Si mandamos el tipo (?tipo=gasto), lo agregamos al filtro de búsqueda
        if (tipo) {
            filtros.tipo = tipo;
        }

        const transacciones = await Transaccion.findAll({
            where: filtros,
            // Incluimos la categoría para que en la lista sepas en qué fue el gasto/ingreso
            include: [{ model: Categoria, as: "categoria", attributes: ["nombre_categoria"] }], 
            order: [["fecha", "DESC"]] // Ordenamos del más reciente al más viejo
        });

        res.json(transacciones);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener transacciones por tipo.",
            detalle_del_error: error.message 
        });
    }
};

const actualizarTransaccion = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Buscamos si la transacción existe
        const transaccion = await Transaccion.findByPk(id);
        
        if (!transaccion) {
            return res.status(404).json({ error: "Transacción no encontrada" });
        }

        await transaccion.update(req.body);

        res.status(200).json({ 
            msg: "Transacción actualizada correctamente",
            transaccion 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la transacción" });
    }
};

module.exports = {
    crearTransaccion,
    obtenerHistorial,
    obtenerPorCategoria,
    obtenerPorTipo,
    actualizarTransaccion
};