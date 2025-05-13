import express from 'express';
import adicionarCliente from '../servico/cliente/adicionar.js';
import apresentarCliente from '../servico/cliente/apresentar.js';
import editarCliente from '../servico/cliente/editar.js';
import deletarCliente from '../servico/cliente/deletar.js';
import validarCliente from '../validacao/cliente.js';
import AppError from '../utils/appError.js';

const rotaCliente = express.Router();

rotaCliente.post('/', validarCliente, async (req, res, next) => {
  // #swagger.tags = ['Cliente']
  // #swagger.description = 'Cadastra um novo cliente'
  // #swagger.parameters['cliente'] = { in: 'body', required: true, schema: { $ref: "#/definitions/Cliente" } }
  try {
    const resultado = await adicionarCliente(req.body);
    res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});

rotaCliente.get('/', async (req, res, next) => {
  // #swagger.tags = ['Cliente']
  // #swagger.description = 'Retorna todos os clientes'
  try {
    const clientes = await apresentarCliente();
    res.status(200).json({
      mensagem: 'Lista de clientes obtida com sucesso',
      dados: clientes
    });
  } catch (erro) {
    next(erro);
  }
});

rotaCliente.put('/:id', validarCliente, async (req, res, next) => {
  // #swagger.tags = ['Cliente']
  // #swagger.description = 'Atualiza um cliente existente'
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  try {
    const resultado = await editarCliente(req.params.id, req.body);
    
    if (resultado.affectedRows === 0) {
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

rotaCliente.delete('/:id', async (req, res, next) => {
  // #swagger.tags = ['Cliente']
  // #swagger.description = 'Remove um cliente pelo ID'
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  try {
    const resultado = await deletarCliente(req.params.id);
    
    if (resultado.affectedRows === 0) {
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

export default rotaCliente;