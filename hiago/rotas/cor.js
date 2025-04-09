import express from 'express';
import { apresentarCor, apresentarCorPorId, apresentarCorPorNome } from '../servicos/cor/apresentar.js';
import { adicionarCor } from '../servicos/cor/adicionar.js';
import AppError from '../utils/AppError.js';
import { validarCor } from '../validacao/validarCor.js';
import { deletarCor } from '../servicos/cor/deletar.js';
import { editarCor } from '../servicos/cor/editar.js';

const routerCor = express.Router();

routerCor.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        if (isNaN(id)) {
            throw new AppError('ID inválido', 400, 'INVALID_ID');
        }
    
        if (nome === undefined) {
            throw new AppError('Nome da cor é obrigatório', 400, 'MISSING_NAME');
        }
    
        const nomeValido = await validarCor(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        const resultado = await editarCor(id, nome);

        if (resultado.affectedRows === 0) {
            throw new AppError('Cor não encontrada', 404, 'COR_NOT_FOUND');
        }

        return res.status(200).send("Cor editada com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        // Aqui você pode usar next(error) se tiver um middleware global de tratamento de erros
        throw new AppError('Erro ao editar cor', 500, 'COR_EDIT_ERROR', error.message);
    }
});

routerCor.post('/', async (req, res) => {
    const { nome } = req.body;

    try {
        if (!nome) {
            throw new AppError('Nome e valor da cor é obrigatório.', 400, 'MISSING_DATA');
        }
    
        const nomeValido = await validarCor(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        await adicionarCor(nome);

        return res.status(201).send("Cor cadastrada com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }
});

routerCor.get('/', async (req, res) => {
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarCorPorNome(nome);
        if (!resultado.length) {
            throw new AppError('Cor com esse nome não encontrada', 404, 'COR_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarCor();
        res.status(200).json(resultado);
    }
});

routerCor.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarCorPorId(id);
        if (!resultado.length) {
            throw new AppError('Cor não encontrada', 404, 'COR_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarCor();
        res.status(200).json(resultado);
    }
});

routerCor.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await deletarCor(id);
        if (resultado.affectedRows === 0) {
            throw new AppError('Cor não encontrada', 404, 'COR_NOT_FOUND');
        }
        res.status(200).send("Cor deletada com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }

});

export default routerCor;