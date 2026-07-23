//Test de transacciones
const request = require('supertest');
//mock de los middlewares
jest.mock('../middleware/validar-jwt.middleware', () => ({
    validarJWT: (req, res, next) => next()
}));
jest.mock('../middleware/transaccion-validator.middleware', () => ({
    validateInputTransaccion: (req, res, next) => next()
}));
const app = require('../app');
const transaccion = require('../models/transaccion.model');
//mock del modelo
jest.mock('../models/transaccion.model');
const { validarJWT } = require('../middleware/validar-jwt.middleware');
transaccion.findByPk = jest.fn();
transaccion.findAll = jest.fn();

//crear transaccion
//obtener historial
//obtener por categoria
//obtener por tipo

//editar transaccion
describe('PUT /transacciones/:id', () => {
    it('Debe actualizar el monto de una transaccion y devolver 200', async () => {
        //transaccion falsa
        const transaccionMock = {
            id: '123',
            monto: 1000,
            update: jest.fn().mockResolvedValue(true),
            //convertimos el mock a json para que no explote
            toJSON: () => ({id: '123', monto: 1500})
        };
        transaccion.findByPk.mockResolvedValue(transaccionMock);
        const res = await request(app).put('/transacciones/123')
        .send({monto: 1500});
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe('Transacción actualizada correctamente')
    });

    it('Debe devolver 404 si el id no existe', async () => {
        transaccion.findByPk.mockResolvedValue(null);
        const res = await request(app).put('/transacciones/111')
        .send({monto: 2000});
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Transacción no encontrada');
    });
});

//eliminar transaccion
describe('DELETE /transacciones/:id', () =>{
    it('Debe eliminar la transaccion y devolver 200', async () => {
        //armamos el objeto falso
        const transaccionMock = {
            id: '1',
            monto: 500,
            destroy: jest.fn().mockResolvedValue(true)
        };
        //simulamos que encuentra el objeto
        transaccion.findByPk.mockResolvedValue(transaccionMock)
        //peticion de borrado
        const res = await request(app).delete('/transacciones/1');
        expect(res.status).toBe(200);
        expect(transaccion.findByPk).toHaveBeenCalledWith('1');
        expect(transaccionMock.destroy).toHaveBeenCalled();
    });

    it('Debe devolver 404 si se intenta eliminar una transaccion q no existe', async () => {
        //simulamos que no la encontro
        transaccion.findByPk.mockResolvedValue(null);
        const res = await request(app).delete('/transacciones/11');
        expect(res.status).toBe(404);
    })

    it('Debe devolver 500 si hay un error en la base de datos', async () => {
        //simulamos que la bd tira un error inesperado
        transaccion.findByPk.mockRejectedValue(new Error('Fallo de la BD'));
        const res = await request(app).delete('/transacciones/1');
        expect(res.status).toBe(500);
    });
});

//obtener balance
describe('GET /transacciones/balance', () => {
    it('Debe calcular el balance de forma correcta', async () => {
        //el primer sum(ingreos) da 1500 y el segundo(gastos) da 1000
        transaccion.sum = jest.fn()
        .mockResolvedValueOnce(1500)
        .mockResolvedValueOnce(1000);
        const res = await request(app).get('/transacciones/1/balance');
        expect(res.status).toBe(200);
        expect(res.body.balanceActual).toBe(500);
    });
});