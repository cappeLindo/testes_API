import express from 'express';
import { apresentarCambio, apresentarCambioPorId, apresentarCambioPorNome } from '../servicos/cambio/apresentar.js';
import { adicionarCambio } from '../servicos/cambio/adicionar.js';
import AppError from '../utils/AppError.js';
import { validarCambio } from '../validacao/validarCambio.js';
import { deletarCambio } from '../servicos/cambio/deletar.js';
import { editarCambio } from '../servicos/cambio/editar.js';

const routerCambio = express.Router();

routerCambio.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        if (isNaN(id)) {
            throw new AppError('ID inválido', 400, 'INVALID_ID');
        }
    
        if (nome === undefined) {
            throw new AppError('Nome do câmbio é obrigatório', 400, 'MISSING_NAME');
        }
    
        const nomeValido = await validarCambio(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        const resultado = await editarCambio(id, nome);

        if (resultado.affectedRows === 0) {
            throw new AppError('câmbio não encontrado', 404, 'CAMBIO_NOT_FOUND');
        }

        return res.status(200).send("câmbio editado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        // Aqui você pode usar next(error) se tiver um middleware global de tratamento de erros
        throw new AppError('Erro ao editar câmbio', 500, 'CAMBIO_EDIT_ERROR', error.message);
    }
});

routerCambio.post('/', async (req, res) => {
    const { nome } = req.body;

    try {
        if (!nome) {
            throw new AppError('Nome e valor do câmbio é obrigatório.', 400, 'MISSING_DATA');
        }
    
        const nomeValido = await validarCambio(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        await adicionarCambio(nome);

        return res.status(201).send("Câmbio cadastrado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }
});

routerCambio.get('/', async (req, res) => {
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarCambioPorNome(nome);
        if (!resultado.length) {
            throw new AppError('Câmbio com esse nome não encontrado', 404, 'CAMBIO_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarCambio();
        res.status(200).json(resultado);
    }
});

routerCambio.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarCambioPorId(id);
        if (!resultado.length) {
            throw new AppError('Câmbio não encontrado', 404, 'CAMBIO_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarCambio();
        res.status(200).json(resultado);
    }
});

routerCambio.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await deletarCambio(id);
        if (resultado.affectedRows === 0) {
            throw new AppError('Câmbio não encontrado', 404, 'CAMBIO_NOT_FOUND');
        }
        res.status(200).send("Câmbio deletado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }

});

export default routerCambio;