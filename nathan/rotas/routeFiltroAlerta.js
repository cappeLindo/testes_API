import express from 'express';
import AppError from '../utils/AppError.js';
import { validarFiltroAlerta } from '../validacao/validarFiltroAlerta.js';
import {
  apresentarFiltroAlerta,
  apresentarFiltroAlertaPorID,
  apresentarFiltroAlertaPorNome,
  apresentarFiltroAlertaPorIDcleinte
} from '../servicos/filtroAlerta/apresentar.js';
import { adicionarFiltroAlerta } from '../servicos/filtroAlerta/adicionar.js';
import { editarFiltroAlerta } from '../servicos/filtroAlerta/editar.js';
import { deletarFiltroAlerta } from '../servicos/filtroAlerta/deletar.js';

const routerFiltroAlerta = express.Router();

/**
 * @swagger
 * tags:
 *   name: FiltroAlerta
 *   description: Operações relacionadas aos filtros de alerta dos clientes.
 */

/**
 * @swagger
 * /filtroAlerta:
 *   get:
 *     summary: Lista todos os filtros de alerta
 *     description: Retorna todos os filtros cadastrados ou filtra por nome.
 *     tags: [FiltroAlerta]
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         schema:
 *           type: string
 *         description: Nome parcial para filtro
 *     responses:
 *       200:
 *         description: Filtros retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FiltroAlerta'
 *       500:
 *         description: Erro ao buscar filtros
 */
routerFiltroAlerta.get('/', async (req, res, next) => {
  const { nome } = req.query;
  try {
    const resultado = nome
      ? await apresentarFiltroAlertaPorNome(nome)
      : await apresentarFiltroAlerta();
    res.status(200).json(resultado);
  } catch (error) {
    next(new AppError('Erro ao buscar filtros', 500));
  }
});

/**
 * @swagger
 * /filtroAlerta/{id}:
 *   get:
 *     summary: Busca filtro de alerta por ID
 *     description: Retorna detalhes de um filtro específico por seu ID.
 *     tags: [FiltroAlerta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filtro de alerta
 *     responses:
 *       200:
 *         description: Filtro encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FiltroAlerta'
 *       404:
 *         description: Filtro não encontrado
 */
routerFiltroAlerta.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const resultado = await apresentarFiltroAlertaPorID(id);
    if (!resultado.length) {
      throw new AppError('Filtro não encontrado', 404);
    }
    res.status(200).json(resultado[0]);
  } catch (error) {
    next(new AppError('Filtro não encontrado', 404));
  }
});

/**
 * @swagger
 * /filtroAlerta/cliente/{id}:
 *   get:
 *     summary: Busca filtros de alerta por cliente
 *     description: Retorna todos os filtros associados a um cliente específico.
 *     tags: [FiltroAlerta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Filtros de alerta retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FiltroAlerta'
 *       404:
 *         description: Filtros não encontrados para esse cliente
 */
routerFiltroAlerta.get('/cliente/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const resultado = await apresentarFiltroAlertaPorIDcleinte(id);
    res.status(200).json(resultado);
  } catch (error) {
    next(new AppError('Filtro não encontrado', 404));
  }
});

/**
 * @swagger
 * /filtroAlerta:
 *   post:
 *     summary: Cria um novo filtro de alerta
 *     description: Adiciona um novo filtro com os dados fornecidos pelo cliente.
 *     tags: [FiltroAlerta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente_id
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: alerta_valor
 *               cliente_id:
 *                 type: integer
 *                 example: 42
 *               ano:
 *                 type: integer
 *               condicao:
 *                 type: string
 *               ipva_pago:
 *                 type: boolean
 *               blindagem:
 *                 type: boolean
 *               valor_maximo:
 *                 type: number
 *               valor_minimo:
 *                 type: number
 *     responses:
 *       201:
 *         description: Filtro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
routerFiltroAlerta.post('/', async (req, res, next) => {
  try {
    const validacao = await validarFiltroAlerta(req.body);
    if (!validacao.status) throw new AppError(validacao.mensagem, 400);
    const resultado = await adicionarFiltroAlerta(req.body);
    res.status(201).json({ id: resultado.insertId });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /filtroAlerta/{id}:
 *   put:
 *     summary: Atualiza um filtro de alerta
 *     description: Substitui os dados do filtro existente com base no ID.
 *     tags: [FiltroAlerta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filtro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               ano:
 *                 type: integer
 *               condicao:
 *                 type: string
 *               ipva_pago:
 *                 type: boolean
 *               blindagem:
 *                 type: boolean
 *               valor_maximo:
 *                 type: number
 *               valor_minimo:
 *                 type: number
 *     responses:
 *       200:
 *         description: Filtro atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */
routerFiltroAlerta.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const validacao = await validarFiltroAlerta(req.body);
    if (!validacao.status) throw new AppError(validacao.mensagem, 400);
    await editarFiltroAlerta(id, req.body);
    res.status(200).json({ mensagem: 'Atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /filtroAlerta/{id}:
 *   delete:
 *     summary: Remove um filtro de alerta
 *     description: Exclui um filtro pelo seu ID.
 *     tags: [FiltroAlerta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filtro
 *     responses:
 *       200:
 *         description: Filtro removido com sucesso
 *       404:
 *         description: Filtro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerFiltroAlerta.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await deletarFiltroAlerta(id);
    res.status(200).json({ mensagem: 'Deletado com sucesso' });
  } catch (error) {
    next(error);
  }
});

export default routerFiltroAlerta;
