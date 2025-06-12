// Importando a função apresentarCambioPorNome do serviço de câmbio
import { apresentarCategoriaPorNome } from '../servicos/categoria/apresentar.js';

async function validarCategoria(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const categoriaExistente = await apresentarCategoriaPorNome(valor);
  if (categoriaExistente.length != 0) {
    return {
      status: false,
      mensagem: `A categoria "${valor}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}

async function validarCategoriaParcial(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  return { status: true, mensagem: '' };
}


export { validarCategoria, validarCategoriaParcial }