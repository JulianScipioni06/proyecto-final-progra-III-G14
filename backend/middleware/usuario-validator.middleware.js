const validateInputUsuario = (req, res, next) => {
    const { nombre, email, contrasena } = req.body;
    const error = [];

    // 1. Validación del nombre
    if (!nombre) {
        error.push('El nombre es obligatorio.');
    } else if (typeof nombre !== 'string') {
        error.push('El nombre debe ser un texto válido.');
    }

    // 2. Validación del email
    if (!email) {
        error.push('El email es obligatorio.');
    } else if (typeof email !== 'string') {
        error.push('El email debe ser un formato de texto válido.');
    }

    // 3. Validación de la contraseña
    if (!contrasena) {
        error.push('La contraseña es obligatoria.');
    } else if (typeof contrasena !== 'string') {
        error.push('La contraseña debe ser un texto válido.');
    }

    if (error.length > 0) {
        return res.status(400).json({ error: error });
    }

    next();
}

module.exports = { validateInputUsuario };