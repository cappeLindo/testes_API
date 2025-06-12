const regexInteiros = /^\d+$/;

import { apresentarAroPorNome } from '../servicos/aro/apresentar.js';

async function validarAro(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const valorLimpo = valor.trim();

  if (!regexInteiros.test(valorLimpo)) {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve conter apenas números inteiros.',
    };
  }

  const nomeNormalizado = `${parseInt(valorLimpo, 10)}`;

  const aroExistente = await apresentarAroPorNome(nomeNormalizado);

  if (aroExistente.length != 0) {
    return {
      status: false,
      mensagem: `O aro "${nomeNormalizado}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}
async function validarAroParcial(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const valorLimpo = valor.trim();

  if (!regexInteiros.test(valorLimpo)) {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve conter apenas números inteiros.',
    };
  }

  const nomeNormalizado = `${parseInt(valorLimpo, 10)}`;

  return { status: true, mensagem: '' };
}

export { validarAro, validarAroParcial}