import express from 'express';
import { apresentarCombustivel, apresentarCombustivelPorId, apresentarCombustivelPorNome } from '../servicos/combustivel/apresentar.js';
import { adicionarCombustivel } from '../servicos/combustivel/adicionar.js';
import AppError from '../utils/AppError.js';
import { validarCombustivel, validarCombustivelParcial } from '../validacao/validarCombustivel.js';
import { deletarCombustivel } from '../servicos/combustivel/deletar.js';
import { editarCombustivel } from '../servicos/combustivel/editar.js';

const routerCombustivel = express.Router();

routerCombustivel.put('/:id', async (req, res) => {
    //#swagger.tags = ['Combustível']
    //#swagger.description = 'Edita um combustível pelo ID'
    //#swagger.parameters['id'] = { in: 'path', description: 'ID do combustível', required: true, type: 'integer' }
    const { id } = req.params;
    const { nome } = req.body;
    try {
        if (isNaN(id)) {
            throw new AppError('ID inválido', 400, 'INVALID_ID');
        }
    
        if (nome === undefined) {
            throw new AppError('Nome do combustível é obrigatório', 400, 'MISSING_NAME');
        }
    
        const nomeValido = await validarCombustivelParcial(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        const resultado = await editarCombustivel(id, nome);

        if (resultado.affectedRows === 0) {
            throw new AppError('Combustível não encontrado', 404, 'COMBUSTIVEL_NOT_FOUND');
        }

        return res.status(200).send("Combustível editado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        // Aqui você pode usar next(error) se tiver um middleware global de tratamento de erros
        throw new AppError('Erro ao editar combustível', 500, 'COMBUSTIVEL_EDIT_ERROR', error.message);
    }
});

routerCombustivel.post('/', async (req, res) => {
    //#swagger.tags = ['Combustível']
    //#swagger.description = 'Cadastra um combustível'
    //#swagger.parameters['combustivel'] = { in: 'body', description: 'Dados do combustível', required: true, schema: { $ref: '#/definitions/Combustivel' } }
    const { nome } = req.body;

    try {
        if (!nome) {
            throw new AppError('Nome e valor da combustível é obrigatório.', 400, 'MISSING_DATA');
        }
    
        const nomeValido = await validarCombustivel(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        await adicionarCombustivel(nome);

        return res.status(201).send("Combustível cadastrado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }
});

routerCombustivel.get('/', async (req, res) => {
    //#swagger.tags = ['Combustível']
    //#swagger.description = 'Lista todos os combustíveis'
    //#swagger.parameters['nome'] = { in: 'query', description: 'Nome do combustível', required: false, type: 'string' }
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarCombustivelPorNome(nome);
        if (!resultado.length) {
            throw new AppError('Combustível com esse nome não encontrado', 404, 'COMBUSTIVEL_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarCombustivel();
        res.status(200).json(resultado);
    }
});

routerCombustivel.get('/:id', async (req, res) => {
    //#swagger.tags = ['Combustível']
    //#swagger.description = 'Lista um combustível pelo ID'
    //#swagger.parameters['id'] = { in: 'path', description: 'ID do combustível', required: true, type: 'integer' }
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarCombustivelPorId(id);
        if (!resultado.length) {
            throw new AppError('Combustível não encontrado', 404, 'COMBUSTIVEL_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarCombustivel();
        res.status(200).json(resultado);
    }
});

routerCombustivel.delete('/:id', async (req, res) => {
    //#swagger.tags = ['Combustível']
    //#swagger.description = 'Deleta um combustível pelo ID'
    //#swagger.parameters['id'] = { in: 'path', description: 'ID do combustível', required: true, type: 'integer' }
    const { id } = req.params;
    try {
        const resultado = await deletarCombustivel(id);
        if (resultado.affectedRows === 0) {
            throw new AppError('Combustivel não encontrado', 404, 'COMBUSTIVEL_NOT_FOUND');
        }
        res.status(200).send("Combustivel deletado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }

});

export default routerCombustivel;