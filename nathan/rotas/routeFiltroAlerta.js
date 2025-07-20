import express from 'express';
import AppError from '../utils/AppError.js';
import { validarFiltroAlerta } from '../validacao/validarFiltroAlerta.js';
import { 
  apresentarFiltroAlerta, 
  apresentarFiltroAlertaPorID, 
  apresentarFiltroAlertaPorNome, 
  apresentarFiltroAlertaPorIDcleinte,
  compararCarroComFiltros 
} from '../servicos/filtroAlerta/apresentar.js';
import { adicionarFiltroAlerta } from '../servicos/filtroAlerta/adicionar.js';
import { editarFiltroAlerta } from '../servicos/filtroAlerta/editar.js';
import { deletarFiltroAlerta } from '../servicos/filtroAlerta/deletar.js';

const routerFiltroAlerta = express.Router();

/**
 * @swagger
 * tags:
 *   name: Filtro Alerta
 *   description: Operações relacionadas aos filtros de alerta dos clientes.
 */

/**
 * @swagger
 * /filtroAlerta:
 *   post:
 *     summary: Cadastra um novo filtro de alerta
 *     description: Cria um novo filtro de alerta no sistema com base nos dados fornecidos.
 *     tags: [Filtro Alerta]
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
 *               data_ipva:
 *                 type: string
 *                 format: date
 *               data_compra:
 *                 type: string
 *                 format: date
 *               valor_maximo:
 *                 type: number
 *               valor_minimo:
 *                 type: number
 *               marca_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               cambio_id:
 *                 type: integer
 *               aro_id:
 *                 type: integer
 *               modelo_id:
 *                 type: integer
 *               combustivel_id:
 *                 type: integer
 *               cor_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Filtro de alerta cadastrado com sucesso.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Filtro de alerta cadastrado com sucesso!
 *       400:
 *         description: Dados inválidos ou faltando.
 *       500:
 *         description: Erro interno do servidor.
 */
routerFiltroAlerta.post('/', async (req, res, next) => {
  const { nome, cliente_id } = req.body;
  try {
    if (!nome || !cliente_id) {
      throw new AppError('Nome e cliente_id são obrigatórios.', 400, 'MISSING_DATA');
    }

    const validacao = await validarFiltroAlerta(req.body);
    if (!validacao.status) {
      throw new AppError(validacao.mensagem, 400, 'INVALID_VALUE');
    }

    const resultado = await adicionarFiltroAlerta(req.body);
    return res.status(201).send("Filtro de alerta cadastrado com sucesso!");
  } catch (error) {
    next(error);
  }
});

