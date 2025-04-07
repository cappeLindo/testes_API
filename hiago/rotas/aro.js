import express from 'express';
import { apresentarAro, apresentarAroPorId, apresentarAroPorNome } from '../servicos/aro/apresentar.js';
import { adicionarAro } from '../servicos/aro/adicionar.js';
import AppError from '../utils/AppError.js';

const routerAro = express.Router();

routerAro.post('/', async (req, res) => {
    const { nome } = req.body;
    if (!nome) {
        throw new AppError('Nome do aro é obrigatório', 400, 'MISSING_NAME');
    }
    try {
        const nomeValido = await validarDados(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', error.message);
        }
        await adicionarAro(nome);

        return res.status(201).send("Aro cadastrado com sucesso!");
    } catch (error) {
        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }

});


routerAro.get('/', async (req, res) => {
    const {nome} = req.query;
    if (nome) {
        const resultado = await apresentarAroPorNome(nome);
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarAro();
        res.status(200).json(resultado);
    }
});

routerAro.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarAroPorId(id);
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarAro();
        res.status(200).json(resultado);
    }
});


export default routerAro;