import express from 'express';
import { apresentarMarca, apresentarMarcaPorId, apresentarMarcaPorNome } from '../servicos/marca/apresentar.js';
import { adicionarMarca } from '../servicos/marca/adicionar.js';
import AppError from '../utils/AppError.js';
import { validarMarca, validarMarcaParcial } from '../validacao/validarMarca.js';
import { deletarMarca } from '../servicos/marca/deletar.js';
import { editarMarca } from '../servicos/marca/editar.js';

const routerMarca = express.Router();

routerMarca.put('/:id', async (req, res) => {
    // #swagger.tags = ['Marca']
    // #swagger.description = 'Edita uma marca pelo ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID da marca', required: true, type: 'integer' }
    const { id } = req.params;
    const { nome } = req.body;
    try {
        if (isNaN(id)) {
            throw new AppError('ID inválido', 400, 'INVALID_ID');
        }
    
        if (nome === undefined) {
            throw new AppError('Nome da marca é obrigatório', 400, 'MISSING_NAME');
        }
    
        const nomeValido = await validarMarcaParcial(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        const resultado = await editarMarca(id, nome);

        if (resultado.affectedRows === 0) {
            throw new AppError('Marca não encontrada', 404, 'MARCA_NOT_FOUND');
        }

        return res.status(200).send("Marca editada com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        // Aqui você pode usar next(error) se tiver um middleware global de tratamento de erros
        throw new AppError('Erro ao editar marca', 500, 'MARCA_EDIT_ERROR', error.message);
    }
});

routerMarca.post('/', async (req, res) => {
    // #swagger.tags = ['Marca']
    // #swagger.description = 'Cadastra uma marca'
    // #swagger.parameters['marca'] = { in: 'body', description: 'Dados da marca', required: true, schema: { $ref: '#/definitions/Marca' } }
    const { nome } = req.body;

    try {
        if (!nome) {
            throw new AppError('Nome e valor da marca é obrigatório.', 400, 'MISSING_DATA');
        }
    
        const nomeValido = await validarMarca(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        await adicionarMarca(nome);

        return res.status(201).send("Marca cadastrada com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }
});

routerMarca.get('/', async (req, res) => {
    // #swagger.tags = ['Marca']
    // #swagger.description = 'Lista todas as marcas ou busca por nome'
    // #swagger.parameters['nome'] = { in: 'query', description: 'Nome da marca para busca', required: false, type: 'string' }
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarMarcaPorNome(nome);
        if (!resultado.length) {
            throw new AppError('Marca com esse nome não encontrada', 404, 'MARCA_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarMarca();
        res.status(200).json(resultado);
    }
});

routerMarca.get('/:id', async (req, res) => {
    // #swagger.tags = ['Marca']
    // #swagger.description = 'Lista uma marca pelo ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID da marca', required: true, type: 'integer' }
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarMarcaPorId(id);
        if (!resultado.length) {
            throw new AppError('Marca não encontrada', 404, 'MARCA_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarMarca();
        res.status(200).json(resultado);
    }
});

routerMarca.delete('/:id', async (req, res) => {
    // #swagger.tags = ['Marca']
    // #swagger.description = 'Deleta uma marca pelo ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID da marca', required: true, type: 'integer' }
    const { id } = req.params;
    try {
        const resultado = await deletarMarca(id);
        if (resultado.affectedRows === 0) {
            throw new AppError('Marca não encontrada', 404, 'MARCA_NOT_FOUND');
        }
        res.status(200).send("Marca deletada com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }

});

export default routerMarca;