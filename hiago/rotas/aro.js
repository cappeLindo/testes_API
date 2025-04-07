import express from 'express';
import { apresentarAro, apresentarAroPorId, apresentarAroPorNome } from '../servicos/aro/apresentar.js';
import { adicionarAro } from '../servicos/aro/adicionar.js';
import AppError from '../utils/AppError.js';
import { validarAro } from '../validacao/validarAro.js';
import { deletarAro } from '../servicos/aro/deletar.js';

const routerAro = express.Router();

routerAro.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError('ID do aro é obrigatório', 400, 'MISSING_ID');
    }

    try {
        const resultado = await deletarAro(id);
        if (resultado.affectedRows === 0) {
            throw new AppError('Aro não encontrado', 404, 'ARO_NOT_FOUND');
        }
        res.status(200).send("Aro deletado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }
});

routerAro.post('/', async (req, res) => {
    const { nome } = req.body;

    if (!nome) {
        throw new AppError('Nome e valor do aro são obrigatórios.', 400, 'MISSING_DATA');
    }

    try {
        const nomeValido = await validarAro(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        await adicionarAro(nome);

        return res.status(201).send("Aro cadastrado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }
});

routerAro.get('/', async (req, res) => {
    const {nome} = req.query;
    if (nome) {
        const resultado = await apresentarAroPorNome(nome);
        if (!resultado.length) {
            throw new AppError('Aro com esse nome não encontrado', 404, 'ARO_NOT_FOUND');
          }
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
        if (!resultado.length) {
            throw new AppError('Aro não encontrado', 404, 'ARO_NOT_FOUND');
          }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarAro();
        res.status(200).json(resultado);
    }
});


export default routerAro;