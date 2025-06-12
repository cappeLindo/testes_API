import express from 'express';
import {
  apresentarCategoria,
  apresentarCategoriaPorId,
  apresentarCategoriaPorNome
} from '../servicos/categoria/apresentar.js';
import { adicionarCategoria } from '../servicos/categoria/adicionar.js';
import AppError from '../utils/AppError.js';
import {
  validarCategoria,
  validarCategoriaParcial
} from '../validacao/validarCategoria.js';
import { deletarCategoria } from '../servicos/categoria/deletar.js';
import { editarCategoria } from '../servicos/categoria/editar.js';

const routerCategoria = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categoria
 *   description: Operações relacionadas às categorias de produtos ou serviços.
 */

/**
 * @swagger
 * /categoria:
 *   post:
 *     summary: Cadastra uma nova categoria
 *     description: Cria uma nova categoria no sistema, validando o nome informado.
 *     tags: [Categoria]
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
 *                 example: Eletrônicos
 *     responses:
 *       201:
 *         description: Categoria cadastrada com sucesso.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Categoria cadastrada com sucesso!
 *       400:
 *         description: Dados inválidos ou faltando.
 *       500:
 *         description: Erro interno do servidor.
 */
routerCategoria.post('/', async (req, res, next) => {
  const { nome } = req.body;
  try {
    if (!nome) {
      throw new AppError('Nome da categoria é obrigatório.', 400, 'MISSING_DATA');
    }

    const nomeValido = await validarCategoria(nome);
    if (!nomeValido.status) {
      throw new AppError('O valor informado para o nome é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
    }

    await adicionarCategoria(nome);
    return res.status(201).send("Categoria cadastrada com sucesso!");
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /categoria/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     description: Atualiza o nome de uma categoria no sistema com base no ID fornecido. Retorna erro caso o ID seja inválido ou a categoria não exista.
 *     tags: [Categoria]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID da categoria a ser atualizada.
 *         required: true
 *         schema:
 *           type: integer
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
 *                 example: Móveis
 *     responses:
 *       200:
 *         description: Categoria editada com sucesso.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Categoria editada com sucesso!
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
routerCategoria.put('/:id', async (req, res, next) => {
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
      throw new AppError('O valor informado para o nome é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
    }

    const resultado = await editarCategoria(id, nome);
    if (resultado.affectedRows === 0) {
      throw new AppError('Categoria não encontrada', 404, 'CATEGORIA_NOT_FOUND');
    }

    return res.status(200).send("Categoria editada com sucesso!");
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /categoria:
 *   get:
 *     summary: Lista todas as categorias
 *     description: Retorna todas as categorias cadastradas no sistema. Caso o parâmetro "nome" seja fornecido, filtra e retorna a categoria correspondente.
 *     tags: [Categoria]
 *     parameters:
 *       - in: query
 *         name: nome
 *         description: Nome da categoria para filtro (opcional).
 *         required: false
 *         schema:
 *           type: string
 *           example: Eletrônicos
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *       404:
 *         description: Categoria com o nome informado não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
routerCategoria.get('/', async (req, res, next) => {
  const { nome } = req.query;
  try {
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
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /categoria/{id}:
 *   get:
 *     summary: Retorna uma categoria pelo ID
 *     description: Busca e retorna os dados de uma categoria específica com base no ID fornecido.
 *     tags: [Categoria]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID da categoria a ser consultada.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
routerCategoria.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const resultado = await apresentarCategoriaPorId(id);
    if (!resultado.length) {
      throw new AppError('Categoria não encontrada', 404, 'CATEGORIA_NOT_FOUND');
    }
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /categoria/{id}:
 *   delete:
 *     summary: Deleta uma categoria
 *     description: Remove uma categoria do sistema com base no ID fornecido.
 *     tags: [Categoria]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID da categoria a ser deletada.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Categoria deletada com sucesso!
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
routerCategoria.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const resultado = await deletarCategoria(id);
    if (resultado.affectedRows === 0) {
      throw new AppError('Categoria não encontrada', 404, 'CATEGORIA_NOT_FOUND');
    }
    res.status(200).send("Categoria deletada com sucesso!");
  } catch (error) {
    next(error);
  }
});

export default routerCategoria;
