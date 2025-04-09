// Importando a função apresentarCambioPorNome do serviço de câmbio
import { apresentarCorPorNome } from '../servicos/cor/apresentar.js';

export async function validarCor(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const aroExistente = await apresentarCorPorNome(valor);
  console.log(aroExistente.length)
  if (aroExistente.length != 0) {
    return {
      status: false,
      mensagem: `A cor "${valor}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}
