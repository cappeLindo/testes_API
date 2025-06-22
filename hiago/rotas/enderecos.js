import express from 'express';
import {
  apresentarEndereco,
  apresentarEnderecoPorId,
  apresentarEnderecoPorCidade,
} from '../servicos/endereco/apresentar.js';
import { adicionarEndereco } from '../servicos/endereco/adicionar.js';
import { editarEndereco, editarEnderecoParcial } from '../servicos/endereco/editar.js';
import { deletarEndereco } from '../servicos/endereco/deletar.js';
import { validarEndereco, validarEnderecoParcial } from '../validacao/validacaoEndereco.js';
import AppError from '../utils/AppError.js';

const routerEndereco = express.Router();

/**
 * @swagger
 * tags:
 *   name: Endereço
 *   description: Operações relacionadas aos endereços de concessionárias.
 */

/**
 * @swagger
 * /endereco:
 *   post:
 *     summary: Cadastra um novo endereço
 *     description: Cria um novo endereço no sistema após validar os dados informados.
 *     tags: [Endereço]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *               - cidade
 *               - bairro
 *               - rua
 *             properties:
 *               estado:
 *                 type: string
 *                 example: São Paulo
 *               cidade:
 *                 type: string
 *                 example: São Paulo
 *               bairro:
 *                 type: string
 *                 example: Moema
 *               rua:
 *                 type: string
 *                 example: Av. Ibirapuera, 123
 *     responses:
 *       201:
 *         description: Endereço cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Endereço cadastrado com sucesso!
 *       400:
 *         description: Dados inválidos ou ausentes
 *       500:
 *         description: Erro interno do servidor
 */
