import { conexao } from "../db.js";
import { query } from 'express';
var mensagem;
export default function adicionarVeiculo(nomeAnuncio, anoCarro, condicaoCarro, valorCarro, ipvaPago, dataIpva,
    dataCompra, detalhesVeiculo, blindagem, idCor, idAro, idCategoria,
    idMarca, idModelo, idCombustivel, idCambio, idConcessionaria, nomeImagens) {
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
    ], (err, resultado) => {
        if (err) {
            mensagem = 'Erro ao executar a query:', err;
            mensagem = 'Erro ao enviar dados do veículo.';
            return;
        }

        // Recuperando o ID do veículo recém-inserido
        const idAnuncioCarro = resultado.insertId;

        const listaNomesImagens = nomeImagens.split(',');
        for (let i = 0; i < listaNomesImagens.length; i++) {
            const nomeImagem = listaNomesImagens[i];
            const queryImagem = 'INSERT INTO imagensCarro (nome_imagensCarro, anuncioCarro_id_anuncioCarro) VALUES (?, ?);';

            conexao.query(queryImagem, [nomeImagem, idAnuncioCarro], (err) => {
                if (err) {
                    mensagem = `Erro ao inserir a imagem ${nomeImagem}:`, err;
                } else {
                }
            });
        }

        // Respondendo ao cliente
        mensagem = `Veículo e imagens adicionados com sucesso! ${idAnuncioCarro}`
    });
    return mensagem
};