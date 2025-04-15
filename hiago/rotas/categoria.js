import express from 'express';
import { apresentarCategoria, apresentarCategoriaPorId, apresentarCategoriaPorNome } from '../servicos/categoria/apresentar.js';
import { adicionarCategoria } from '../servicos/categoria/adicionar.js';
import AppError from '../utils/AppError.js';
import { validarCategoria, validarCategoriaParcial } from '../validacao/validarCategoria.js';
import { deletarCategoria } from '../servicos/categoria/deletar.js';
import { editarCategoria } from '../servicos/categoria/editar.js';

const routerCategoria = express.Router();

routerCategoria.put('/:id', async (req, res) => {
    //#swagger.tags = ['Categoria']
    //#swegger.description = 'Atualiza uma categoria com base no ID fornecido. Retorna um erro se o ID não for válido ou se a categoria não for encontrada.'
    //#swegger.parameters['id'] = { in: 'path', description: 'ID da categoria', required: true, type: 'integer' }
    const { id } = req.params;
    const { nome } = req.body;
    try {
        if (isNaN(id)) {
            throw new AppError('ID inválido', 400, 'INVALID_ID');
        }
    
        if (nome === undefined) {
            throw new AppError('Nome da categoria é obrigatório', 400, 'MISSING_NAME');
        }
    
        const nomeValido = await validarCategoriaParcial(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        const resultado = await editarCategoria(id, nome);

        if (resultado.affectedRows === 0) {
            throw new AppError('categoria não encontrada', 404, 'CATEGORIA_NOT_FOUND');
        }

        return res.status(200).send("categoria editada com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        // Aqui você pode usar next(error) se tiver um middleware global de tratamento de erros
        throw new AppError('Erro ao editar categoria', 500, 'CATEGORIA_EDIT_ERROR', error.message);
    }
});

routerCategoria.post('/', async (req, res) => {
    //#swagger.tags = ['Categoria']
    //#swegger.description = 'Cadastra uma nova categoria. Retorna um erro se o nome não for fornecido ou se o valor for inválido.'
    //#swegger.parameters['nome'] = { in: 'body', description: 'Dados da categoria', required: true, schema: { $ref: '#/definitions/Categoria' } }
    const { nome } = req.body;

    try {
        if (!nome) {
            throw new AppError('Nome e valor da categoria é obrigatório.', 400, 'MISSING_DATA');
        }
    
        const nomeValido = await validarCategoria(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        await adicionarCategoria(nome);

        return res.status(201).send("Categoria cadastrada com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }
});

routerCategoria.get('/', async (req, res) => {
    //#swagger.tags = ['Categoria']
    //#swegger.description = 'Retorna todas as categorias. Se um nome for fornecido, retorna apenas a categoria correspondente.'
    //#swegger.parameters['nome'] = { in: 'query', description: 'Nome da categoria', required: false, type: 'string' }
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarCategoriaPorNome(nome);
        if (!resultado.length) {
            throw new AppError('Categoria com esse nome não encontrada', 404, 'CATEGORIA_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarCategoria();
        res.status(200).json(resultado);
    }
});

routerCategoria.get('/:id', async (req, res) => {
    //#swagger.tags = ['Categoria']
    //#swegger.description = 'Retorna uma categoria com base no ID fornecido. Retorna um erro se o ID não for válido ou se a categoria não for encontrada.'
    //#swegger.parameters['id'] = { in: 'path', description: 'ID da categoria', required: true, type: 'integer' }
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarCategoriaPorId(id);
        if (!resultado.length) {
            throw new AppError('Categoria não encontrada', 404, 'Categoria_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarCategoria();
        res.status(200).json(resultado);
    }
});

routerCategoria.delete('/:id', async (req, res) => {
    //#swagger.tags = ['Categoria']
    //#swegger.description = 'Deleta uma categoria com base no ID fornecido. Retorna um erro se o ID não for válido ou se a categoria não for encontrada.'
    //#swegger.parameters['id'] = { in: 'path', description: 'ID da categoria', required: true, type: 'integer' }
    const { id } = req.params;
    try {
        const resultado = await deletarCategoria(id);
        if (resultado.affectedRows === 0) {
            throw new AppError('Categoria não encontrada', 404, 'Categoria_NOT_FOUND');
        }
        res.status(200).send("Categoria deletada com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }

});

export default routerCategoria;