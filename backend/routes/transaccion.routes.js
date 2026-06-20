const { Router } = require('express');
const router = Router();

// Acá los chicos del equipo van a ir metiendo los endpoints
// router.get('/', obtenerTodos);

const { crearTransaccion ,obtenerHistorial, obtenerPorCategoria , obtenerPorTipo } = require('../controllers/transaccion.controller');

router.post('/', crearTransaccion);
router.get('/:id_usuario/historial', obtenerHistorial);
router.get('/:id_usuario/por-categoria', obtenerPorCategoria);
router.get('/:id_usuario/por-tipo', obtenerPorTipo);


module.exports = router;