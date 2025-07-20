import express from 'express';
import upload from '../../middlewares/multerConfig.js';
import adicionarCliente from '../servico/cliente/adicionar.js';
import { apresentarCliente, apresentarClientePorEmail, apresentarClientePorNome, apresentarFotoPerfilPorId } from '../servico/cliente/apresentar.js';
import { editarCliente, editarClienteParcial } from '../servico/cliente/editar.js';
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cliente cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   type: object
 *       500:
 *         description: Erro no servidor
 */
routerCliente.post('/', upload.single('imagem'), async (req, res, next) => {
  const { nome, cpf, email, telefone, senha } = req.body;
  console.log(nome, cpf, email, telefone)
  const imagem = req.file ? req.file.buffer : null;

  const erroValidacao = await validarCliente(cpf, email);
  if (erroValidacao) return next(erroValidacao);

  try {
    const resultado = await adicionarCliente(nome, cpf.replace(/\D/g, ''), email, senha, telefone, imagem);
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
 *     summary: Retorna todos os clientes ou filtra por e-mail ou nome
 *     tags: [Cliente]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome do cliente para filtro
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: E-mail do cliente para filtro
 *     responses:
 *       200:
 *         description: Lista de clientes obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Erro no servidor
 */
routerCliente.get('/', async (req, res, next) => {
  const { email, nome } = req.query;
  let clientes;

  try {
    if (email) {
      clientes = await apresentarClientePorEmail(email);
    } else if (nome) {
      clientes = await apresentarClientePorNome(nome);
    } else {
      clientes = await apresentarCliente();
    }

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   type: object
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
 * /cliente/imagem/{idImagem}:
 *   get:
 *     summary: Retorna a imagem de perfil de um cliente pelo ID da imagem
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: idImagem
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da imagem do cliente
 *     responses:
 *       200:
 *         description: Imagem retornada com sucesso
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Imagem não encontrada
 *       500:
 *         description: Erro no servidor
 */
routerCliente.get('/imagem/:idImagem', async (req, res) => {
  const { idImagem } = req.params;
  try {
    const [resultado] = await apresentarFotoPerfilPorId(idImagem);

    if (!resultado || !resultado.imagem) {
      return res.status(404).send('Imagem não encontrada');
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(resultado.imagem);
  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
});


/**
 * @swagger
 * /cliente:
 *   put:
 *     summary: Atualiza todos os dados do cliente logado
 *     tags: [Cliente]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               telefone:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   type: object
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro no servidor
 */
routerCliente.put('/:id', upload.single('imagem'), async (req, res, next) => {
  const { id } = req.params;
  const { nome, cpf, email, senha, telefone } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  const erroValidacao = await validarCliente(cpf, email);
  if (erroValidacao) return next(erroValidacao);
  try { 
    const resultado = await editarCliente(id, nome, cpf, email, senha, telefone, imagem);

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
 * /cliente:
 *   patch:
 *     summary: Atualiza parcialmente os dados do cliente logado
 *     tags: [Cliente]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               telefone:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   type: object
 *       400:
 *         description: Nada foi fornecido para atualização
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro no servidor
 */
routerCliente.patch('/:id', upload.single('imagem'), async (req, res, next) => {
  const { id } = req.params;
  const { nome, cpf, email, senha, telefone } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  try {
    const camposAtualizar = {};
    if (nome) camposAtualizar.nome = nome;
    if (cpf) camposAtualizar.cpf = cpf;
    if (email) camposAtualizar.email = email;
    if (senha) camposAtualizar.senha = senha;
    if (telefone) camposAtualizar.telefone = telefone;
    if (imagem) camposAtualizar.imagem = imagem;

    if (Object.keys(camposAtualizar).length === 0) {
      throw new AppError('Nada para atualizar.', 400, 'NO_UPDATE_DATA');
    }
    
    const resultado = await editarClienteParcial(id, camposAtualizar);

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
 * /cliente:
 *   delete:
 *     summary: Remove o cliente logado
 *     tags: [Cliente]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cliente deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 dados:
 *                   type: object
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro no servidor
 */
routerCliente.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
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
