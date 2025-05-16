import express from 'express';
import adicionarConcessionaria from '../servico/concessionaria/adicionar.js';
import apresentarConcessionaria from '../servico/concessionaria/apresentar.js';
import editarConcessionaria from '../servico/concessionaria/editar.js';
import deletarConcessionaria from '../servico/concessionaria/deletar.js';
import validarConcessionaria from '../validacao/concessionaria.js';
import AppError from '../utils/appError.js';

const routerConcessionaria = express.Router();

// Criar concessionaria
routerConcessionaria.post('/', validarConcessionaria, async (req, res, next) => {
  /* #swagger.tags = ['Concessionaria']
     #swagger.description = 'Cadastra uma nova concessionária'
     #swagger.parameters['concessionaria'] = { in: 'body', required: true, schema: { $ref: "#/definitions/Concessionaria" } } */
  try {
    const resultado = await adicionarConcessionaria(req.body);
    res.status(201).json({
      mensagem: 'Concessionária cadastrada com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});

// Listar concessionarias
routerConcessionaria.get('/', async (req, res, next) => {
  /* #swagger.tags = ['Concessionaria']
     #swagger.description = 'Retorna todas as concessionárias' */
  try {
    const concessionarias = await apresentarConcessionaria();
    res.status(200).json({
      mensagem: 'Lista de concessionárias obtida com sucesso',
      dados: concessionarias
    });
  } catch (erro) {
    next(erro);
  }
});

// Consultar concessionaria por ID
routerConcessionaria.get('/:id', async (req, res, next) => {
  /* #swagger.tags = ['Concessionaria']
     #swagger.description = 'Retorna uma concessionária pelo ID'
     #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' } */
  try {
    const concessionaria = await apresentarConcessionaria(req.params.id);
    
    if (!concessionaria || concessionaria.length === 0) {
      throw new AppError('Concessionária não encontrada.', 404, 'CONCESSIONARIA_NAO_ENCONTRADA');
    }

    res.status(200).json({
      mensagem: 'Concessionária encontrada com sucesso',
      dados: concessionaria[0]
    });
  } catch (erro) {
    next(erro);
  }
});

// Atualizar concessionaria
routerConcessionaria.put('/:id', validarConcessionaria, async (req, res, next) => {
  /* #swagger.tags = ['Concessionaria']
     #swagger.description = 'Atualiza uma concessionária existente'
     #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' } */
  try {
    const resultado = await editarConcessionaria(req.params.id, req.body);

    if (!resultado || resultado.affectedRows === 0) {
      throw new AppError('Concessionária não encontrada para atualizar.', 404, 'CONCESSIONARIA_NAO_ENCONTRADA');
    }

    res.status(200).json({
      mensagem: 'Concessionária atualizada com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});

// Deletar concessionaria
routerConcessionaria.delete('/:id', async (req, res, next) => {
  /* #swagger.tags = ['Concessionaria']
     #swagger.description = 'Remove uma concessionária pelo ID'
     #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' } */
  try {
    const resultado = await deletarConcessionaria(req.params.id);

    if (!resultado || resultado.affectedRows === 0) {
      throw new AppError('Concessionária não encontrada para exclusão.', 404, 'CONCESSIONARIA_NAO_ENCONTRADA');
    }

    res.status(200).json({
      mensagem: 'Concessionária deletada com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});

export default routerConcessionaria;