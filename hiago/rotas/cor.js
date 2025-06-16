import express from 'express';
import {
  apresentarCor,
  apresentarCorPorId,
  apresentarCorPorNome
} from '../servicos/cor/apresentar.js';
import { adicionarCor } from '../servicos/cor/adicionar.js';
import AppError from '../utils/AppError.js';
import {
  validarCor,
  validarCorParcial
} from '../validacao/validarCor.js';
import { deletarCor } from '../servicos/cor/deletar.js';
import { editarCor } from '../servicos/cor/editar.js';

const routerCor = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cor
 *   description: Operações relacionadas às cores de veículos.
 */

/**
 * @swagger
 * /cor:
 *   post:
 *     summary: Cadastra uma nova cor
 *     description: Cria uma nova cor no sistema após validar os dados informados.
 *     tags: [Cor]
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
 *                 example: Prata
 *     responses:
 *       201:
 *         description: Cor cadastrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Cor cadastrada com sucesso!
 *       400:
 *         description: Dados inválidos ou ausentes
 *       500:
 *         description: Erro interno do servidor
 */
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
    return res.status(201).send('Cor cadastrada com sucesso!');
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
  }
});

/**
 * @swagger
 * /cor/{id}:
 *   put:
 *     summary: Edita uma cor existente
 *     description: Edita os dados de uma cor já cadastrada pelo ID.
 *     tags: [Cor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cor
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
 *                 example: Azul
 *     responses:
 *       200:
 *         description: Cor editada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Cor editada com sucesso!
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cor não encontrada
 *       500:
 *         description: Erro ao editar cor
 */
routerCor.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    if (isNaN(id)) throw new AppError('ID inválido', 400, 'INVALID_ID');
    if (nome === undefined) throw new AppError('Nome da cor é obrigatório', 400, 'MISSING_NAME');

    const nomeValido = await validarCorParcial(nome);
    if (!nomeValido.status) {
      throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
    }

    const resultado = await editarCor(id, nome);
    if (resultado.affectedRows === 0) {
      throw new AppError('Cor não encontrada', 404, 'COR_NOT_FOUND');
    }

    return res.status(200).send('Cor editada com sucesso!');
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Erro ao editar cor', 500, 'COR_EDIT_ERROR', error.message);
  }
});

/**
 * @swagger
 * /cor:
 *   get:
 *     summary: Lista todas as cores
 *     description: Retorna todas as cores cadastradas ou filtra por nome.
 *     tags: [Cor]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         required: false
 *         description: Nome da cor para busca
 *     responses:
 *       200:
 *         description: Lista de cores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 3
 *                   nome:
 *                     type: string
 *                     example: Vermelho
 *       404:
 *         description: Cor com esse nome não encontrada
 */
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

/**
 * @swagger
 * /cor/{id}:
 *   get:
 *     summary: Busca uma cor por ID
 *     description: Retorna os dados de uma cor específica pelo seu ID.
 *     tags: [Cor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cor
 *     responses:
 *       200:
 *         description: Cor encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: Preto
 *       404:
 *         description: Cor não encontrada
 */
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

/**
 * @swagger
 * /cor/{id}:
 *   delete:
 *     summary: Deleta uma cor
 *     description: Remove uma cor do sistema com base no seu ID.
 *     tags: [Cor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cor
 *     responses:
 *       200:
 *         description: Cor deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Cor deletada com sucesso!
 *       404:
 *         description: Cor não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
routerCor.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await deletarCor(id);
    if (resultado.affectedRows === 0) {
      throw new AppError('Cor não encontrada', 404, 'COR_NOT_FOUND');
    }
    res.status(200).send('Cor deletada com sucesso!');
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
  }
});

export default routerCor;
