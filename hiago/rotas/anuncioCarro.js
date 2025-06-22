import express from 'express';
import upload from '../../middlewares/multerConfig.js';
import {
  apresentarCarro,
  apresentarCarroPorId,
  apresentarCarroPorNome,
} from '../servicos/anuncioCarro/apresentar.js';

import {  apresentarImagemPorId, apresentarImagemPorIdAnuncio  } from '../servicos/imagensCarro/apresentar.js';

import { adicionarCarro } from '../servicos/anuncioCarro/adicionar.js';
import { deletarAnuncioCarro } from '../servicos/anuncioCarro/deletar.js';
import { editarAnuncioCarro, editarAnuncioCarroParcial } from '../servicos/anuncioCarro/editar.js';
import { validarCarro, validarCarroParcial } from '../validacao/validarCarro.js';
import AppError from '../utils/AppError.js';

const routeAnuncioCarro = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carro
 *   description: Operações relacionadas aos anúncios de carros.
 */

/**
 * @swagger
 * /carro/{idConcessionaria}:
 *   post:
 *     summary: Cadastra um novo carro
 *     description: Cria um novo anúncio de carro para uma concessionária específica.
 *     tags: [Carro]
 *     parameters:
 *       - in: path
 *         name: idConcessionaria
 *         required: true
 *         description: ID da concessionária
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
 *               - ano
 *               - condicao
 *               - valor
 *               - ipva_pago
 *               - data_ipva
 *               - data_compra
 *               - detalhes_veiculo
 *               - blindagem
 *               - cor_id
 *               - aro_id
 *               - categoria_id
 *               - marca_id
 *               - modelo_id
 *               - combustivel_id
 *               - cambio_id
 *               - imagensCarro
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Civic
 *               ano:
 *                 type: integer
 *                 example: 2020
 *               condicao:
 *                 type: string
 *                 example: Usado
 *               valor:
 *                 type: number
 *                 example: 85000.00
 *               ipva_pago:
 *                 type: boolean
 *                 example: true
 *               data_ipva:
 *                 type: string
 *                 format: date
 *                 example: 2023-05-01
 *               data_compra:
 *                 type: string
 *                 format: date
 *                 example: 2020-06-15
 *               detalhes_veiculo:
 *                 type: string
 *                 example: Carro em excelente estado, único dono.
 *               blindagem:
 *                 type: boolean
 *                 example: false
 *               cor_id:
 *                 type: integer
 *                 example: 1
 *               aro_id:
 *                 type: integer
 *                 example: 1
 *               categoria_id:
 *                 type: integer
 *                 example: 1
 *               marca_id:
 *                 type: integer
 *                 example: 1
 *               modelo_id:
 *                 type: integer
 *                 example: 1
 *               combustivel_id:
 *                 type: integer
 *                 example: 1
 *               cambio_id:
 *                 type: integer
 *                 example: 1
 *               imagensCarro:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Até 7 imagens do carro
 *     responses:
 *       201:
 *         description: Carro cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Carro cadastrado com sucesso!
 *       400:
 *         description: Dados inválidos ou ausentes
 *       500:
 *         description: Erro interno do servidor
 */
