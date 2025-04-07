const regexNumeros = /^-?\d+(\.\d+)?$/;

import { apresentarAroPorNome } from '../servicos/aro/apresentar.js';

export async function validarAro(nome) {
  if (typeof nome !== 'string' || nome.trim() === '') {
    return { status: false, mensagem: 'Nome inválido. Deve ser uma string não vazia.' };
  }

  const partes = nome.trim().split(/\s+/);
  const textoInicial = partes[0]?.toLowerCase();
  const numeroStr = partes[1]?.replace(',', '.');

  if (
    partes.length !== 2 ||
    textoInicial !== 'aro' ||
    !regexNumeros.test(numeroStr)
  ) {
    return {
      status: false,
      mensagem: 'Nome inválido. Deve estar no formato "Aro XX", onde XX é um número.',
    };
  }

  const nomeNormalizado = `Aro ${parseFloat(numeroStr)}`;
  
  const aroExistente = await apresentarAroPorNome(nomeNormalizado);

  if (aroExistente) {
    return {
      status: false,
      mensagem: `O aro "${nomeNormalizado}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}
