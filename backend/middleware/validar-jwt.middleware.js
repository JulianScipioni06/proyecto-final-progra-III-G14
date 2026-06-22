const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    // 1. Leemos el token que viene en los headers
    // En Postman hay que mandarlo en la pestaña "Headers" como clave "x-token"
    const token = req.header('x-token');

    // 2. Si no mandaron ningún token
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición. Acceso denegado.'
        });
    }

    try {
        // 3. Verificamos que el token sea válido y no esté vencido
        // Usamos la misma palabra secreta que hay en el controlador de login
        const payload = jwt.verify(token, process.env.SECRET_KEY || 'TU_PALABRA_SECRETA');

        req.usuarioAutenticado = payload;
        
        next();

    } catch (error) {
        console.error('Error al validar el token: ', error);
        return res.status(401).json({
            msg: 'Token no válido o expirado. Iniciá sesión nuevamente.'
        });
    }
};

module.exports = {
    validarJWT
};