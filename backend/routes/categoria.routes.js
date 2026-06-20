const { Router } = require('express');
const router = Router();
const {crearCategoria, listarCategorias} = require ('../controllers/categoria.controller');

router.get('/', listarCategorias);
router.post('/', crearCategoria);

// Acá los chicos del equipo van a ir metiendo los endpoints
// router.get('/', obtenerTodos);

module.exports = router;