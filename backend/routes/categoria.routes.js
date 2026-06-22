const { Router } = require('express');
const router = Router();
const {crearCategoria, listarCategorias} = require ('../controllers/categoria.controller');
const {validarJWT} = require('../middleware/validar-jwt.middleware')

router.get('/', validarJWT, listarCategorias);
router.post('/', validarJWT, crearCategoria);

module.exports = router;