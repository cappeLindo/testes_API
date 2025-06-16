import express from 'express';
import {
  apresentarCombustivel,
  apresentarCombustivelPorId,
  apresentarCombustivelPorNome
} from '../servicos/combustivel/apresentar.js';
import { adicionarCombustivel } from '../servicos/combustivel/adicionar.js';
import AppError from '../utils/AppError.js';
import {
  validarCombustivel,
  validarCombustivelParcial
} from '../validacao/validarCombustivel.js';
import { deletarCombustivel } from '../servicos/combustivel/deletar.js';
import { editarCombustivel } from '../servicos/combustivel/editar.js';

const routerCombustivel = express.Router();

/**
 * @swagger
 * tags:
 *   name: Combustível
 *   description: Operações relacionadas aos tipos de combustíveis.
 */

/**
 * @swagger
 * /combustivel:
 *   post:
 *     summary: Cadastra um novo combustível
 *     description: Cria um novo combustível no sistema após validar os dados informados.
 *     tags: [Combustível]
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
 *                 example: Gasolina
 *     responses:
 *       201:
 *         description: Combustível cadastrado com sucesso
 *       400:
 *         description: Dados inválidos ou ausentes
 *       500:
 *         description: Erro interno do servidor
 */
routerCombustivel.post('/', async (req, res) => {
  const { nome } = req.body;
  try {
    if (!nome) {
      throw new AppError('Nome do combustível é obrigatório.', 400, 'MISSING_DATA');
    }

    const nomeValido = await validarCombustivel(nome);
    if (!nomeValido.status) {
      throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
    }

    await adicionarCombustivel(nome);
    return res.status(201).send("Combustível cadastrado com sucesso!");
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
  }
});

/**
 * @swagger
 * /combustivel:
 *   get:
 *     summary: Lista os combustíveis
 *     description: Retorna todos os combustíveis ou filtra por nome.
 *     tags: [Combustível]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome do combustível a ser buscado (opcional)
 *     responses:
 *       200:
 *         description: Lista de combustíveis retornada com sucesso
 *       404:
 *         description: Nenhum combustível encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerCombustivel.get('/', async (req, res) => {
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

/**
 * @swagger
 * /combustivel/{id}:
 *   get:
 *     summary: Consulta um combustível pelo ID
 *     description: Retorna os dados de um combustível específico.
 *     tags: [Combustível]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do combustível
 *     responses:
 *       200:
 *         description: Combustível encontrado
 *       404:
 *         description: Combustível não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerCombustivel.get('/:id', async (req, res) => {
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

/**
 * @swagger
 * /combustivel/{id}:
 *   put:
 *     summary: Edita um combustível
 *     description: Atualiza os dados de um combustível específico pelo ID.
 *     tags: [Combustível]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do combustível
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
 *                 example: Etanol
 *     responses:
 *       200:
 *         description: Combustível editado com sucesso
 *       400:
 *         description: Dados inválidos ou ausentes
 *       404:
 *         description: Combustível não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerCombustivel.put('/:id', async (req, res) => {
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
    if (error instanceof AppError) throw error;
    throw new AppError('Erro ao editar combustível', 500, 'COMBUSTIVEL_EDIT_ERROR', error.message);
  }
});

/**
 * @swagger
 * /combustivel/{id}:
 *   delete:
 *     summary: Deleta um combustível
 *     description: Remove um combustível específico pelo ID.
 *     tags: [Combustível]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do combustível
 *     responses:
 *       200:
 *         description: Combustível deletado com sucesso
 *       404:
 *         description: Combustível não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerCombustivel.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await deletarCombustivel(id);
    if (resultado.affectedRows === 0) {
      throw new AppError('Combustível não encontrado', 404, 'COMBUSTIVEL_NOT_FOUND');
    }
    res.status(200).send("Combustível deletado com sucesso!");
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
  }
});

export default routerCombustivel;
