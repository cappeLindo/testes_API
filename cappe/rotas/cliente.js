import express from 'express';
import upload from '../../middlewares/multerConfig.js';
import adicionarCliente from '../servico/cliente/adicionar.js';
import { apresentarCliente, apresentarClientePorEmail } from '../servico/cliente/apresentar.js';
import {editarCliente, editarClienteParcial} from '../servico/cliente/editar.js';
import deletarCliente from '../servico/cliente/deletar.js';
import validarCliente from '../validacao/cliente.js';
import AppError from '../utils/appError.js';

const routerCliente = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cliente
 *   description: Endpoints para gerenciamento de clientes
 */

/**
 * @swagger
 * /cliente:
 *   post:
 *     summary: Cadastra um novo cliente
 *     tags: [Cliente]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       201:
 *         description: Cliente cadastrado com sucesso
 *       500:
 *         description: Erro no servidor
 */
routerCliente.post('/', validarCliente, upload.single('imagem'), async (req, res, next) => {
  const { nome, cpf, email, telefone } = req.body;
  const imagem = req.file ? req.file.buffer : null;
  try {
    const resultado = await adicionarCliente(nome, cpf, email, telefone, imagem);
    res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});

/**
 * @swagger
 * /cliente:
 *   get:
 *     summary: Retorna todos os clientes ou por e-mail
 *     tags: [Cliente]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: E-mail do cliente para filtro
 *     responses:
 *       200:
 *         description: Lista de clientes obtida com sucesso
 *       500:
 *         description: Erro no servidor
 */
routerCliente.get('/', async (req, res, next) => {
  const { email } = req.query;
  try {
    const clientes = email !== undefined ? await apresentarClientePorEmail(email) : await apresentarCliente();
    res.status(200).json({
      mensagem: 'Lista de clientes obtida com sucesso',
      dados: clientes
    });
  } catch (erro) {
    next(erro);
  }
});

/**
 * @swagger
 * /cliente/{id}:
 *   get:
 *     summary: Retorna um cliente pelo ID
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro no servidor
 */
routerCliente.get('/:id', async (req, res, next) => {
  try {
    const cliente = await apresentarCliente(req.params.id);

    if (!cliente || cliente.length === 0) {
      throw new AppError('Cliente não encontrado.', 404, 'CLIENTE_NAO_ENCONTRADO');
    }

    res.status(200).json({
      mensagem: 'Cliente encontrado com sucesso',
      dados: cliente[0]
    });
  } catch (erro) {
    next(erro);
  }
});

/**
 * @swagger
 * /cliente/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Cliente'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado para atualizar
 *       500:
 *         description: Erro no servidor
 */
routerCliente.put('/:id', validarCliente, upload.single('imagem'), async (req, res, next) => {
  const { id } = req.user;
  const { nome, cpf, email, telefone } = req.body;
  const imagem = req.file ? req.file.buffer : null;
  try {
    const resultado = await editarCliente(id, nome, cpf, email, telefone, imagem);

    if (!resultado || resultado.affectedRows === 0) {
      throw new AppError('Cliente não encontrado para atualizar.', 404, 'CLIENTE_NAO_ENCONTRADO');
    }

    res.status(200).json({
      mensagem: 'Cliente atualizado com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});

routerCliente.patch('/:id', validarCliente, upload.single('imagem'), async (req, res, next) => {
  const { id } = req.user;
  const { nome, cpf, email, telefone } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  try {
    const camposAtualizar = {};
    if (nome) camposAtualizar.nome = nome;
    if (cpf) camposAtualizar.cpf = cpf;
    if (email) camposAtualizar.email = email;
    if (telefone) camposAtualizar.telefone = telefone;
    if (imagem) camposAtualizar.imagem = imagem;

    if (Object.keys(camposAtualizar).length === 0) {
      throw new AppError('Nada para atualizar.', 400, 'NO_UPDATE_DATA');
    }

    const resultado = await editarClienteParcial(id, nome, cpf, email, telefone, imagem);

    if (!resultado || resultado.affectedRows === 0) {
      throw new AppError('Cliente não encontrado para atualizar.', 404, 'CLIENTE_NAO_ENCONTRADO');
    }

    res.status(200).json({
      mensagem: 'Cliente atualizado com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});

/**
 * @swagger
 * /cliente/{id}:
 *   delete:
 *     summary: Remove um cliente pelo ID
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente deletado com sucesso
 *       404:
 *         description: Cliente não encontrado para exclusão
 *       500:
 *         description: Erro no servidor
 */
routerCliente.delete('/:id', async (req, res, next) => {
  const { id } = req.user;
  try {
    const resultado = await deletarCliente(id);

    if (!resultado || resultado.affectedRows === 0) {
      throw new AppError('Cliente não encontrado para exclusão.', 404, 'CLIENTE_NAO_ENCONTRADO');
    }

    res.status(200).json({
      mensagem: 'Cliente deletado com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});

export default routerCliente;
