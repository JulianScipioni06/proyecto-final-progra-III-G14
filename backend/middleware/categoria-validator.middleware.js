const validateInputCategoria = (req, res, next) => {
    const { nombre_categoria } = req.body;
    const error = [];

    if (!nombre_categoria) {
        error.push('El nombre es obligatorio.');
    } else if (typeof nombre_categoria !== 'string') {
        error.push('El nombre debe ser un texto válido.');
    }

    if (error.length > 0) {
        return res.status(400).json({ error: error });
    }

    next();
}

module.exports = { validateInputCategoria };