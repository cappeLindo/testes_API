import express from 'express';
import { apresentarMarca, apresentarMarcaPorId, apresentarMarcaPorNome } from '../servicos/marca/apresentar.js';
import { adicionarMarca } from '../servicos/marca/adicionar.js';
import AppError from '../utils/AppError.js';
import { validarMarca, validarMarcaParcial } from '../validacao/validarMarca.js';
import { deletarMarca } from '../servicos/marca/deletar.js';
import { editarMarca } from '../servicos/marca/editar.js';

const routerMarca = express.Router();

/**
 * @swagger
 * tags:
 *   name: Marca
 *   description: Operações relacionadas às marcas de veículos.
 */

/**
 * @swagger
 * /marca:
 *   post:
 *     summary: Cadastra uma nova marca
 *     description: Cria uma nova marca no sistema após validar os dados informados.
 *     tags: [Marca]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Volkswagen
 *     responses:
 *       201:
 *         description: Marca cadastrada com sucesso
 *       400:
 *         description: Dados inválidos ou ausentes
 *       500:
 *         description: Erro interno do servidor
 */
routerMarca.post('/', async (req, res) => {
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

/**
 * @swagger
 * /marca:
 *   get:
 *     summary: Lista todas as marcas ou busca por nome
 *     description: Retorna uma lista com todas as marcas ou filtra pelo nome fornecido.
 *     tags: [Marca]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome da marca para busca
 *     responses:
 *       200:
 *         description: Lista de marcas retornada com sucesso
 *       404:
 *         description: Marca com esse nome não encontrada
 */
routerMarca.get('/', async (req, res) => {
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarMarcaPorNome(nome);
        if (!resultado.length) {
            res.status(404).json(resultado);
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarMarca();
        res.status(200).json(resultado);
    }
});

/**
 * @swagger
 * /marca/{id}:
 *   get:
 *     summary: Busca uma marca pelo ID
 *     description: Retorna os dados de uma marca específica pelo ID.
 *     tags: [Marca]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da marca
 *     responses:
 *       200:
 *         description: Marca encontrada com sucesso
 *       404:
 *         description: Marca não encontrada
 */
routerMarca.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarMarcaPorId(id);
        if (!resultado.length) {
            res.status(404).json(resultado);
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarMarca();
        res.status(200).json(resultado);
    }
});

/**
 * @swagger
 * /marca/{id}:
 *   put:
 *     summary: Edita uma marca
 *     description: Atualiza os dados de uma marca existente com base no ID fornecido.
 *     tags: [Marca]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da marca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Fiat
 *     responses:
 *       200:
 *         description: Marca editada com sucesso
 *       400:
 *         description: Dados inválidos ou ausentes
 *       404:
 *         description: Marca não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
routerMarca.put('/:id', async (req, res) => {
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
        throw new AppError('Erro ao editar marca', 500, 'MARCA_EDIT_ERROR', error.message);
    }
});

/**
 * @swagger
 * /marca/{id}:
 *   delete:
 *     summary: Remove uma marca
 *     description: Exclui uma marca do sistema com base no ID informado.
 *     tags: [Marca]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da marca
 *     responses:
 *       200:
 *         description: Marca deletada com sucesso
 *       404:
 *         description: Marca não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
routerMarca.delete('/:id', async (req, res) => {
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
