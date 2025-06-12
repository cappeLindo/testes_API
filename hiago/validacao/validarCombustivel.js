// Importando a função apresentarCambioPorNome do serviço de câmbio
import { apresentarCombustivelPorNome } from '../servicos/combustivel/apresentar.js';

async function validarCombustivel(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const combustivelExistente = await apresentarCombustivelPorNome(valor);
  if (combustivelExistente.length != 0) {
    return {
      status: false,
      mensagem: `O combustível "${valor}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}

async function validarCombustivelParcial(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  return { status: true, mensagem: '' };
}


export { validarCombustivel, validarCombustivelParcial }