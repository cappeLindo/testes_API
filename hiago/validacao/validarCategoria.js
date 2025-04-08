// Importando a função apresentarCambioPorNome do serviço de câmbio
import { apresentarCategoriaPorNome } from '../servicos/categoria/apresentar.js';

export async function validarCategoria(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const aroExistente = await apresentarCategoriaPorNome(valor);
  console.log(aroExistente.length)
  if (aroExistente.length != 0) {
    return {
      status: false,
      mensagem: `A categoria "${valor}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}