routerFiltroAlerta.get('/comparar/:idCarro', async (req, res, next) => {
  try {
    const { idCarro } = req.params;
    const resultado = await compararCarroComFiltros(idCarro);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /filtroAlerta/{id}:
 *   put:
 *     summary: Atualiza um filtro de alerta
 *     description: Atualiza os dados de um filtro de alerta existente com base no ID fornecido.
 *     tags: [Filtro Alerta]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do filtro de alerta a ser atualizado.
 *         required: true
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
 *                 example: alerta_valor
 *               ano:
 *                 type: integer
 *               condicao:
 *                 type: string
 *               ipva_pago:
 *                 type: boolean
 *               blindagem:
 *                 type: boolean
 *               data_ipva:
 *                 type: string
 *                 format: date
 *               data_compra:
 *                 type: string
 *                 format: date
 *               valor_maximo:
 *                 type: number
 *               valor_minimo:
 *                 type: number
 *               marca_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               cambio_id:
 *                 type: integer
 *               aro_id:
 *                 type: integer
 *               modelo_id:
 *                 type: integer
 *               combustivel_id:
 *                 type: integer
 *               cor_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Filtro de alerta atualizado com sucesso.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Filtro de alerta atualizado com sucesso!
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Filtro de alerta não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
routerFiltroAlerta.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }

    const validacao = await validarFiltroAlerta(req.body);
    if (!validacao.status) {
      throw new AppError(validacao.mensagem, 400, 'INVALID_VALUE');
    }

    const resultado = await editarFiltroAlerta(id, req.body);
    if (resultado.affectedRows === 0) {
      throw new AppError('Filtro de alerta não encontrado', 404, 'FILTRO_ALERTA_NOT_FOUND');
    }

    return res.status(200).send("Filtro de alerta atualizado com sucesso!");
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /filtroAlerta:
 *   get:
 *     summary: Lista todos os filtros de alerta
 *     description: Retorna todos os filtros de alerta cadastrados. Caso o parâmetro "nome" seja fornecido, filtra por nome.
 *     tags: [Filtro Alerta]
 *     parameters:
 *       - in: query
 *         name: nome
 *         description: Nome do filtro para busca (opcional).
 *         required: false
 *         schema:
 *           type: string
 *           example: alerta_valor
 *     responses:
 *       200:
 *         description: Lista de filtros de alerta retornada com sucesso.
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
 *                   cliente_id:
 *                     type: integer
 *                   ano:
 *                     type: integer
 *                   condicao:
 *                     type: string
 *                   ipva_pago:
 *                     type: boolean
 *                   blindagem:
 *                     type: boolean
 *                   data_ipva:
 *                     type: string
 *                     format: date
 *                   data_compra:
 *                     type: string
 *                     format: date
 *                   valor_maximo:
 *                     type: number
 *                   valor_minimo:
 *                     type: number
 *                   marca_id:
 *                     type: integer
 *                   categoria_id:
 *                     type: integer
 *                   cambio_id:
 *                     type: integer
 *                   aro_id:
 *                     type: integer
 *                   modelo_id:
 *                     type: integer
 *                   combustivel_id:
 *                     type: integer
 *                   cor_id:
 *                     type: integer
 *       404:
 *         description: Filtro de alerta com o nome informado não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
routerFiltroAlerta.get('/', async (req, res, next) => {
  const { nome } = req.query;
  try {
    if (nome) {
      const resultado = await apresentarFiltroAlertaPorNome(nome);
      if (!resultado.length) {
        throw new AppError('Filtro de alerta com esse nome não encontrado', 404, 'FILTRO_ALERTA_NOT_FOUND');
      }
      res.status(200).json(resultado);
    } else {
      const resultado = await apresentarFiltroAlerta();
      res.status(200).json(resultado);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /filtroAlerta/{id}:
 *   get:
 *     summary: Retorna um filtro de alerta pelo ID
 *     description: Busca e retorna os dados de um filtro de alerta específico com base no ID fornecido.
 *     tags: [Filtro Alerta]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do filtro de alerta a ser consultado.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filtro de alerta encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 cliente_id:
 *                   type: integer
 *                 ano:
 *                   type: integer
 *                 condicao:
 *                   type: string
 *                 ipva_pago:
 *                   type: boolean
 *                 blindagem:
 *                   type: boolean
 *                 data_ipva:
 *                   type: string
 *                   format: date
 *                 data_compra:
 *                   type: string
 *                   format: date
 *                 valor_maximo:
 *                   type: number
 *                 valor_minimo:
 *                   type: number
 *                 marca_id:
 *                   type: integer
 *                 categoria_id:
 *                   type: integer
 *                 cambio_id:
 *                   type: integer
 *                 aro_id:
 *                   type: integer
 *                 modelo_id:
 *                   type: integer
 *                 combustivel_id:
 *                   type: integer
 *                 cor_id:
 *                   type: integer
 *       404:
 *         description: Filtro de alerta não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
routerFiltroAlerta.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }

    const resultado = await apresentarFiltroAlertaPorID(id);
    if (!resultado.length) {
      throw new AppError('Filtro de alerta não encontrado', 404, 'FILTRO_ALERTA_NOT_FOUND');
    }
    res.status(200).json(resultado[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /filtroAlerta/cliente/{id}:
 *   get:
 *     summary: Busca filtros de alerta por cliente
 *     description: Retorna todos os filtros associados a um cliente específico.
 *     tags: [Filtro Alerta]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do cliente.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filtros de alerta retornados com sucesso.
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
 *                   cliente_id:
 *                     type: integer
 *                   ano:
 *                     type: integer
 *                   condicao:
 *                     type: string
 *                   ipva_pago:
 *                     type: boolean
 *                   blindagem:
 *                     type: boolean
 *                   data_ipva:
 *                     type: string
 *                     format: date
 *                   data_compra:
 *                     type: string
 *                     format: date
 *                   valor_maximo:
 *                     type: number
 *                   valor_minimo:
 *                     type: number
 *                   marca_id:
 *                     type: integer
 *                   categoria_id:
 *                     type: integer
 *                   cambio_id:
 *                     type: integer
 *                   aro_id:
 *                     type: integer
 *                   modelo_id:
 *                     type: integer
 *                   combustivel_id:
 *                     type: integer
 *                   cor_id:
 *                     type: integer
 *       404:
 *         description: Filtros não encontrados para esse cliente.
 *       500:
 *         description: Erro interno do servidor.
 */
routerFiltroAlerta.get('/cliente/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }

    const resultado = await apresentarFiltroAlertaPorIDcleinte(id);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /filtroAlerta/{id}:
 *   delete:
 *     summary: Deleta um filtro de alerta
 *     description: Remove um filtro de alerta do sistema com base no ID fornecido.
 *     tags: [Filtro Alerta]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do filtro de alerta a ser deletado.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filtro de alerta deletado com sucesso.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Filtro de alerta deletado com sucesso!
 *       404:
 *         description: Filtro de alerta não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
routerFiltroAlerta.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (isNaN(id)) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }

    const resultado = await deletarFiltroAlerta(id);
    if (resultado.affectedRows === 0) {
      throw new AppError('Filtro de alerta não encontrado', 404, 'FILTRO_ALERTA_NOT_FOUND');
    }
    res.status(200).send("Filtro de alerta deletado com sucesso!");
  } catch (error) {
    next(error);
  }
});

export default routerFiltroAlerta;