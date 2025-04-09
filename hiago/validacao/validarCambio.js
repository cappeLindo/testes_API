// Importando a função apresentarCambioPorNome do serviço de câmbio
import { apresentarCambioPorNome } from '../servicos/cambio/apresentar.js';

export async function validarCambio(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const cambioExistente = await apresentarCambioPorNome(valor);
  console.log(cambioExistente.length)
  if (cambioExistente.length != 0) {
    return {
      status: false,
      mensagem: `O câmbio "${valor}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}
