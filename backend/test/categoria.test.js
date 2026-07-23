const httpMocks = require('node-mocks-http');

// Bloqueamos el modelo antes de importar el controlador.
jest.mock('../models/categoria.model', () => ({
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn() 
}));

// Importamos el modelo para manipularlo
const mockCategoria = require('../models/categoria.model');

// Importamos el controlador 
const { 
    listarCategorias, 
    crearCategoria, 
    actualizarCategoria, 
    eliminarCategoria 
} = require('../controllers/categoria.controller');

describe('Pruebas Unitarias - Categoria Controller', () => {

    beforeEach(() => {
        // Reseteamos la memoria para que no afecte a test siguientes.
        jest.resetAllMocks(); 
    });

    // TESTS PARA GET - listarCategorias
    describe('GET - listarCategorias', () => {
        test('Debe devolver status 200 y la lista de categorias', async () => {
            const categoriasFalsas = [{ id_categoria: 1, nombre_categoria: 'Comida' }];
            mockCategoria.findAll.mockResolvedValue(categoriasFalsas);

            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();

            await listarCategorias(req, res);

            expect(res.statusCode).toBe(200);
            expect(mockCategoria.findAll).toHaveBeenCalledTimes(1);
        });

        test('Debe devolver status 500 si la base de datos falla', async () => {
            mockCategoria.findAll.mockRejectedValue(new Error('Falla de red'));

            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();

            await listarCategorias(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toHaveProperty('mensaje', 'error al listar las categorias');
        });
    });

    // TESTS PARA POST - crearCategoria
    describe('POST - crearCategoria', () => {
        test('Debe crear una categoría y devolver status 201', async () => {
            const req = httpMocks.createRequest({ body: { nombre_categoria: 'Ocio' } });
            const res = httpMocks.createResponse();

            mockCategoria.findOne.mockResolvedValue(null);
            mockCategoria.create.mockResolvedValue({ id_categoria: 3, nombre_categoria: 'Ocio' });

            await crearCategoria(req, res);

            expect(res.statusCode).toBe(201);
            expect(res._getJSONData()).toHaveProperty('nombre_categoria', 'Ocio');
        });

        test('Debe devolver status 400 si la categoria ya existe', async () => {
            const req = httpMocks.createRequest({ body: { nombre_categoria: 'Comida' } });
            const res = httpMocks.createResponse();

            mockCategoria.findOne.mockResolvedValue({ id_categoria: 1, nombre_categoria: 'Comida' });

            await crearCategoria(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toHaveProperty('mensaje', 'La categoría ya existe');
        });

        test('Debe devolver status 500 si la base de datos falla', async () => {
            const req = httpMocks.createRequest({ body: { nombre_categoria: 'Error Categoria' } });
            const res = httpMocks.createResponse();

            mockCategoria.findOne.mockRejectedValue(new Error('Base de datos Caida'));

            await crearCategoria(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toHaveProperty('mensaje', 'error al crear la categoria');
        });
    });

    // TESTS PARA PUT - actualizarCategoria
    describe('PUT - actualizarCategoria', () => {
        test('Debe actualizar la categoria y devolver 200', async () => {
            const req = httpMocks.createRequest({ 
                params: { id: 1 }, 
                body: { nombre_categoria: 'Sueldo' } 
            });
            const res = httpMocks.createResponse();

            // Armamos el mock del objeto que devuelve sequelize
            const categoriaMock = {
                nombre_categoria: 'Salario',
                save: jest.fn().mockResolvedValue(true)
            };

            mockCategoria.findByPk.mockResolvedValue(categoriaMock);
            mockCategoria.findOne.mockResolvedValue(null); // Simulamos que no hay duplicados

            await actualizarCategoria(req, res);

            expect(res.statusCode).toBe(200);
            expect(categoriaMock.save).toHaveBeenCalledTimes(1);
        });

        test('Debe devolver 404 si no encuentra la categoria', async () => {
            const req = httpMocks.createRequest({ 
                params: { id: 999 }, 
                body: { nombre_categoria: 'Prueba' } 
            });
            const res = httpMocks.createResponse();

            mockCategoria.findByPk.mockResolvedValue(null);

            await actualizarCategoria(req, res);

            expect(res.statusCode).toBe(404);
        });
    });

    // TESTS PARA DELETE - eliminarCategoria
    describe('DELETE - eliminarCategoria', () => {
        test('Debe eliminar la categoria y devolver 200', async () => {
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();

            
            const categoriaMock = {
                destroy: jest.fn().mockResolvedValue(true)
            };

            mockCategoria.findByPk.mockResolvedValue(categoriaMock);

            await eliminarCategoria(req, res);

            expect(res.statusCode).toBe(200);
            expect(categoriaMock.destroy).toHaveBeenCalledTimes(1);
        });

        test('Debe devolver 404 si intento borrar algo que no existe', async () => {
            const req = httpMocks.createRequest({ params: { id: 999 } });
            const res = httpMocks.createResponse();

            mockCategoria.findByPk.mockResolvedValue(null);

            await eliminarCategoria(req, res);

            expect(res.statusCode).toBe(404);
        });
    });
});