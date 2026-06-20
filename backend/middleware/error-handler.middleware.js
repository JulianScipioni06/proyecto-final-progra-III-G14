const errorHandler = (err, req, res, next) => {
    console.error(`[SERVER ERROR]: ${err.message}`)

    // Si el error viene de Sequelize (ej: error de validación de base de datos)
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
        error: 'Error de validación en la base de datos',
        detalles: err.errors.map((e) => e.message)
        })
    }

    // Cualquier otro error inesperado responde 500
    return res.status(500).json({
        error: 'Ocurrió un error interno en el servidor'
    })
}

module.exports = errorHandler