routeAnuncioCarro.post('/:idConcessionaria', upload.array('imagensCarro', 7), async (req, res, next) => {
  const { idConcessionaria } = req.params;
  const {
    nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem,
    cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id
  } = req.body;
  const imagensCarro = req.files;

  try {
    if (!idConcessionaria || isNaN(idConcessionaria)) {
      throw new AppError('ID da concessionária é obrigatório e deve ser um número.', 400, 'INVALID_CONCESSIONARIA_ID');
    }

    const validacao = await validarCarro({
      nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem,
      cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id
    });

    if (!validacao.status) {
      throw new AppError(validacao.mensagem, 400, 'VALIDATION_ERROR');
    }

    if (!imagensCarro || imagensCarro.length < 1) {
      throw new AppError('É necessário pelo menos uma imagem.', 400, 'MIN_IMAGES_REQUIRED');
    }

    if (imagensCarro.length > 7) {
      throw new AppError('Número máximo de imagens é 7.', 400, 'MAX_IMAGES_EXCEEDED');
    }

    await adicionarCarro({
      nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem,
      cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id, concessionaria_id: idConcessionaria
    }, imagensCarro);

    res.status(201).send('Carro cadastrado com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /carro/{id}:
 *   put:
 *     summary: Edita um carro existente
 *     description: Atualiza todos os dados de um carro existente com base em seu ID.
 *     tags: [Carro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do carro a ser editado
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
 *               - ano
 *               - condicao
 *               - valor
 *               - ipva_pago
 *               - data_ipva
 *               - data_compra
 *               - detalhes_veiculo
 *               - blindagem
 *               - cor_id
 *               - aro_id
 *               - categoria_id
 *               - marca_id
 *               - modelo_id
 *               - combustivel_id
 *               - cambio_id
 *               - imagensCarro
 *             properties:
 *               nome:
 *                 type: string
 *               ano:
 *                 type: integer
 *               condicao:
 *                 type: string
 *               valor:
 *                 type: number
 *               ipva_pago:
 *                 type: boolean
 *               data_ipva:
 *                 type: string
 *                 format: date
 *               data_compra:
 *                 type: string
 *                 format: date
 *               detalhes_veiculo:
 *                 type: string
 *               blindagem:
 *                 type: boolean
 *               cor_id:
 *                 type: integer
 *               aro_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               marca_id:
 *                 type: integer
 *               modelo_id:
 *                 type: integer
 *               combustivel_id:
 *                 type: integer
 *               cambio_id:
 *                 type: integer
 *               imagensCarro:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Até 7 imagens do carro
 *     responses:
 *       200:
 *         description: Carro editado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Carro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routeAnuncioCarro.put('/:id', upload.array('imagensCarro', 7), async (req, res, next) => {
  const { id } = req.params;
  const {
    nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem,
    cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id
  } = req.body;
  const imagensCarro = req.files;

  try {
    if (!id || isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    const validacao = await validarCarro({
      nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem,
      cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id
    });

    if (!validacao.status) {
      throw new AppError(validacao.mensagem, 400, 'VALIDATION_ERROR');
    }

    if (!imagensCarro || imagensCarro.length < 1) {
      throw new AppError('É necessário pelo menos uma imagem.', 400, 'MIN_IMAGES_REQUIRED');
    }

    if (imagensCarro.length > 7) {
      throw new AppError('Número máximo de imagens é 7.', 400, 'MAX_IMAGES_EXCEEDED');
    }

    const resultado = await editarAnuncioCarro({
      nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem,
      cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id, id
    }, imagensCarro);

    if (resultado.affectedRows === 0) {
      throw new AppError('Carro não encontrado.', 404, 'CARRO_NOT_FOUND');
    }

    res.status(200).send('Carro atualizado com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /carro/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um carro
 *     description: Atualiza parcialmente os dados de um carro com base no ID.
 *     tags: [Carro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do carro a ser atualizado
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
 *               ano:
 *                 type: integer
 *               condicao:
 *                 type: string
 *               valor:
 *                 type: number
 *               ipva_pago:
 *                 type: boolean
 *               data_ipva:
 *                 type: string
 *                 format: date
 *               data_compra:
 *                 type: string
 *                 format: date
 *               detalhes_veiculo:
 *                 type: string
 *               blindagem:
 *                 type: boolean
 *               cor_id:
 *                 type: integer
 *               aro_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               marca_id:
 *                 type: integer
 *               modelo_id:
 *                 type: integer
 *               combustivel_id:
 *                 type: integer
 *               cambio_id:
 *                 type: integer
 *               concessionaria_id:
 *                 type: integer
 *               imagensCarro:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Novas imagens do carro
 *               imagensExcluidas:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs das imagens a serem excluídas
 *     responses:
 *       200:
 *         description: Carro atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Carro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routeAnuncioCarro.patch('/:id', upload.array('imagensCarro', 7), async (req, res, next) => {
  const { id } = req.params;
  const {
    nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem,
    cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id, concessionaria_id,
    imagensExcluidas
  } = req.body;
  const imagensCarro = req.files;

  try {
    if (!id || isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    const camposAtualizar = {};
    if (nome) camposAtualizar.nome = nome;
    if (ano) camposAtualizar.ano = ano;
    if (condicao) camposAtualizar.condicao = condicao;
    if (valor) camposAtualizar.valor = valor;
    if (ipva_pago !== undefined) camposAtualizar.ipva_pago = ipva_pago;
    if (data_ipva) camposAtualizar.data_ipva = data_ipva;
    if (data_compra) camposAtualizar.data_compra = data_compra;
    if (detalhes_veiculo) camposAtualizar.detalhes_veiculo = detalhes_veiculo;
    if (blindagem !== undefined) camposAtualizar.blindagem = blindagem;
    if (cor_id) camposAtualizar.cor_id = cor_id;
    if (aro_id) camposAtualizar.aro_id = aro_id;
    if (categoria_id) camposAtualizar.categoria_id = categoria_id;
    if (marca_id) camposAtualizar.marca_id = marca_id;
    if (modelo_id) camposAtualizar.modelo_id = modelo_id;
    if (combustivel_id) camposAtualizar.combustivel_id = combustivel_id;
    if (cambio_id) camposAtualizar.cambio_id = cambio_id;
    if (concessionaria_id) camposAtualizar.concessionaria_id = concessionaria_id;

    const validacao = await validarCarroParcial(camposAtualizar);
    if (!validacao.status) {
      throw new AppError(validacao.mensagem, 400, 'VALIDATION_ERROR');
    }

    if (Object.keys(camposAtualizar).length === 0 && !imagensCarro.length && !imagensExcluidas) {
      throw new AppError('Nada para atualizar.', 400, 'NO_UPDATE_DATA');
    }

    const resultado = await editarAnuncioCarroParcial(id, camposAtualizar, imagensCarro, imagensExcluidas);

    if (resultado.affectedRows === 0) {
      throw new AppError('Carro não encontrado.', 404, 'CARRO_NOT_FOUND');
    }

    res.status(200).send('Carro atualizado com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /carro:
 *   get:
 *     summary: Lista todos os carros
 *     description: Retorna todos os carros cadastrados. Pode filtrar por nome.
 *     tags: [Carro]
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         description: Nome do carro para filtro parcial
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de carros encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Carro'
 *       404:
 *         description: Nenhum carro encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routeAnuncioCarro.get('/', async (req, res, next) => {
  const { nome } = req.query;

  try {
    const resultado = nome ? await apresentarCarroPorNome(nome) : await apresentarCarro();
    if (!resultado.length) {
      throw new AppError('Nenhum carro encontrado.', 404, 'CARRO_NOT_FOUND');
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
 * /carro/{id}:
 *   get:
 *     summary: Busca um carro por ID
 *     description: Retorna os dados de um carro específico com base no seu ID.
 *     tags: [Carro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do carro a ser consultado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carro'
 *       404:
 *         description: Carro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routeAnuncioCarro.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id || isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    const resultado = await apresentarCarroPorId(id);
    if (!resultado) {
      throw new AppError('Carro não encontrado.', 404, 'CARRO_NOT_FOUND');
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
 * /carro/{id}:
 *   delete:
 *     summary: Remove um carro
 *     description: Deleta um carro existente a partir do ID.
 *     tags: [Carro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do carro a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carro deletado com sucesso
 *       404:
 *         description: Carro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routeAnuncioCarro.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id || isNaN(id)) {
      throw new AppError('ID inválido.', 400, 'INVALID_ID');
    }

    const resultado = await deletarAnuncioCarro(id);
    if (resultado.affectedRows === 0) {
      throw new AppError('Carro não encontrado.', 404, 'CARRO_NOT_FOUND');
    }

    res.status(200).send('Carro deletado com sucesso!');
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /carro/im soft

/**
 * @swagger
 * /carro/imagem/{idImagem}:
 *   get:
 *     summary: Retorna a imagem de um carro
 *     description: Retorna a imagem de um carro com base no ID da imagem.
 *     tags: [Carro]
 *     parameters:
 *       - in: path
 *         name: idImagem
 *         required: true
 *         description: ID da imagem do carro
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
 *       404:
 *         description: Imagem não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
routeAnuncioCarro.get('/imagem/:idImagem', async (req, res, next) => {
  const { idImagem } = req.params;

  try {
    if (!idImagem || isNaN(idImagem)) {
      throw new AppError('ID da imagem inválido.', 400, 'INVALID_IMAGE_ID');
    }

    const resultado = await apresentarImagemPorId(idImagem);

    if (!resultado || !resultado.arquivo) {
      throw new AppError('Imagem não encontrada.', 404, 'IMAGE_NOT_FOUND');
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(resultado.arquivo);
  } catch (error) {
    next(error);
  }
});

export default routeAnuncioCarro;