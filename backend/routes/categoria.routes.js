const { Router } = require('express');
const router = Router();
const {crearCategoria, listarCategorias, actualizarCategoria, eliminarCategoria} = require ('../controllers/categoria.controller');
const {validarJWT} = require('../middleware/validar-jwt.middleware')

router.get('/', validarJWT, listarCategorias);
router.post('/', validarJWT, crearCategoria);
router.put('/:id', validarJWT, actualizarCategoria);
router.delete('/:id', validarJWT, eliminarCategoria);

module.exports = router;