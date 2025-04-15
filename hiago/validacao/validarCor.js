// Importando a função apresentarCambioPorNome do serviço de câmbio
import { apresentarCorPorNome } from '../servicos/cor/apresentar.js';

async function validarCor(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const corExistente = await apresentarCorPorNome(valor);
  console.log(corExistente.length)
  if (corExistente.length != 0) {
    return {
      status: false,
      mensagem: `A cor "${valor}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}

async function validarCorParcial(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  return { status: true, mensagem: '' };
}


export { validarCor, validarCorParcial }