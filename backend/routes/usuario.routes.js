const { Router } = require('express');
const router = Router();

const {
    registrarUsuario,
    loginUsuario,
    obtenerTodosLosUsuarios,
    actualizarUsuario
} = require('../controllers/usuario.controller');

// importamos el middleware de validacion
const{validateInputUsuario} = require('../middleware/usuario-validator.middleware');

// rutas
router.post('/registrar', validateInputUsuario, registrarUsuario);
router.post('/login', loginUsuario);
router.get('/', obtenerTodosLosUsuarios);
router.put('/:id_usuario', validateInputUsuario, actualizarUsuario)

module.exports = router;