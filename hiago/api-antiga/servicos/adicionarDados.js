import { conexao } from "../config.js";

var mensagem;

// Função para garantir que valores vazios sejam tratados como NULL
function tratarValor(valor) {
    return valor === undefined || valor === null || valor === '' ? null : valor;
}

function adicionarVeiculo(nomeAnuncio, anoCarro, condicaoCarro, valorCarro, ipvaPago, dataIpva,
    dataCompra, detalhesVeiculo, blindagem, idCor, idAro, idCategoria,
    idMarca, idModelo, idCombustivel, idCambio, idConcessionaria, nomeImagens) {

    // Tratando os valores para garantir que vazios se tornem NULL
    nomeAnuncio = tratarValor(nomeAnuncio);
    anoCarro = tratarValor(anoCarro);
    condicaoCarro = tratarValor(condicaoCarro);
    valorCarro = tratarValor(valorCarro);
    ipvaPago = tratarValor(ipvaPago);
    dataIpva = tratarValor(dataIpva);
    dataCompra = tratarValor(dataCompra);
    detalhesVeiculo = tratarValor(detalhesVeiculo);
    blindagem = tratarValor(blindagem);
    idCor = tratarValor(idCor);
    idAro = tratarValor(idAro);
    idCategoria = tratarValor(idCategoria);
    idMarca = tratarValor(idMarca);
    idModelo = tratarValor(idModelo);
    idCombustivel = tratarValor(idCombustivel);
    idCambio = tratarValor(idCambio);
    idConcessionaria = tratarValor(idConcessionaria);

    // Query de inserção do veículo
    const adicionarVeiculoBD = `
        INSERT INTO \`Web-Cars\`.\`anuncioCarro\`
        (\`nome_anuncioCarro\`, \`ano\`, \`condicao\`, \`valor\`, \`ipva_pago\`, \`data_ipva\`,
         \`data_compra\`, \`detalhes_veiculo\`, \`blindagem\`, \`cor_id_cor\`, \`aro_id_aro\`,
         \`categoria_id_categoria\`, \`marca_id_marca\`, \`modelo_id_modelo\`, 
         \`combustivel_id_combustivel\`, \`cambio_id_cambio\`, \`concessionaria_id_concessionaria\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    // Executando a query de inserção do veículo
    conexao.query(adicionarVeiculoBD, [
        nomeAnuncio, anoCarro, condicaoCarro, valorCarro, ipvaPago, dataIpva,
        dataCompra, detalhesVeiculo, blindagem, idCor, idAro, idCategoria,
        idMarca, idModelo, idCombustivel, idCambio, idConcessionaria
    ], function (err, resultado) {
        if (err) {
            mensagem = 'Erro ao executar a query: ' + err;
            return;
        }

        // Recuperando o ID do veículo recém-inserido
        const idAnuncioCarro = resultado.insertId;

        // Separando os nomes das imagens
        const listaNomesImagens = nomeImagens.split(',');

        // Inserindo as imagens uma por uma
        for (let i = 0; i < listaNomesImagens.length; i++) {
            const nomeImagem = listaNomesImagens[i];

            const queryImagem = 'INSERT INTO imagensCarro (nome_imagensCarro, anuncioCarro_id_anuncioCarro) VALUES (?, ?);';

            conexao.query(queryImagem, [nomeImagem, idAnuncioCarro], function (err) {
                if (err) {
                    mensagem = 'Erro ao inserir a imagem ' + nomeImagem + ': ' + err;
                    return;
                }
            });
        }

        // Mensagem de sucesso
        mensagem = 'Veículo e imagens adicionados com sucesso! ID do anúncio: ' + idAnuncioCarro;
    });

    return mensagem;
};

function adicionarFiltro(nomeFiltro, anoCarroFiltro, condicaoCarroFiltro, ipvaPagoFiltro, blindagemFiltro, dataIpvaFiltro, dataCompraFiltro, valorMaxFiltro, valorMinFiltro, idCorFiltro, idCambioFiltro, idAroFiltro,idCategoriaFiltro, idMarcaFiltro, idCombustivelFiltro, idClient, idModeloFiltro) {

    // Tratando os valores para garantir que vazios se tornem NULL
    nomeFiltro = tratarValor(nomeFiltro);
    anoCarroFiltro = tratarValor(anoCarroFiltro);
    condicaoCarroFiltro = tratarValor(condicaoCarroFiltro);
    ipvaPagoFiltro = tratarValor(ipvaPagoFiltro);
    blindagemFiltro = tratarValor(blindagemFiltro);
    dataIpvaFiltro = tratarValor(dataIpvaFiltro);
    dataCompraFiltro = tratarValor(dataCompraFiltro);
    valorMaxFiltro = tratarValor(valorMaxFiltro);
    valorMinFiltro = tratarValor(valorMinFiltro);
    idCorFiltro = tratarValor(idCorFiltro);
    idCambioFiltro = tratarValor(idCambioFiltro);
    idAroFiltro = tratarValor(idAroFiltro);
    idCategoriaFiltro = tratarValor(idCategoriaFiltro);
    idMarcaFiltro = tratarValor(idMarcaFiltro);
    idCombustivelFiltro = tratarValor(idCombustivelFiltro);
    idClient = tratarValor(idClient);
    idModeloFiltro = tratarValor(idModeloFiltro);

    // Query de inserção do filtro de alerta
    const adicionarFiltroBD =  `INSERT INTO \`Web-Cars\`.\`filtroAlerta\` (\`nome_filtroAlerta\`, \`ano\`, \`condicao\`, \`ipva_pago\`, \`blindagem\`, \`data_ipva\`, \`data_compra\`, \`valor_maximo\`, \`valor_minimo\`, \`cor_id_cor\`, \`cambio_id_cambio\`, \`aro_id_aro\`, \`categoria_id_categoria\`, \`marca_id_marca\`, \`cliente_id_cliente\`, \`combustivel_id_combustivel\`, \`modelo_id_modelo\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    // Executando a query de inserção do filtro
    conexao.query(adicionarFiltroBD, [
        nomeFiltro, anoCarroFiltro, condicaoCarroFiltro, ipvaPagoFiltro, blindagemFiltro, dataIpvaFiltro, dataCompraFiltro, valorMaxFiltro, valorMinFiltro, idCorFiltro, idCambioFiltro, idAroFiltro, idCategoriaFiltro, idMarcaFiltro, idCombustivelFiltro, idClient, idModeloFiltro
    ], function (err, resultado) {
        if (err) {
            mensagem = 'Erro ao executar a query: ' + err;
            return;
        }
        const idFiltroAlerta = resultado.insertId;
        mensagem = 'Filtro de alerta adicionado com sucesso! ID do filtro: ' + idFiltroAlerta;
    });

    return mensagem;
};

export { adicionarVeiculo, adicionarFiltro };
