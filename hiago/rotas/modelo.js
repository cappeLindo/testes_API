import express from 'express';
import { apresentarModelo, apresentarModeloPorId, apresentarModeloPorNome, apresentarModeloPorIdCategoria, apresentarModeloPorIdMarca, apresentarModeloPorNomeCategoria, apresentarModeloPorNomeMarca } from '../servicos/modelo/apresentar.js';
import { adicionarModelo } from '../servicos/modelo/adicionar.js';
import AppError from '../utils/AppError.js';
import { validarModelo, validarModeloParcial } from '../validacao/validarModelo.js';
import { deletarModelo } from '../servicos/modelo/deletar.js';
import { editarModelo, editarModeloParcial } from '../servicos/modelo/editar.js';

const routerModelo = express.Router();

/**
 * @swagger
 * tags:
 *   name: Modelo
 *   description: Operações relacionadas aos modelos de veículos.
 */

/**
 * @swagger
 * /modelo:
 *   post:
 *     summary: Cadastra um novo modelo
 *     description: Cria um novo modelo no sistema após validar os dados informados.
 *     tags: [Modelo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - marca_id
 *               - categoria_id
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Civic
 *               marca_id:
 *                 type: integer
 *                 example: 1
 *               categoria_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Modelo cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Modelo cadastrado com sucesso!
 *       400:
 *         description: Dados inválidos ou ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nome, marca_id e categoria_id são obrigatórios.
 *                 code:
 *                   type: string
 *                   example: MISSING_DATA
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao cadastrar modelo.
 *                 code:
 *                   type: string
 *                   example: INTERNAL_ERROR
 */
routerModelo.post('/', async (req, res) => {
    const { nome, marca_id, categoria_id } = req.body;

    try {
        console.log(nome, marca_id, categoria_id)
        if (!nome || !marca_id || !categoria_id) {
            throw new AppError('Nome, marca_id e categoria_id são obrigatórios.', 400, 'MISSING_DATA');
        }

        const modeloValido = await validarModelo(nome, marca_id, categoria_id);

        if (!modeloValido.status) {
            throw new AppError(modeloValido.mensagem || 'Dados do modelo inválidos.', 400, 'INVALID_VALUE');
        }

        await adicionarModelo(nome, marca_id, categoria_id);

        return res.status(201).send('Modelo cadastrado com sucesso!');
    } catch (error) {
        throw new AppError('Erro ao cadastrar modelo.', 500, 'INTERNAL_ERROR', error.message);
    }
});

/**
 * @swagger
 * /modelo/{id}:
 *   put:
 *     summary: Edita um modelo existente
 *     description: Atualiza todos os dados de um modelo com base no ID fornecido.
 *     tags: [Modelo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do modelo a ser editado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - marca_id
 *               - categoria_id
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Civic
 *               marca_id:
 *                 type: integer
 *                 example: 1
 *               categoria_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Modelo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Modelo atualizado com sucesso!
 *       400:
 *         description: Dados inválidos ou ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nome, marca_id e categoria_id são obrigatórios.
 *                 code:
 *                   type: string
 *                   example: MISSING_DATA
 *       404:
 *         description: Modelo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Modelo não encontrado.
 *                 code:
 *                   type: string
 *                   example: MODELO_NOT_FOUND
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao atualizar modelo.
 *                 code:
 *                   type: string
 *                   example: MODELO_EDIT_ERROR
 */
routerModelo.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { nome, marca_id, categoria_id } = req.body;

    try {
        if (isNaN(id)) {
            throw new AppError('ID do modelo deve ser um número válido.', 400, 'INVALID_ID');
        }
        if (!nome || !marca_id || !categoria_id) {
            throw new AppError('Nome, marca_id e categoria_id são obrigatórios.', 400, 'MISSING_DATA');
        }

        const nomeValido = await validarModeloParcial(nome, marca_id, categoria_id);

        if (!nomeValido.status) {
            throw new AppError(nomeValido.mensagem || 'Dados do modelo inválidos.', 400, 'INVALID_VALUE');
        }

        const resultado = await editarModelo(id, nome, marca_id, categoria_id);

        if (resultado.affectedRows === 0) {
            throw new AppError('Modelo não encontrado.', 404, 'MODELO_NOT_FOUND');
        }

        return res.status(200).send('Modelo atualizado com sucesso!');
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Erro ao atualizar modelo.', 500, 'MODELO_EDIT_ERROR', error.message));
    }
});

/**
 * @swagger
 * /modelo/{id}:
 *   patch:
 *     summary: Edita parcialmente um modelo
 *     description: Atualiza parcialmente os dados de um modelo com base no ID fornecido.
 *     tags: [Modelo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do modelo a ser editado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Civic
 *               marca_id:
 *                 type: integer
 *                 example: 1
 *               categoria_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Modelo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Modelo atualizado com sucesso!
 *       400:
 *         description: Dados inválidos ou ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pelo menos um campo deve ser fornecido para atualização.
 *                 code:
 *                   type: string
 *                   example: MISSING_DATA
 *       404:
 *         description: Modelo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Modelo não encontrado.
 *                 code:
 *                   type: string
 *                   example: MODELO_NOT_FOUND
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao atualizar modelo.
 *                 code:
 *                   type: string
 *                   example: INTERNAL_ERROR
 */
