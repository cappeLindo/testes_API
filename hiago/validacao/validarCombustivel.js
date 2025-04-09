// Importando a função apresentarCambioPorNome do serviço de câmbio
import { apresentarCombustivelPorNome } from '../servicos/combustivel/apresentar.js';

export async function validarCombustivel(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const aroExistente = await apresentarCombustivelPorNome(valor);
  console.log(aroExistente.length)
  if (aroExistente.length != 0) {
    return {
      status: false,
      mensagem: `O combustível "${valor}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}