routerEndereco.post('/', async (req, res, next) => {
  const { cep, estado, cidade, bairro, rua } = req.body;

  try {
    if (!cep || !estado || !cidade || !bairro || !rua) {
      throw new AppError('Todos os campos (estado, cidade, bairro, rua) são obrigatórios.', 400, 'MISSING_FIELDS');
    }

    const enderecoValido = await validarEndereco({ estado, cidade, bairro, rua });

    if (!enderecoValido.status) {
      throw new AppError('Os dados do endereço são inválidos.', 400, 'INVALID_FIELDS', enderecoValido.mensagem);
    }

    const novoEndereco = await adicionarEndereco(cep, estado, cidade, bairro, rua);
    res.status(201).json({
      mensagem: 'Endereço cadastrado com sucesso!',
      id: novoEndereco.id
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /endereco/{id}:
 *   put:
 *     summary: Edita um endereço existente
 *     description: Atualiza todos os dados de um endereço existente com base em seu ID.
 *     tags: [Endereço]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do endereço a ser editado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *               - cidade
 *               - bairro
 *               - rua
 *             properties:
 *               estado:
 *                 type: string
 *                 example: São Paulo
 *               cidade:
 *                 type: string
 *                 example: São Paulo
 *               bairro:
 *                 type: string
 *                 example: Jardins
 *               rua:
 *                 type: string
 *                 example: Av. Paulista, 456
 *     responses:
 *       200:
 *         description: Endereço editado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerEndereco.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { cep, estado, cidade, bairro, rua } = req.body;

  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    if (!estado || !cidade || !bairro || !rua) {
      throw new AppError('Todos os campos (estado, cidade, bairro, rua) são obrigatórios.', 400, 'MISSING_FIELDS');
    }

    const enderecoValido = await validarEndereco({ cep, estado, cidade, bairro, rua });

    if (!enderecoValido.status) {
      throw new AppError('Os dados fornecidos são inválidos.', 400, 'INVALID_FIELDS', enderecoValido.mensagem);
    }

    const resultado = await editarEndereco(id, cep, estado, cidade, bairro, rua);

    if (resultado.affectedRows === 0) {
      throw new AppError('Endereço não encontrado.', 404, 'ENDERECO_NOT_FOUND');
    }

    res.status(200).send('Endereço editado com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /endereco/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um endereço existente
 *     description: Atualiza apenas os campos fornecidos de um endereço com base em seu ID.
 *     tags: [Endereço]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do endereço a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: São Paulo
 *               cidade:
 *                 type: string
 *                 example: São Paulo
 *               bairro:
 *                 type: string
 *                 example: Jardins
 *               rua:
 *                 type: string
 *                 example: Av. Paulista, 456
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou nenhum campo fornecido
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerEndereco.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { cep, estado, cidade, bairro, rua } = req.body;

  try {
    if (isNaN(id)) {
      throw new AppError('ID do endereço deve ser um número válido.', 400, 'INVALID_ID');
    }

    const camposAtualizar = {};
    if (cep) camposAtualizar.cep = cep;
    if (estado) camposAtualizar.estado = estado;
    if (cidade) camposAtualizar.cidade = cidade;
    if (bairro) camposAtualizar.bairro = bairro;
    if (rua) camposAtualizar.rua = rua;

    if (Object.keys(camposAtualizar).length === 0) {
      throw new AppError('Pelo menos um campo deve ser fornecido para atualização.', 400, 'MISSING_DATA');
    }

    const enderecoValido = await validarEnderecoParcial(camposAtualizar);

    if (!enderecoValido.status) {
      throw new AppError(enderecoValido.mensagem || 'Dados do endereço inválidos.', 400, 'INVALID_VALUE');
    }

    const resultado = await editarEnderecoParcial(id, camposAtualizar);

    if (resultado.affectedRows === 0) {
      throw new AppError('Endereço não encontrado.', 404, 'ENDERECO_NOT_FOUND');
    }

    return res.status(200).send('Endereço atualizado com sucesso!');
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Erro ao atualizar endereço.', 500, 'INTERNAL_ERROR', error.message));
  }
});

/**
 * @swagger
 * /endereco:
 *   get:
 *     summary: Lista todos os endereços
 *     description: Retorna todos os endereços cadastrados. Pode filtrar por cidade.
 *     tags: [Endereço]
 *     parameters:
 *       - in: query
 *         name: cidade
 *         required: false
 *         description: Nome da cidade para filtro parcial
 *         schema:
 *           type: string
 *           example: São Paulo
 *     responses:
 *       200:
 *         description: Lista de endereços encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   estado:
 *                     type: string
 *                   cidade:
 *                     type: string
 *                   bairro:
 *                     type: string
 *                   rua:
 *                     type: string
 *       404:
 *         description: Nenhum endereço encontrado com a cidade especificada
 *       500:
 *         description: Erro interno do servidor
 */
routerEndereco.get('/', async (req, res, next) => {
  const { cidade } = req.query;

  try {
    if (cidade) {
      const resultado = await apresentarEnderecoPorCidade(cidade);
      if (!resultado.length) {
        throw new AppError('Nenhum endereço encontrado com essa cidade.', 404, 'ENDERECO_NOT_FOUND');
      }
      res.status(200).json({
        mensagem: 'Consulta feita com sucesso.',
        dados: resultado,
      });
    } else {
      const resultado = await apresentarEndereco();
      res.status(200).json({
        mensagem: 'Consulta feita com sucesso.',
        dados: resultado,
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /endereco/{id}:
 *   get:
 *     summary: Busca um endereço por ID
 *     description: Retorna os dados de um endereço específico com base no seu ID.
 *     tags: [Endereço]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do endereço a ser consultado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Endereço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 estado:
 *                   type: string
 *                 cidade:
 *                   type: string
 *                 bairro:
 *                   type: string
 *                 rua:
 *                   type: string
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerEndereco.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    const resultado = await apresentarEnderecoPorId(id);
    if (!resultado.length) {
      throw new AppError('Endereço não encontrado.', 404, 'ENDERECO_NOT_FOUND');
    }
    res.status(200).json({
      mensagem: 'Consulta feita com sucesso.',
      dados: resultado[0],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /endereco/{id}:
 *   delete:
 *     summary: Remove um endereço
 *     description: Deleta um endereço existente a partir do ID, desde que não esteja associado a uma concessionária.
 *     tags: [Endereço]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do endereço a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Endereço deletado com sucesso
 *       404:
 *         description: Endereço não encontrado
 *       409:
 *         description: Endereço associado a uma concessionária
 *       500:
 *         description: Erro interno do servidor
 */
routerEndereco.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    const resultado = await deletarEndereco(id);
    if (resultado.affectedRows === 0) {
      throw new AppError('Endereço não encontrado.', 404, 'ENDERECO_NOT_FOUND');
    }
    res.status(200).send('Endereço deletado com sucesso!');
  } catch (error) {
    next(error);
  }
});

export default routerEndereco;