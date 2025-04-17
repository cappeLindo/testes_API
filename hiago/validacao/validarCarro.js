import { apresentarAroPorId } from '../servicos/aro/apresentar.js';
import { apresentarCorPorId } from '../servicos/cor/apresentar.js';
import { apresentarCombustivelPorId } from '../servicos/combustivel/apresentar.js';
import { apresentarCambioPorId } from '../servicos/cambio/apresentar.js';
import { apresentarModeloPorId } from '../servicos/modelo/apresentar.js';
import { apresentarCategoriaPorId } from '../servicos/categoria/apresentar.js';
import { apresentarMarcaPorId } from '../servicos/marca/apresentar.js';


async function validarCarro(nome, anoCarro, condicaoCarro, valorCarro,
    ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem,
    id_cor, id_aro, id_categoria, id_marca, id_modelo,
    id_combustivel, id_cambio) {
    if (typeof nome !== 'string' || nome.trim() === '') {
        return {
            status: false,
            mensagem: 'Valor inválido. Deve conter um nome e ser uma string não vazia.',
        };
    }

    const marcaExistente = await apresentarMarcaPorId(id_marca);
    if (marcaExistente.length == 0) {
        return {
            status: false,
            mensagem: `A marca "${id_marca}" não existe.`,
        };
    }

    const categoriaExistente = await apresentarCategoriaPorId(id_categoria);
    if (categoriaExistente.length == 0) {
        return {
            status: false,
            mensagem: `A categoria "${id_categoria}" não existe.`,
        };
    }

    const aroExistente = await apresentarAroPorId(id_aro);
    if (aroExistente.length == 0) {
        return {
            status: false,
            mensagem: `O aro "${id_aro}" não existe.`,
        };
    }

    const corExistente = await apresentarCorPorId(id_cor);
    if (corExistente.length == 0) {
        return {
            status: false,
            mensagem: `A cor "${id_cor}" não existe.`,
        };
    }

    const combustivelExistente = await apresentarCombustivelPorId(id_combustivel);
    if (combustivelExistente.length == 0) {
        return {
            status: false,
            mensagem: `O combustível "${id_combustivel}" não existe.`,
        };
    }

    const cambioExistente = await apresentarCambioPorId(id_cambio);
    if (cambioExistente.length == 0) {
        return {
            status: false,
            mensagem: `O câmbio "${id_cambio}" não existe.`,
        };
    }

    const modeloExistente = await apresentarModeloPorId(id_modelo);
    if (modeloExistente.length == 0) {
        return {
            status: false,
            mensagem: `O modelo "${id_modelo}" não existe.`,
        };
    }

    const anoValidacao = /^\d{4}$/.test(anoCarro);
    if (!anoValidacao) {
        return {
            status: false,
            mensagem: `O ano "${anoCarro}" não é válido.`,
        };
    }

    const condicaoValidacao = /^(Novo|Usado|Semi-novo)$/.test(condicaoCarro);
    if (!condicaoValidacao) {
        return {
            status: false,
            mensagem: `A condição "${condicaoCarro}" não é válida.`,
        };
    }

    const valorValidacao = /^\d+(\.\d{1,2})?$/.test(valorCarro);
    if (!valorValidacao) {
        return {
            status: false,
            mensagem: `O valor "${valorCarro}" não é válido.`,
        };
    }

    const ipvaPagoValidacao = /^(1|0)$/.test(ipvaPago);
    if (!ipvaPagoValidacao) {
        return {
            status: false,
            mensagem: `O IPVA "${ipvaPago}" não é válido.`,
        };
    }

    const dataIpvaValidacao = /^\d{4}-\d{2}-\d{2}$/.test(dataIpva);
    if (!dataIpvaValidacao) {
        return {
            status: false,
            mensagem: `A data do IPVA "${dataIpva}" não é válida.`,
        };
    }

    const dataCompraValidacao = /^\d{4}-\d{2}-\d{2}$/.test(dataCompra);
    if (!dataCompraValidacao) {
        return {
            status: false,
            mensagem: `A data da compra "${dataCompra}" não é válida.`,
        };
    }

    const detalhesVeiculoValidacao = typeof detalhesVeiculo === 'string' && detalhesVeiculo.trim() !== '';
    if (!detalhesVeiculoValidacao) {
        return {
            status: false,
            mensagem: `Os detalhes do veículo "${detalhesVeiculo}" não são válidos.`,
        };
    }

    const blindagemValidacao = /^(1|0)$/.test(blindagem);
    if (!blindagemValidacao) {
        return {
            status: false,
            mensagem: `A blindagem "${blindagem}" não é válida.`,
        };
    }

    

    return { status: true, mensagem: '' };
}

export { validarCarro }