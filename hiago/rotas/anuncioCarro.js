import express from 'express';
import AppError from '../utils/AppError.js';

import { apresentarCarro, apresentarCarroPorNome, apresentarCarroPorID } from '../servicos/anuncioCarro/apresentar.js';

const routeAnuncioCarro = express.Router();

routeAnuncioCarro.get('/', async (req, res) => {
    // #swagger.tags = ['Carro']
    // #swagger.description = 'Lista todos os carros ou busca por nome'
    // #swagger.parameters['nome'] = { in: 'query', description: 'Nome do carro', required: false, type: 'string' }
    const { nome } = req.query;
    try {

        if (nome) {
            const resultado = await apresentarCarroPorNome(nome);
            if (!resultado.length) {
                throw new AppError('Carro com esse nome não encontrado', 404, 'CARRO_NOT_FOUND');
            }
            res.status(200).json(resultado);
        } else {
            const resultado = await apresentarCarro();
            res.status(200).json(resultado);
        }
    } catch (error) {
        if (!(error instanceof AppError)) {
            throw new AppError('Erro ao apresentar carro', 500, 'CARRO_LIST_ERROR', error.message);
        }
        throw error;
    }
});

routeAnuncioCarro.get('/:id', async (req, res) => {
    // #swagger.tags = ['Carro']
    // #swagger.description = 'Lista todos os carros ou busca por ID'
    // #swagger.parameters['id'] = { in: 'query', description: 'ID do carro', required: false, type: 'integer' }
    const { id } = req.params;
    try {

        if (id) {
            const resultado = await apresentarCarroPorID(id);
            if (!resultado.length) {
                throw new AppError('Carro com esse id não encontrado', 404, 'CARRO_NOT_FOUND');
            }
            res.status(200).json(resultado);
        } else {
            const resultado = await apresentarCarro();
            res.status(200).json(resultado);
        }
    } catch (error) {
        if (!(error instanceof AppError)) {
            throw new AppError('Erro ao apresentar carro', 500, 'CARRO_LIST_ERROR', error.message);
        }
        throw error;
    }
});


export default routeAnuncioCarro;