routerModelo.patch('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { nome, marca_id, categoria_id } = req.body;

    try {
        if (isNaN(id)) {
            throw new AppError('ID do modelo deve ser um número válido.', 400, 'INVALID_ID');
        }

        const camposAtualizar = {};
        if (nome) camposAtualizar.nome = nome;
        if (marca_id) camposAtualizar.marca_id = marca_id;
        if (categoria_id) camposAtualizar.categoria_id = categoria_id;

        if (Object.keys(camposAtualizar).length === 0) {
            throw new AppError('Pelo menos um campo deve ser fornecido para atualização.', 400, 'MISSING_DATA');
        }

        const modeloValido = await validarModeloParcial(nome, marca_id, categoria_id);

        if (!modeloValido.status) {
            throw new AppError(modeloValido.mensagem || 'Dados do modelo inválidos.', 400, 'INVALID_VALUE');
        }

        const resultado = await editarModeloParcial(id, camposAtualizar);

        if (resultado.affectedRows === 0) {
            throw new AppError('Modelo não encontrado.', 404, 'MODELO_NOT_FOUND');
        }

        return res.status(200).send('Modelo atualizado com sucesso!');
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Erro ao atualizar modelo.', 500, 'INTERNAL_ERROR', error.message));
    }
});

/**
 * @swagger
 * /modelo/{id}:
 *   delete:
 *     summary: Deleta um modelo
 *     description: Remove um modelo do sistema com base no ID fornecido.
 *     tags: [Modelo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do modelo a ser deletado
 *     responses:
 *       200:
 *         description: Modelo deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Modelo deletado com sucesso!
 *       404:
 *         description: Modelo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Modelo não encontrado.
 *                 code:
 *                   type: string
 *                   example: MODELO_NOT_FOUND
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao deletar modelo.
 *                 code:
 *                   type: string
 *                   example: INTERNAL_ERROR
 */
routerModelo.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            throw new AppError('ID do modelo deve ser um número válido.', 400, 'INVALID_ID');
        }

        const resultado = await deletarModelo(id);

        if (resultado.affectedRows === 0) {
            throw new AppError('Modelo não encontrado.', 404, 'MODELO_NOT_FOUND');
        }

        return res.status(200).send('Modelo deletado com sucesso!');
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Erro ao deletar modelo.', 500, 'INTERNAL_ERROR', error.message));
    }
});

/**
 * @swagger
 * /modelo:
 *   get:
 *     summary: Lista modelos
 *     description: Retorna todos os modelos ou filtra por nome, se fornecido.
 *     tags: [Modelo]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome do modelo para filtrar (opcional)
 *     responses:
 *       200:
 *         description: Lista de modelos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: Civic
 *                   marca_id:
 *                     type: integer
 *                     example: 1
 *                   categoria_id:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: Nenhum modelo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nenhum modelo encontrado com o nome fornecido.
 *                 code:
 *                   type: string
 *                   example: MODELO_NOT_FOUND
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao listar modelos.
 *                 code:
 *                   type: string
 *                   example: INTERNAL_ERROR
 */
routerModelo.get('/', async (req, res, next) => {
    const { nome } = req.query;

    try {
        const resultado = nome ? await apresentarModeloPorNome(nome) : await apresentarModelo();

        if (nome && !resultado.length) {
            res.status(404).json(resultado);
        }

        return res.status(200).json(resultado);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Erro ao listar modelos.', 500, 'INTERNAL_ERROR', error.message));
    }
});

/**
 * @swagger
 * /modelo/{id}:
 *   get:
 *     summary: Obtém um modelo por ID
 *     description: Retorna os detalhes de um modelo com base no ID fornecido.
 *     tags: [Modelo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do modelo
 *     responses:
 *       200:
 *         description: Modelo retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: Civic
 *                   marca_id:
 *                     type: integer
 *                     example: 1
 *                   categoria_id:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: Modelo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Modelo não encontrado.
 *                 code:
 *                   type: string
 *                   example: MODELO_NOT_FOUND
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao obter modelo.
 *                 code:
 *                   type: string
 *                   example: INTERNAL_ERROR
 */
routerModelo.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            throw new AppError('ID do modelo deve ser um número válido.', 400, 'INVALID_ID');
        }

        const resultado = await apresentarModeloPorId(id);

        if (!resultado.length) {
            res.status(404).json(resultado);
        }

        return res.status(200).json(resultado);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Erro ao obter modelo.', 500, 'INTERNAL_ERROR', error.message));
    }
});

