const { Router } = require('express');
const router = Router();

// Acá los chicos del equipo van a ir metiendo los endpoints
// router.get('/', obtenerTodos);

const { crearTransaccion } = require('../controllers/transaccion.controller');

router.post('/', crearTransaccion);


module.exports = router;