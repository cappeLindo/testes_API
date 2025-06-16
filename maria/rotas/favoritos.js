import express from 'express';
import {
  buscarFavoritosCarros,
  buscarFavoritosCarrosByIdCarro,
  buscarFavoritosCarrosByIdClienteAndIdCarro,
  buscarFavoritosCarrosByIdCliente,
} from '../servicos/favoritosCarros/busca.js';
import {
  deletarFavoritosCarrosByCliente,
  deletarFavoritosCarrosByCarro,
  deletarFavoritosCarrosByCarroAndCliente,
} from '../servicos/favoritosCarros/deletar.js';
import { adicionarFavoritosCarros } from '../servicos/favoritosCarros/adicionar.js';
import { validarRelacaoFavoritosCarro, validarIdCarroBody } from '../validacao/validacaoFavoritosCarros.js';
import { verifyToken, isAdmin } from '../../middlewares/verifyToken.js';
import AppError from '../utils/AppError.js';

const routerFavoritosCarros = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favoritos Carros
 *   description: Endpoints para gerenciar a lista de carros favoritos.
 */

/**
 * @swagger
 * /favoritosCarros:
 *   get:
 *     summary: Lista todas as relações entre clientes e carros favoritos
 *     tags: [Favoritos Carros]
 *     responses:
 *       200:
 *         description: Lista de relações retornada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
routerFavoritosCarros.get('/', async (req, res, next) => {
  try {
    const resultado = await buscarFavoritosCarros();
    res.status(200).json({
      mensagem: 'Consulta feita com sucesso.',
      dados: resultado,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /favoritosCarros/cliente/meuPerfil:
 *   get:
 *     summary: Retorna a lista de carros favoritos do cliente autenticado
 *     tags: [Favoritos Carros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carros favoritos retornada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
routerFavoritosCarros.get('/cliente/meuPerfil', verifyToken, async (req, res, next) => {
  const idCliente = req.user.id;
  try {
    const resultado = await buscarFavoritosCarrosByIdCliente(idCliente);
    res.status(200).json({
      mensagem: 'Consulta feita com sucesso.',
      dados: resultado,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /favoritosCarros/cliente/{idCliente}:
 *   get:
 *     summary: Retorna a lista de carros favoritos de um cliente específico
 *     tags: [Favoritos Carros]
 *     parameters:
 *       - in: path
 *         name: idCliente
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Lista de carros favoritos retornada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
routerFavoritosCarros.get('/cliente/:idCliente', async (req, res, next) => {
  const { idCliente } = req.params;
  try {
    const resultado = await buscarFavoritosCarrosByIdCliente(idCliente);
    res.status(200).json({
      mensagem: 'Consulta feita com sucesso.',
      dados: resultado,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /favoritosCarros/carro/{idCarro}:
 *   get:
 *     summary: Retorna as relações de favoritos de um carro específico
 *     tags: [Favoritos Carros]
 *     parameters:
 *       - in: path
 *         name: idCarro
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do carro
 *     responses:
 *       200:
 *         description: Relações encontradas e retornadas com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
routerFavoritosCarros.get('/carro/:idCarro', async (req, res, next) => {
  const { idCarro } = req.params;
  try {
    const resultado = await buscarFavoritosCarrosByIdCarro(idCarro);
    res.status(200).json({
      mensagem: 'Consulta feita com sucesso.',
      dados: resultado,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /favoritosCarros/clienteECarro/{idCliente}/{idCarro}:
 *   get:
 *     summary: Retorna a relação entre cliente e carro favorito específico
 *     tags: [Favoritos Carros]
 *     parameters:
 *       - in: path
 *         name: idCliente
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *       - in: path
 *         name: idCarro
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do carro
 *     responses:
 *       200:
 *         description: Relação retornada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
routerFavoritosCarros.get('/clienteECarro/:idCliente/:idCarro', async (req, res, next) => {
  const { idCarro, idCliente } = req.params;
  try {
    const resultado = await buscarFavoritosCarrosByIdClienteAndIdCarro(idCliente, idCarro);
    res.status(200).json({
      mensagem: 'Consulta feita com sucesso.',
      dados: resultado,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /favoritosCarros/adm:
 *   post:
 *     summary: Adiciona um carro aos favoritos de um cliente (admin)
 *     tags: [Favoritos Carros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idCarro
 *               - idCliente
 *             properties:
 *               idCarro:
 *                 type: integer
 *                 description: ID do carro a ser adicionado
 *               idCliente:
 *                 type: integer
 *                 description: ID do cliente
 *     responses:
 *       201:
 *         description: Carro adicionado aos favoritos com sucesso
 *       400:
 *         description: Dados inválidos ou relação já existe
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
routerFavoritosCarros.post('/adm', verifyToken, isAdmin, async (req, res, next) => {
  const { idCarro, idCliente } = req.body;
  try {
    const erroValidacao = await validarRelacaoFavoritosCarro({ idCarro, idCliente });
    if (erroValidacao) {
      throw new AppError(erroValidacao.mensagem, erroValidacao.status, erroValidacao.codigo);
    }
    await adicionarFavoritosCarros(idCarro, idCliente);
    res.status(201).send('Carro adicionado aos favoritos com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /favoritosCarros:
 *   post:
 *     summary: Adiciona um carro aos favoritos do cliente autenticado
 *     tags: [Favoritos Carros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idCarro
 *             properties:
 *               idCarro:
 *                 type: integer
 *                 description: ID do carro a ser adicionado
 *     responses:
 *       201:
 *         description: Carro adicionado aos favoritos com sucesso
 *       400:
 *         description: Dados inválidos ou relação já existe
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
routerFavoritosCarros.post('/', verifyToken, validarIdCarroBody, async (req, res, next) => {
  const { idCarro } = req.body;
  const idCliente = req.user.id;
  try {
    const erroValidacao = await validarRelacaoFavoritosCarro({ idCarro, idCliente });
    if (erroValidacao) {
      throw new AppError(erroValidacao.mensagem, erroValidacao.status, erroValidacao.codigo);
    }
    await adicionarFavoritosCarros(idCarro, idCliente);
    res.status(201).send('Carro adicionado aos favoritos com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /favoritosCarros/carro/{idCarro}:
 *   delete:
 *     summary: Deleta todas as relações de favoritos de um carro (admin)
 *     tags: [Favoritos Carros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCarro
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do carro
 *     responses:
 *       200:
 *         description: Relações deletadas com sucesso
 *       404:
 *         description: Nenhuma relação encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
routerFavoritosCarros.delete('/carro/:idCarro', verifyToken, isAdmin, async (req, res, next) => {
  const { idCarro } = req.params;
  try {
    const resultado = await deletarFavoritosCarrosByCarro(idCarro);
    if (resultado.affectedRows === 0) {
      throw new AppError('Nenhuma relação encontrada para este carro.', 404, 'CARRO_NOT_FOUND');
    }
    res.status(200).send('Relações do carro deletadas com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /favoritosCarros/cliente:
 *   delete:
 *     summary: Deleta todas as relações de favoritos do cliente autenticado
 *     tags: [Favoritos Carros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carros favoritos removidos com sucesso
 *       404:
 *         description: Nenhuma relação encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
routerFavoritosCarros.delete('/cliente', verifyToken, async (req, res, next) => {
  const idCliente = req.user.id;
  try {
    const resultado = await deletarFavoritosCarrosByCliente(idCliente);
    if (resultado.affectedRows === 0) {
      throw new AppError('Nenhuma relação encontrada para este cliente.', 404, 'FAVORITOS_NOT_FOUND');
    }
    res.status(200).send('Carros favoritos do cliente removidos com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /favoritosCarros/clienteECarro/{idCliente}/{idCarro}:
 *   delete:
 *     summary: Deleta a relação entre cliente e carro favorito
 *     tags: [Favoritos Carros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCliente
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *       - in: path
 *         name: idCarro
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do carro
 *     responses:
 *       200:
 *         description: Relação removida com sucesso
 *       404:
 *         description: Relação não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
routerFavoritosCarros.delete('/clienteECarro/:idCliente/:idCarro', verifyToken, async (req, res, next) => {
  const { idCarro, idCliente } = req.params;
  try {
    const resultado = await deletarFavoritosCarrosByCarroAndCliente(idCarro, idCliente);
    if (resultado.affectedRows === 0) {
      throw new AppError('Relação entre cliente e carro não encontrada.', 404, 'RELATION_NOT_FOUND');
    }
    res.status(200).send('Relação entre cliente e carro removida com sucesso!');
  } catch (error) {
    next(error);
  }
});

export default routerFavoritosCarros;