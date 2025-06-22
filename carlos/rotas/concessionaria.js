import express from 'express';
import upload from '../../middlewares/multerConfig.js';
import {
  apresentarConcessionaria,
  apresentarConcessionariaPorId,
  apresentarConcessionariaPorEmail,
  apresentarConcessionariaPorNome,
  apresentarFotoConcessionariaPorId
} from '../servico/concessionaria/apresentar.js'; // Caminho corrigido
import { adicionarConcessionaria } from '../servico/concessionaria/adicionar.js';
import { editarConcessionaria, editarConcessionariaParcial } from '../servico/concessionaria/editar.js';
import { deletarConcessionaria } from '../servico/concessionaria/deletar.js';
import { validarConcessionaria } from '../validacao/validacao.js';
import AppError from '../utils/appError.js';

const routerConcessionaria = express.Router();

/**
 * @swagger
 * tags:
 *   name: Concessionaria
 *   description: Operações relacionadas às concessionárias.
 */

/**
 * @swagger
 * /concessionaria:
 *   post:
 *     summary: Cadastra uma nova concessionária
 *     description: Cria uma nova concessionária no sistema após validar os dados informados.
 *     tags: [Concessionaria]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cnpj
 *               - email
 *               - senha
 *               - telefone
 *               - endereco_id
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Concessionária ABC
 *               cnpj:
 *                 type: string
 *                 example: 12.345.678/0001-90
 *               email:
 *                 type: string
 *                 example: contato@abc.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *               telefone:
 *                 type: string
 *                 example: (11) 98765-4321
 *               endereco_id:
 *                 type: integer
 *                 example: 1
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Concessionária cadastrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Concessionária cadastrada com sucesso!
 *       400:
 *         description: Dados inválidos ou ausentes
 *       500:
 *         description: Erro interno do servidor
 */
