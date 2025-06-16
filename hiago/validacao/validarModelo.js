// Importando a função apresentarmodeloPorNome do serviço de câmbio
import { apresentarCategoriaPorId } from '../servicos/categoria/apresentar.js';
import { apresentarMarcaPorId } from '../servicos/marca/apresentar.js';
import { apresentarModeloPorNome } from '../servicos/modelo/apresentar.js';


async function validarModelo(nome, id_marca, id_categoria) {
  if (typeof nome !== 'string' || nome.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve conter um nome e ser uma string não vazia.',
    };
  }

  const modeloExistente = await apresentarModeloPorNome(nome);
  if (modeloExistente.length != 0) {
    return {
      status: false,
      mensagem: `O modelo "${nome}" já está cadastrado.`,
    };
  }

  const marcaExistente = await apresentarMarcaPorId(id_marca);
  if (marcaExistente.length == 0) {
    return {
      status: false,
      mensagem: `A marca "${id_marca}" não existe.`,
    };
  }

  const categoriaExistente = await apresentarCategoriaPorId(id_categoria);
  if (categoriaExistente.length == 0) {
    return {
      status: false,
      mensagem: `A categoria "${id_categoria}" não existe.`,
    };
  }


  return { status: true, mensagem: '' };
}

async function validarModeloParcial(nome, id_marca, id_categoria) {
  // Valida nome, se fornecido
  if (nome !== undefined) {
    if (typeof nome !== 'string' || nome.trim() === '') {
      return {
        status: false,
        mensagem: 'Valor inválido. O nome deve ser uma string não vazia.',
      };
    }
  }

  // Valida marca, se fornecida
  if (id_marca !== undefined) {
    const marcaExistente = await apresentarMarcaPorId(id_marca);
    if (!marcaExistente || marcaExistente.length === 0) {
      return {
        status: false,
        mensagem: `A marca com ID "${id_marca}" não existe.`,
      };
    }
  }

  // Valida categoria, se fornecida
  if (id_categoria !== undefined) {
    const categoriaExistente = await apresentarCategoriaPorId(id_categoria);
    if (!categoriaExistente || categoriaExistente.length === 0) {
      return {
        status: false,
        mensagem: `A categoria com ID "${id_categoria}" não existe.`,
      };
    }
  }

  return { status: true, mensagem: '' };
}


export { validarModelo, validarModeloParcial }