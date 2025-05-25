import express from 'express';
import adicionarCliente from '../servico/cliente/adicionar.js';
import apresentarCliente from '../servico/cliente/apresentar.js';
import editarCliente from '../servico/cliente/editar.js';
import deletarCliente from '../servico/cliente/deletar.js';
import validarCliente from '../validacao/cliente.js';
import AppError from '../utils/appError.js';

const routerCliente = express.Router();

// Criar cliente
routerCliente.post('/', validarCliente, async (req, res, next) => {
  /**
   * #swagger.tags = ['Cliente']
   * #swagger.summary = 'Cadastra um novo cliente'
   * #swagger.description = 'Cria um novo cliente no sistema com nome, CPF, e-mail, telefone e (opcionalmente) imagem.'
   * #swagger.parameters['cliente'] = {
   *   in: 'body',
   *   required: true,
   *   schema: {
   *     nome_cliente: 'João da Silva',
   *     cpf_cliente: '123.456.789-00',
   *     email_cliente: 'joao.silva@email.com',
   *     telefone_cliente: '(11) 91234-5678',
   *     imagem_cliente: 'https://exemplo.com/imagem.jpg'
   *   }
   * }
   * #swagger.responses[201] = {
   *   description: 'Cliente cadastrado com sucesso',
   *   schema: {
   *     mensagem: 'Cliente cadastrado com sucesso',
   *     dados: {
   *       id_cliente: 1,
   *       nome_cliente: 'João da Silva',
   *       cpf_cliente: '123.456.789-00',
   *       email_cliente: 'joao.silva@email.com',
   *       telefone_cliente: '(11) 91234-5678',
   *       imagem_cliente: 'https://exemplo.com/imagem.jpg'
   *     }
   *   }
   * }
   * #swagger.responses[400] = { description: 'Dados inválidos' }
   * #swagger.responses[500] = { description: 'Erro interno ao tentar cadastrar o cliente' }
   */
  
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

// Listar clientes
routerCliente.get('/', async (req, res, next) => {
  /* #swagger.tags = ['Cliente']
     #swagger.description = 'Retorna todos os clientes' */
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

// Consultar cliente por ID (usando a função atualizada)
routerCliente.get('/:id', async (req, res, next) => {
  /* #swagger.tags = ['Cliente']
     #swagger.description = 'Retorna um cliente pelo ID'
     #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' } */
  try {
    const cliente = await apresentarCliente(req.params.id);
    
    if (!cliente || cliente.length === 0) {
      throw new AppError('Cliente não encontrado.', 404, 'CLIENTE_NAO_ENCONTRADO');
    }

    res.status(200).json({
      mensagem: 'Cliente encontrado com sucesso',
      dados: cliente[0] // Assumindo que a consulta retorna um array de resultados
    });
  } catch (erro) {
    next(erro);
  }
});

// Atualizar cliente
routerCliente.put('/:id', validarCliente, async (req, res, next) => {
  /* #swagger.tags = ['Cliente']
     #swagger.description = 'Atualiza um cliente existente'
     #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' } */
  try {
    const resultado = await editarCliente(req.params.id, req.body);

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

// Deletar cliente
routerCliente.delete('/:id', async (req, res, next) => {
  /* #swagger.tags = ['Cliente']
     #swagger.description = 'Remove um cliente pelo ID'
     #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' } */
  try {
    const resultado = await deletarCliente(req.params.id);

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