routerConcessionaria.post('/', upload.single('imagem'), async (req, res, next) => {
  const { nome, cnpj, email, senha, telefone, endereco_id } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  try {
    if (!nome || !cnpj || !email || !senha || !telefone || !endereco_id) {
      throw new AppError('Todos os campos obrigatórios devem ser preenchidos.', 400, 'MISSING_FIELDS');
    }

    const validacao = await validarConcessionaria(cnpj, email);
    if (validacao) return next(validacao);

    await adicionarConcessionaria(nome, cnpj.replace(/\D/g, ''), email, senha, telefone, imagem, endereco_id);
    res.status(201).send('Concessionária cadastrada com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /concessionaria/{id}:
 *   put:
 *     summary: Edita uma concessionária existente
 *     description: Atualiza todos os dados de uma concessionária com base no ID.
 *     tags: [Concessionaria]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da concessionária a ser editada
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cnpj
 *               - email
 *               - senha
 *               - telefone
 *               - endereco_id
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Concessionária XYZ
 *               cnpj:
 *                 type: string
 *                 example: 98.765.432/0001-10
 *               email:
 *                 type: string
 *                 example: contato@xyz.com
 *               senha:
 *                 type: string
 *                 example: novaSenha123
 *               telefone:
 *                 type: string
 *                 example: (11) 91234-5678
 *               endereco_id:
 *                 type: integer
 *                 example: 1
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Concessionária editada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Concessionária não encontrada
 *       500:
 *         description: Erro interno
 */
routerConcessionaria.put('/:id', upload.single('imagem'), async (req, res, next) => {
  const { id } = req.params;
  const { nome, cnpj, email, senha, telefone, endereco_id } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }
    if (!nome || !cnpj || !email || !senha || !telefone || !endereco_id) {
      throw new AppError('Todos os campos obrigatórios devem ser preenchidos.', 400, 'MISSING_FIELDS');
    }

    const validacao = await validarConcessionaria(cnpj, email);
    if (!validacao.status) {
      throw new AppError(validacao.mensagem, 400, 'INVALID_DATA', validacao.mensagem);
    }

    const resultado = await editarConcessionaria(id, nome, cnpj.replace(/\D/g, ''), email, senha, telefone, imagem, endereco_id);
    if (resultado.affectedRows === 0) {
      throw new AppError('Concessionária não encontrada.', 404, 'CONCESSIONARIA_NOT_FOUND');
    }

    res.status(200).send('Concessionária editada com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /concessionaria/{id}:
 *   patch:
 *     summary: Edita parcialmente uma concessionária
 *     description: Atualiza apenas os campos fornecidos de uma concessionária com base no ID.
 *     tags: [Concessionaria]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da concessionária a ser editada
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Concessionária XYZ
 *               cnpj:
 *                 type: string
 *                 example: 98.765.432/0001-10
 *               email:
 *                 type: string
 *                 example: contato@xyz.com
 *               senha:
 *                 type: string
 *                 example: novaSenha123
 *               telefone:
 *                 type: string
 *                 example: (11) 91234-5678
 *               endereco_id:
 *                 type: integer
 *                 example: 1
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Concessionária editada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Concessionária não encontrada
 *       500:
 *         description: Erro interno
 */
routerConcessionaria.patch('/:id', upload.single('imagem'), async (req, res, next) => {
  const { id } = req.params;
  const { nome, cnpj, email, senha, telefone, endereco_id } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    const camposAtualizar = {};
    if (nome) camposAtualizar.nome = nome;
    if (cnpj) camposAtualizar.cnpj = cnpj.replace(/\D/g, '');
    if (email) camposAtualizar.email = email;
    if (senha) camposAtualizar.senha = senha;
    if (telefone) camposAtualizar.telefone = telefone;
    if (endereco_id) camposAtualizar.endereco_id = parseInt(endereco_id, 10);
    if (imagem) camposAtualizar.imagem = imagem;

    if (Object.keys(camposAtualizar).length === 0) {
      throw new AppError('Nenhum campo fornecido para atualização.', 400, 'NO_UPDATE_DATA');
    }

    if (cnpj || email) {
      const validacao = await validarConcessionaria(cnpj, email);
      if (!validacao.status) {
        throw new AppError(validacao.mensagem, 400, 'INVALID_DATA', validacao.mensagem);
      }
    }

    const resultado = await editarConcessionariaParcial(id, camposAtualizar);
    if (resultado.affectedRows === 0) {
      throw new AppError('Concessionária não encontrada.', 404, 'CONCESSIONARIA_NOT_FOUND');
    }

    res.status(200).send('Concessionária editada com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /concessionaria:
 *   get:
 *     summary: Lista todas as concessionárias
 *     description: Retorna todas as concessionárias cadastradas. Pode filtrar por email ou nome.
 *     tags: [Concessionaria]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: false
 *         description: Email para filtro parcial
 *         schema:
 *           type: string
 *           example: contato@abc.com
 *       - in: query
 *         name: nome
 *         required: false
 *         description: Nome para filtro parcial
 *         schema:
 *           type: string
 *           example: Concessionária ABC
 *     responses:
 *       200:
 *         description: Lista de concessionárias encontrada com sucesso
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
 *                   cnpj:
 *                     type: string
 *                   email:
 *                     type: string
 *                   senha:
 *                     type: string
 *                   telefone:
 *                     type: string
 *                   endereco_id:
 *                     type: integer
 *       404:
 *         description: Concessionária com os filtros especificados não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
routerConcessionaria.get('/', async (req, res, next) => {
  const { email, nome } = req.query;

  try {
    let resultado;
    if (email) {
      resultado = await apresentarConcessionariaPorEmail(email);
    } else if (nome) {
      resultado = await apresentarConcessionariaPorNome(nome);
    } else {
      resultado = await apresentarConcessionaria();
    }

    if (!resultado.length) {
      throw new AppError('Nenhuma concessionária encontrada.', 404, 'CONCESSIONARIA_NOT_FOUND');
    }

    res.status(200).json({
      mensagem: 'Consulta feita com sucesso.',
      dados: resultado
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /concessionaria/{id}:
 *   get:
 *     summary: Busca uma concessionária por ID
 *     description: Retorna os dados de uma concessionária específica com base no seu ID.
 *     tags: [Concessionaria]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da concessionária a ser consultada
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Concessionária encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 cnpj:
 *                   type: string
 *                 email:
 *                   type: string
 *                 senha:
 *                   type: string
 *                 telefone:
 *                   type: string
 *                 endereco_id:
 *                   type: integer
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Concessionária não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
routerConcessionaria.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    const resultado = await apresentarConcessionariaPorId(id);
    if (!resultado.length) {
      throw new AppError('Concessionária não encontrada.', 404, 'CONCESSIONARIA_NOT_FOUND');
    }

    res.status(200).json({
      mensagem: 'Consulta feita com sucesso.',
      dados: resultado[0]
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /concessionaria/imagem/{id}:
 *   get:
 *     summary: Busca a imagem de uma concessionária por ID
 *     description: Retorna a imagem de uma concessionária específica com base no seu ID.
 *     tags: [Concessionaria]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da concessionária cuja imagem será consultada
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imagem encontrada
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Imagem não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
routerConcessionaria.get('/imagem/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    const resultado = await apresentarFotoConcessionariaPorId(id);
    if (!resultado.length || !resultado[0].imagem) {
      throw new AppError('Imagem não encontrada.', 404, 'IMAGE_NOT_FOUND');
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(resultado[0].imagem);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /concessionaria/{id}:
 *   delete:
 *     summary: Remove uma concessionária
 *     description: Deleta uma concessionária com base no ID.
 *     tags: [Concessionaria]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da concessionária a ser deletada
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Concessionária deletada com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Concessionária não encontrada
 *       409:
 *         description: Concessionária referenciada por outros dados
 *       500:
 *         description: Erro interno do servidor
 */
routerConcessionaria.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    const resultado = await deletarConcessionaria(id);
    if (resultado.affectedRows === 0) {
      throw new AppError('Concessionária não encontrada.', 404, 'CONCESSIONARIA_NOT_FOUND');
    }

    res.status(200).send('Concessionária deletada com sucesso!');
  } catch (error) {
    next(error);
  }
});

export default routerConcessionaria;