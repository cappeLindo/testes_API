import express from 'express';
import {
  apresentarAro,
  apresentarAroPorId,
  apresentarAroPorNome
} from '../servicos/aro/apresentar.js';
import { adicionarAro } from '../servicos/aro/adicionar.js';
import AppError from '../utils/AppError.js';
import {
  validarAro,
  validarAroParcial
} from '../validacao/validarAro.js';
import { deletarAro } from '../servicos/aro/deletar.js';
import { editarAro } from '../servicos/aro/editar.js';

const routerAro = express.Router();

/**
 * @swagger
 * tags:
 *   name: Aro
 *   description: Operações relacionadas aos aros de veículos.
 */

/**
 * @swagger
 * /aro:
 *   post:
 *     summary: Cadastra um novo aro
 *     description: Cria um novo aro no sistema após validar os dados informados.
 *     tags: [Aro]
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
 *                 example: 18
 *     responses:
 *       201:
 *         description: Aro cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Aro cadastrado com sucesso!
 *       400:
 *         description: Dados inválidos ou ausentes
 *       500:
 *         description: Erro interno do servidor
 */
routerAro.post('/', async (req, res, next) => {
  const { nome } = req.body;

  try {
    if (!nome) {
      throw new AppError('Nome do aro é obrigatório.', 400, 'MISSING_NAME');
    }

    const nomeValido = await validarAro(nome);

    if (!nomeValido.status) {
      throw new AppError('O nome do aro é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
    }

    await adicionarAro(nome);
    res.status(201).send("Aro cadastrado com sucesso!");
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /aro/{id}:
 *   put:
 *     summary: Edita um aro existente
 *     description: Atualiza o nome de um aro existente com base em seu ID.
 *     tags: [Aro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do aro a ser editado
 *         schema:
 *           type: integer
 *       - in: body
 *         name: aro
 *         required: true
 *         description: Novos dados do aro
 *         schema:
 *           type: object
 *           required:
 *             - nome
 *           properties:
 *             nome:
 *               type: string
 *               example: 20
 *     responses:
 *       200:
 *         description: Aro editado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Aro não encontrado
 *       500:
 *         description: Erro interno
 */
routerAro.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { nome } = req.body;

  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    if (nome === undefined) {
      throw new AppError('Nome do aro é obrigatório.', 400, 'MISSING_NAME');
    }

    const nomeValido = await validarAroParcial(nome);

    if (!nomeValido.status) {
      throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
    }

    const resultado = await editarAro(id, nome);

    if (resultado.affectedRows === 0) {
      throw new AppError('Aro não encontrado.', 404, 'ARO_NOT_FOUND');
    }

    res.status(200).send("Aro editado com sucesso!");
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /aro:
 *   get:
 *     summary: Lista todos os aros
 *     description: Retorna todos os aros cadastrados. Também pode filtrar por nome.
 *     tags: [Aro]
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         description: Nome do aro para filtro parcial
 *         schema:
 *           type: string
 *           example: 18
 *     responses:
 *       200:
 *         description: Lista de aros encontrada com sucesso
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
 *         description: Aro com o nome especificado não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerAro.get('/', async (req, res, next) => {
  const { nome } = req.query;

  try {
    if (nome) {
      const resultado = await apresentarAroPorNome(nome);
      if (!resultado.length) {
        res.status(404).json(resultado);
      }
      res.status(200).json({
        mensagem: 'Consulta feita com sucesso.',
        dados: resultado
      });
    } else {
      const resultado = await apresentarAro();
      res.status(200).json(resultado);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /aro/{id}:
 *   get:
 *     summary: Busca um aro por ID
 *     description: Retorna os dados de um aro específico com base no seu ID.
 *     tags: [Aro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do aro a ser consultado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Aro encontrado
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
 *         description: Aro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerAro.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const resultado = await apresentarAroPorId(id);
    if (!resultado.length) {
      res.status(404).json(resultado);
    }
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /aro/{id}:
 *   delete:
 *     summary: Remove um aro
 *     description: Deleta um aro existente a partir do ID.
 *     tags: [Aro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do aro a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Aro deletado com sucesso
 *       404:
 *         description: Aro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerAro.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const resultado = await deletarAro(id);
    if (resultado.affectedRows === 0) {
      throw new AppError('Aro não encontrado.', 404, 'ARO_NOT_FOUND');
    }
    res.status(200).send("Aro deletado com sucesso!");
  } catch (error) {
    next(error);
  }
});

export default routerAro;
