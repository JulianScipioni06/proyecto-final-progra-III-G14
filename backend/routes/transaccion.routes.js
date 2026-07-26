const { Router } = require('express');
const router = Router();
const { validarJWT } = require('../middleware/validar-jwt.middleware');
const {validateInputTransaccion} = require('../middleware/transaccion-validator.middleware')

const { crearTransaccion ,obtenerHistorial, obtenerPorCategoria , obtenerPorTipo, actualizarTransaccion, eliminarTransaccion, obtenerBalance } = require('../controllers/transaccion.controller');

router.post('/', validarJWT, validateInputTransaccion,crearTransaccion);
router.get('/:id_usuario/historial', validarJWT, obtenerHistorial);
router.get('/:id_usuario/por-categoria', validarJWT, obtenerPorCategoria);
router.get('/:id_usuario/por-tipo', validarJWT, obtenerPorTipo);
router.get('/:id_usuario/balance', validarJWT, obtenerBalance);
router.put('/:id', validarJWT, validateInputTransaccion,actualizarTransaccion);
router.delete('/:id', validarJWT, eliminarTransaccion);


module.exports = router;