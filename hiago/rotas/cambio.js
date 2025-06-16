import express from 'express';
import {
  apresentarCambio,
  apresentarCambioPorId,
  apresentarCambioPorNome
} from '../servicos/cambio/apresentar.js';
import { adicionarCambio } from '../servicos/cambio/adicionar.js';
import AppError from '../utils/AppError.js';
import {
  validarCambio,
  validarCambioParcial
} from '../validacao/validarCambio.js';
import { deletarCambio } from '../servicos/cambio/deletar.js';
import { editarCambio } from '../servicos/cambio/editar.js';

const routerCambio = express.Router();

/**
 * @swagger
 * tags:
 *   name: Câmbio
 *   description: Operações relacionadas aos tipos de câmbio de veículos
 */

/**
 * @swagger
 * /cambio:
 *   post:
 *     summary: Cadastra um câmbio
 *     tags: [Câmbio]
 *     description: Cria um novo tipo de câmbio no sistema.
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
 *                 example: Automático
 *     responses:
 *       201:
 *         description: Câmbio cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */
routerCambio.post('/', async (req, res) => {
  const { nome } = req.body;

  try {
    if (!nome) {
      throw new AppError('Nome do câmbio é obrigatório.', 400, 'MISSING_NAME');
    }

    const nomeValido = await validarCambio(nome);

    if (!nomeValido.status) {
      throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
    }

    await adicionarCambio(nome);

    return res.status(201).send("Câmbio cadastrado com sucesso!");
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
  }
});

/**
 * @swagger
 * /cambio/{id}:
 *   put:
 *     summary: Edita um câmbio
 *     tags: [Câmbio]
 *     description: Edita os dados de um câmbio com base no seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do câmbio
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Manual
 *     responses:
 *       200:
 *         description: Câmbio editado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Câmbio não encontrado
 *       500:
 *         description: Erro interno
 */
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

    const nomeValido = await validarCambioParcial(nome);

    if (!nomeValido.status) {
      throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
    }

    const resultado = await editarCambio(id, nome);

    if (resultado.affectedRows === 0) {
      throw new AppError('Câmbio não encontrado', 404, 'CAMBIO_NOT_FOUND');
    }

    return res.status(200).send("Câmbio editado com sucesso!");
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError('Erro ao editar câmbio', 500, 'CAMBIO_EDIT_ERROR', error.message);
  }
});

/**
 * @swagger
 * /cambio:
 *   get:
 *     summary: Lista todos os câmbios
 *     tags: [Câmbio]
 *     description: Retorna todos os câmbios cadastrados ou filtra pelo nome caso seja informado.
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         description: Nome do câmbio para filtro
 *         schema:
 *           type: string
 *           example: Automático
 *     responses:
 *       200:
 *         description: Lista de câmbios retornada com sucesso
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
 *         description: Nenhum câmbio encontrado com esse nome
 */
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

/**
 * @swagger
 * /cambio/{id}:
 *   get:
 *     summary: Lista um câmbio pelo ID
 *     tags: [Câmbio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do câmbio a ser buscado
 *     responses:
 *       200:
 *         description: Câmbio encontrado
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
 *         description: Câmbio não encontrado
 */
routerCambio.get('/:id', async (req, res) => {
  const { id } = req.params;

  const resultado = await apresentarCambioPorId(id);
  if (!resultado.length) {
    throw new AppError('Câmbio não encontrado', 404, 'CAMBIO_NOT_FOUND');
  }
  res.status(200).json(resultado);
});

/**
 * @swagger
 * /cambio/{id}:
 *   delete:
 *     summary: Deleta um câmbio
 *     tags: [Câmbio]
 *     description: Remove um câmbio específico pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do câmbio a ser deletado
 *     responses:
 *       200:
 *         description: Câmbio deletado com sucesso
 *       404:
 *         description: Câmbio não encontrado
 *       500:
 *         description: Erro interno
 */
routerCambio.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await deletarCambio(id);
    if (resultado.affectedRows === 0) {
      throw new AppError('Câmbio não encontrado', 404, 'CAMBIO_NOT_FOUND');
    }
    res.status(200).send("Câmbio deletado com sucesso!");
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
  }
});

export default routerCambio;
