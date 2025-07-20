// validacao/validarCarro.js

/**
 * Valida os dados completos de um carro.
 * @param {Object} dados - Dados do carro a serem validados.
 * @returns {Object} - Objeto com status e mensagem de validação.
 */
function validarCarro(dados) {
  const {
    nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem,
    cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id
  } = dados;

  if (!nome || typeof nome !== 'string') {
    return { status: false, mensagem: 'Nome do carro é obrigatório e deve ser uma string.' };
  }
  if (!ano || isNaN(ano) || ano < 1900 || ano > new Date().getFullYear()) {
    return { status: false, mensagem: 'Ano inválido.' };
  }
  if (!condicao || typeof condicao !== 'string') {
    return { status: false, mensagem: 'Condição é obrigatória e deve ser uma string.' };
  }
  if (!valor || isNaN(valor) || valor <= 0) {
    return { status: false, mensagem: 'Valor inválido.' };
  }
  const isBooleanLike = val =>
    val === true || val === false || val === 1 || val === 0 || val === '1' || val === '0';

  if (!isBooleanLike(ipva_pago)) {
    return { status: false, mensagem: 'IPVA pago deve ser um booleano.' };
  }
  if (!isBooleanLike(blindagem)) {
    return { status: false, mensagem: 'Blindagem deve ser um booleano.' };
  }

  if (data_ipva && isNaN(Date.parse(data_ipva))) {
    return { status: false, mensagem: 'Data do IPVA inválida.' };
  }
  if (data_compra && isNaN(Date.parse(data_compra))) {
    return { status: false, mensagem: 'Data de compra inválida.' };
  }
  if (!detalhes_veiculo || typeof detalhes_veiculo !== 'string') {
    return { status: false, mensagem: 'Detalhes do veículo são obrigatórios e devem ser uma string.' };
  }
  if (!cor_id || isNaN(cor_id) || cor_id <= 0) {
    return { status: false, mensagem: 'ID da cor inválido.' };
  }
  if (!aro_id || isNaN(aro_id) || aro_id <= 0) {
    return { status: false, mensagem: 'ID do aro inválido.' };
  }
  if (!categoria_id || isNaN(categoria_id) || categoria_id <= 0) {
    return { status: false, mensagem: 'ID da categoria inválido.' };
  }
  if (!marca_id || isNaN(marca_id) || marca_id <= 0) {
    return { status: false, mensagem: 'ID da marca inválido.' };
  }
  if (!modelo_id || isNaN(modelo_id) || modelo_id <= 0) {
    return { status: false, mensagem: 'ID do modelo inválido.' };
  }
  if (!combustivel_id || isNaN(combustivel_id) || combustivel_id <= 0) {
    return { status: false, mensagem: 'ID do combustível inválido.' };
  }
  if (!cambio_id || isNaN(cambio_id) || cambio_id <= 0) {
    return { status: false, mensagem: 'ID do câmbio inválido.' };
  }

  return { status: true, mensagem: 'Dados válidos.' };
}

/**
 * Valida os dados parciais de um carro.
 * @param {Object} dados - Dados parciais do carro a serem validados.
 * @returns {Object} - Objeto com status e mensagem de validação.
 */
function validarCarroParcial(dados) {
  const camposObrigatorios = ['nome', 'ano', 'condicao', 'valor', 'ipva_pago', 'data_ipva', 'data_compra', 'detalhes_veiculo', 'blindagem', 'cor_id', 'aro_id', 'categoria_id', 'marca_id', 'modelo_id', 'combustivel_id', 'cambio_id'];
  const camposPresentes = Object.keys(dados);

  for (const campo of camposPresentes) {
    if (!camposObrigatorios.includes(campo)) {
      return { status: false, mensagem: `Campo '${campo}' não é válido para atualização parcial.` };
    }
    switch (campo) {
      case 'nome':
        if (dados[campo] && typeof dados[campo] !== 'string') {
          return { status: false, mensagem: 'Nome deve ser uma string.' };
        }
        break;
      case 'ano':
        if (dados[campo] && (isNaN(dados[campo]) || dados[campo] < 1900 || dados[campo] > new Date().getFullYear())) {
          return { status: false, mensagem: 'Ano inválido.' };
        }
        break;
      case 'condicao':
        if (dados[campo] && typeof dados[campo] !== 'string') {
          return { status: false, mensagem: 'Condição deve ser uma string.' };
        }
        break;
      case 'valor':
        if (dados[campo] && (isNaN(dados[campo]) || dados[campo] <= 0)) {
          return { status: false, mensagem: 'Valor inválido.' };
        }
        break;
      case 'ipva_pago':
      case 'blindagem':
        if (dados[campo] !== undefined && typeof dados[campo] !== 'boolean') {
          return { status: false, mensagem: `${campo} deve ser um booleano.` };
        }
        break;
      case 'data_ipva':
      case 'data_compra':
        if (dados[campo] && isNaN(Date.parse(dados[campo]))) {
          return { status: false, mensagem: `Data de ${campo} inválida.` };
        }
        break;
      case 'detalhes_veiculo':
        if (dados[campo] && typeof dados[campo] !== 'string') {
          return { status: false, mensagem: 'Detalhes do veículo devem ser uma string.' };
        }
        break;
      case 'cor_id':
      case 'aro_id':
      case 'categoria_id':
      case 'marca_id':
      case 'modelo_id':
      case 'combustivel_id':
      case 'cambio_id':
        if (dados[campo] && (isNaN(dados[campo]) || dados[campo] <= 0)) {
          return { status: false, mensagem: `ID de ${campo} inválido.` };
        }
        break;
    }
  }

  return { status: true, mensagem: 'Dados parciais válidos.' };
}

export { validarCarro, validarCarroParcial };