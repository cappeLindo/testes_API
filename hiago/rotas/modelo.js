import express from 'express';
import { apresentarModelo, apresentarModeloPorId, apresentarModeloPorNome, apresentarModeloPorIdCategoria, apresentarModeloPorIdMarca, apresentarModeloPorNomeCategoria, apresentarModeloPorNomeMarca } from '../servicos/modelo/apresentar.js';
import { adicionarModelo } from '../servicos/modelo/adicionar.js';
import AppError from '../utils/AppError.js';
import {  validarModelo, validarModeloParcial } from '../validacao/validarModelo.js';
import { deletarModelo } from '../servicos/modelo/deletar.js';
import { editarModeloParcial, editarModelo } from '../servicos/modelo/editar.js';

const routerModelo = express.Router();

routerModelo.put('/:id', async (req, res) => {
    // #swagger.tags = ['Modelo']
    // #swagger.description = 'Edita um modelo pelo ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID do modelo', required: true, type: 'integer' }
    // #swagger.parameters['modelo'] = { in: 'body', description: 'Dados do modelo', required: true, schema: { $ref: '#/definitions/Modelo' } }

    const { id } = req.params;
    const { nome, id_marca, id_categoria } = req.body;
    try {
        if (isNaN(id) || !nome || !id_marca || !id_categoria) {
            throw new AppError('ID inválido', 400, 'INVALID_ID');
        }
    
        if (nome === undefined) {
            throw new AppError('Nome do modelo é obrigatório', 400, 'MISSING_NAME');
        }
    
        const nomeValido = await validarModeloParcial(nome, id_marca, id_categoria);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        const resultado = await editarModelo(id, nome, id_marca, id_categoria);

        if (resultado.affectedRows === 0) {
            throw new AppError('Marca não encontrada', 404, 'MODELO_NOT_FOUND');
        }

        return res.status(200).send("Modelo editado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        // Aqui você pode usar next(error) se tiver um middleware global de tratamento de erros
        throw new AppError('Erro ao editar modelo', 500, 'MODELO_EDIT_ERROR', error.message);
    }
});

routerModelo.patch('/:id', async (req, res) => {
    // #swagger.tags = ['Modelo']
    // #swagger.description = 'Edita parcialmente um modelo pelo ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID do modelo', required: true, type: 'integer' }
    // #swagger.parameters['modelo'] = { in: 'body', description: 'Dados do modelo', required: true, schema: { $ref: '#/definitions/Modelo' } }
    
    try {
        const { id } = req.params;
        const { nome, id_marca, id_categoria } = req.body;
        const camposAtualizar = {};
        if (nome) camposAtualizar.nome_modelo = nome;
        if (id_marca) camposAtualizar.marca_id_marca = id_marca;
        if (id_categoria) camposAtualizar.categoria_id_categoria = id_categoria;

        if (Object.keys(camposAtualizar).length === 0) {
            throw new AppError('O valor é inválido.', 400, 'MISSING_DATA');
        }

        const modeloValido = await validarModeloParcial(nome, id_marca, id_categoria)

        if (!modeloValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', modeloValido.mensagem);
        }

        const resultado = await editarModeloParcial(id, camposAtualizar)
        if (resultado.affectedRows > 0) {
            return res.status(200).send("Registro atualizado com sucesso.")
        } else {
            throw new AppError('MODELO não encontrado', 404, 'MODELO_NOT_FOUND');
        }
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }
});


routerModelo.post('/', async (req, res) => {
    // #swagger.tags = ['Modelo']
    // #swagger.description = 'Cadastra um modelo'
    // #swagger.parameters['modelo'] = { in: 'body', description: 'Dados do modelo', required: true, schema: { $ref: '#/definitions/Modelo' } }

    const { nome, id_marca, id_categoria } = req.body;

    try {
        if (!nome || !id_marca || !id_categoria) {  
            throw new AppError('Nome e valor da modelo é obrigatório.', 400, 'MISSING_DATA');
        }
        
        const modeloValido = await validarModelo(nome, id_marca, id_categoria);

        if (!modeloValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', modeloValido.mensagem);
        }

        await adicionarModelo(nome, id_marca, id_categoria);

        return res.status(201).send("Modelo cadastrado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }
});


routerModelo.delete('/:id', async (req, res) => {
    // #swagger.tags = ['Modelo']
    // #swagger.description = 'Deleta um modelo pelo ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID do modelo', required: true, type: 'integer' }

    const { id } = req.params;
    try {
        const resultado = await deletarModelo(id);
        if (resultado.affectedRows === 0) {
            throw new AppError('MODELO não encontrado', 404, 'MODELO_NOT_FOUND');
        }
        res.status(200).send("MODELO deletado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }

});


routerModelo.get('/', async (req, res) => {
    // #swagger.tags = ['Modelo']
    // #swagger.description = 'Lista todos os modelos ou busca por nome'
    // #swagger.parameters['nome'] = { in: 'query', description: 'Nome do modelo', required: false, type: 'string' }
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarModeloPorNome(nome);
        if (!resultado.length) {
            throw new AppError('Modelo com esse nome não encontrado', 404, 'MODELO_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});

routerModelo.get('/:id', async (req, res) => {
    // #swagger.tags = ['Modelo']
    // #swagger.description = 'Lista um modelo pelo ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID do modelo', required: true, type: 'integer' }

    const { id } = req.params;
    if (id) {
        const resultado = await apresentarModeloPorId(id);
        if (!resultado.length) {
            throw new AppError('Modelo não encontrado', 404, 'MODELO_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});

routerModelo.get('/marca/', async (req, res) => {
    // #swagger.tags = ['Modelo']
    // #swagger.description = 'Lista todos os modelos ou busca por nome da marca'
    // #swagger.parameters['nome'] = { in: 'query', description: 'Nome da marca', required: false, type: 'string' }
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarModeloPorNomeMarca(nome);
        if (!resultado.length) {
            throw new AppError('Modelo com a marca com esse nome não encontrado', 404, 'MODELO_MARCA_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});

routerModelo.get('/marca/:id', async (req, res) => {
    // #swagger.tags = ['Modelo']
    // #swagger.description = 'Lista um modelo pelo ID da marca'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID da marca', required: true, type: 'integer' }
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarModeloPorIdMarca(id);
        if (!resultado.length) {
            throw new AppError('Modelo com essa marca não encontrado', 404, 'MODELO_MARCA_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});

routerModelo.get('/categoria/', async (req, res) => {
    // #swagger.tags = ['Modelo']
    // #swagger.description = 'Lista todos os modelos ou busca por nome da categoria'
    // #swagger.parameters['nome'] = { in: 'query', description: 'Nome da categoria', required: false, type: 'string' }
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarModeloPorNomeCategoria(nome);
        if (!resultado.length) {
            throw new AppError('Modelo com essa categoria com esse nome não encontrado', 404, 'MODELO_CATEGORIA_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});

routerModelo.get('/categoria/:id', async (req, res) => {
    // #swagger.tags = ['Modelo']
    // #swagger.description = 'Lista um modelo pelo ID da categoria'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID da categoria', required: true, type: 'integer' }
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarModeloPorIdCategoria(id);
        if (!resultado.length) {
            throw new AppError('Modelo com essa categoria não encontrado', 404, 'MODELO_CATEGORIA_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});



export default routerModelo;