/**
 * @swagger
 * /modelo/marca:
 *   get:
 *     summary: Lista modelos por marca
 *     description: Retorna todos os modelos ou filtra por nome da marca, se fornecido.
 *     tags: [Modelo]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome da marca para filtrar (opcional)
 *     responses:
 *       200:
 *         description: Lista de modelos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: Civic
 *                   marca_id:
 *                     type: integer
 *                     example: 1
 *                   categoria_id:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: Nenhum modelo encontrado para a marca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nenhum modelo encontrado para a marca fornecida.
 *                 code:
 *                   type: string
 *                   example: MODELO_MARCA_NOT_FOUND
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao listar modelos por marca.
 *                 code:
 *                   type: string
 *                   example: INTERNAL_ERROR
 */
routerModelo.get('/marca', async (req, res, next) => {
    const { nome } = req.query;

    try {
        const resultado = nome ? await apresentarModeloPorNomeMarca(nome) : await apresentarModelo();

        if (nome && !resultado.length) {
            throw new AppError('Nenhum modelo encontrado para a marca fornecida.', 404, 'MODELO_MARCA_NOT_FOUND');
        }

        return res.status(200).json(resultado);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Erro ao listar modelos por marca.', 500, 'INTERNAL_ERROR', error.message));
    }
});

/**
 * @swagger
 * /modelo/marca/{id}:
 *   get:
 *     summary: Lista modelos por ID da marca
 *     description: Retorna modelos associados ao ID da marca fornecido.
 *     tags: [Modelo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da marca
 *     responses:
 *       200:
 *         description: Lista de modelos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: Civic
 *                   marca_id:
 *                     type: integer
 *                     example: 1
 *                   categoria_id:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: Nenhum modelo encontrado para a marca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nenhum modelo encontrado para a marca fornecida.
 *                 code:
 *                   type: string
 *                   example: MODELO_MARCA_NOT_FOUND
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao listar modelos por marca.
 *                 code:
 *                   type: string
 *                   example: INTERNAL_ERROR
 */
routerModelo.get('/marca/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            throw new AppError('ID da marca deve ser um número válido.', 400, 'INVALID_ID');
        }

        const resultado = await apresentarModeloPorIdMarca(id);

        if (!resultado.length) {
            throw new AppError('Nenhum modelo encontrado para a marca fornecida.', 404, 'MODELO_MARCA_NOT_FOUND');
        }

        return res.status(200).json(resultado);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Erro ao listar modelos por marca.', 500, 'INTERNAL_ERROR', error.message));
    }
});

/**
 * @swagger
 * /modelo/categoria:
 *   get:
 *     summary: Lista modelos por categoria
 *     description: Retorna todos os modelos ou filtra por nome da categoria, se fornecido.
 *     tags: [Modelo]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome da categoria para filtrar (opcional)
 *     responses:
 *       200:
 *         description: Lista de modelos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: Civic
 *                   marca_id:
 *                     type: integer
 *                     example: 1
 *                   categoria_id:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: Nenhum modelo encontrado para a categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nenhum modelo encontrado para a categoria fornecida.
 *                 code:
 *                   type: string
 *                   example: MODELO_CATEGORIA_NOT_FOUND
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao listar modelos por categoria.
 *                 code:
 *                   type: string
 *                   example: INTERNAL_ERROR
 */
routerModelo.get('/categoria', async (req, res, next) => {
    const { nome } = req.query;

    try {
        const resultado = nome ? await apresentarModeloPorNomeCategoria(nome) : await apresentarModelo();

        if (nome && !resultado.length) {
            throw new AppError('Nenhum modelo encontrado para a categoria fornecida.', 404, 'MODELO_CATEGORIA_NOT_FOUND');
        }

        return res.status(200).json(resultado);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Erro ao listar modelos por categoria.', 500, 'INTERNAL_ERROR', error.message));
    }
});

/**
 * @swagger
 * /modelo/categoria/{id}:
 *   get:
 *     summary: Lista modelos por ID da categoria
 *     description: Retorna modelos associados ao ID da categoria fornecido.
 *     tags: [Modelo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Lista de modelos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: Civic
 *                   marca_id:
 *                     type: integer
 *                     example: 1
 *                   categoria_id:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: Nenhum modelo encontrado para a categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nenhum modelo encontrado para a categoria fornecida.
 *                 code:
 *                   type: string
 *                   example: MODELO_CATEGORIA_NOT_FOUND
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao listar modelos por categoria.
 *                 code:
 *                   type: string
 *                   example: INTERNAL_ERROR
 */
routerModelo.get('/categoria/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            throw new AppError('ID da categoria deve ser um número válido.', 400, 'INVALID_ID');
        }

        const resultado = await apresentarModeloPorIdCategoria(id);

        if (!resultado.length) {
            throw new AppError('Nenhum modelo encontrado para a categoria fornecida.', 404, 'MODELO_CATEGORIA_NOT_FOUND');
        }

        return res.status(200).json(resultado);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Erro ao listar modelos por categoria.', 500, 'INTERNAL_ERROR', error.message));
    }
});

export default routerModelo;