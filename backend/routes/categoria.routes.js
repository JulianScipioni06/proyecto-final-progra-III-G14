const { Router } = require('express');
const router = Router();
const {crearCategoria, listarCategorias, actualizarCategoria, eliminarCategoria} = require ('../controllers/categoria.controller');
const {validarJWT} = require('../middleware/validar-jwt.middleware')
const{validateInputCategoria} = require('../middleware/categoria-validator.middleware');

router.get('/', validarJWT, listarCategorias);
router.post('/', validarJWT, validateInputCategoria, crearCategoria);
router.put('/:id', validarJWT, validateInputCategoria, actualizarCategoria);
router.delete('/:id', validarJWT, eliminarCategoria);

module.exports = router;