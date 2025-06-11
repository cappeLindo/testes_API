import express from 'express';
import upload from '../../middlewares/multerConfig.js';
import adicionarConcessionaria from '../servico/concessionaria/adicionar.js';
import { apresentarConcessionaria, apresentarConcessionariaPorEmail, apresentarConcessionariaPorNome, apresentarFotoConcessionariaPorId } from '../servico/concessionaria/apresentar.js';
import { editarConcessionaria, editarConcessionariaParcial } from '../servico/concessionaria/editar.js';
import deletarConcessionaria from '../servico/concessionaria/deletar.js';
import validarConcessionaria from '../validacao/validacao.js';
import AppError from '../utils/appError.js';

const routerConcessionaria = express.Router();


routerConcessionaria.post('/', upload.single('imagem'), async (req, res, next) => {
  const { nome, cnpj, email, telefone, senha } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  const erroValidacao = await validarConcessionaria(cnpj, email);
  if (erroValidacao) return next(erroValidacao);

  try {
    const resultado = await adicionarConcessionaria(nome, cnpj.replace(/\D/g, ''), email, senha, telefone, imagem);
    res.status(201).json({
      mensagem: 'Concessionaria cadastrado com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});

routerConcessionaria.get('/', async (req, res, next) => {
  const { email, nome } = req.query;
  let concessionarias;

  try {
    if (email) {
      concessionarias = await apresentarConcessionariaPorEmail(email);
    } else if (nome) {
      concessionarias = await apresentarConcessionariaPorNome(nome);
    } else {
      concessionarias = await apresentarConcessionaria();
    }

    res.status(200).json({
      mensagem: 'Lista de concessionarias obtida com sucesso',
      dados: concessionarias
    });
  } catch (erro) {
    next(erro);
  }
});

routerConcessionaria.get('/:id', async (req, res, next) => {
  try {
    const concessionaria = await apresentarConcessionaria(req.params.id);

    if (!concessionaria || concessionaria.length === 0) {
      throw new AppError('Concessionaria não encontrado.', 404, 'Concessionaria_NAO_ENCONTRADO');
    }

    res.status(200).json({
      mensagem: 'Concessionaria encontrado com sucesso',
      dados: concessionaria[0]
    });
  } catch (erro) {
    next(erro);
  }
});

routerConcessionaria.get('/imagem/:idImagem', async (req, res) => {
  const { idImagem } = req.params;
  try {
    const [resultado] = await apresentarFotoConcessionariaPorId(idImagem);

    if (!resultado || !resultado.imagem) {
      return res.status(404).send('Imagem não encontrada');
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(resultado.imagem);
  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
});

routerConcessionaria.put('/', upload.single('imagem'), async (req, res, next) => {
  const { id } = req.user;
  const { nome, cnpj, email, senha, telefone } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  const erroValidacao = await validarConcessionaria(cnpj, email);
  if (erroValidacao) return next(erroValidacao);
  try {
    const resultado = await editarConcessionaria(id, nome, cnpj, email, senha, telefone, imagem);

    if (!resultado || resultado.affectedRows === 0) {
      throw new AppError('Concessionaria não encontrado para atualizar.', 404, 'CONCESSIONARIA_NAO_ENCONTRADO');
    }

    res.status(200).json({
      mensagem: 'Concessionaria atualizado com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});

routerConcessionaria.patch('/', upload.single('imagem'), async (req, res, next) => {
  const { id } = req.user;
  const { nome, cnpj, email, senha, telefone } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  try {
    const camposAtualizar = {};
    if (nome) camposAtualizar.nome = nome;
    if (cnpj) camposAtualizar.cnpj = cnpj;
    if (email) camposAtualizar.email = email;
    if (senha) camposAtualizar.senha = senha;
    if (telefone) camposAtualizar.telefone = telefone;
    if (imagem) camposAtualizar.imagem = imagem;

    if (Object.keys(camposAtualizar).length === 0) {
      throw new AppError('Nada para atualizar.', 400, 'NO_UPDATE_DATA');
    }

    const resultado = await editarConcessionariaParcial(id, camposAtualizar);

    if (!resultado || resultado.affectedRows === 0) {
      throw new AppError('Concessionaria não encontrado para atualizar.', 404, 'CONCESSIONARIA_NAO_ENCONTRADO');
    }

    res.status(200).json({
      mensagem: 'Concessionaria atualizado com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});

routerConcessionaria.delete('/', async (req, res, next) => {
  const { id } = req.user;
  try {
    const resultado = await deletarConcessionaria(id);

    if (!resultado || resultado.affectedRows === 0) {
      throw new AppError('Concessionaria não encontrado para exclusão.', 404, 'CONCESSIONARIA_NAO_ENCONTRADO');
    }

    res.status(200).json({
      mensagem: 'Concessionaria deletado com sucesso',
      dados: resultado
    });
  } catch (erro) {
    next(erro);
  }
});


export default routerConcessionaria;