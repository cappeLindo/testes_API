// Importando a função apresentarCambioPorNome do serviço de câmbio
import { apresentarCambioPorNome } from '../servicos/cambio/apresentar.js';

async function validarCambio(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const cambioExistente = await apresentarCambioPorNome(valor);
  if (cambioExistente.length != 0) {
    return {
      status: false,
      mensagem: `O câmbio "${valor}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}

async function validarCambioParcial(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }


  return { status: true, mensagem: '' };
}


export { validarCambio, validarCambioParcial }