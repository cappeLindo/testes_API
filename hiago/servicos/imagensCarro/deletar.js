import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Isso funciona para ES Modules, que parece ser o seu caso
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


let codigoErro;

function deletarArquivoImagem(nomeArquivo) {
    const caminho = path.resolve(__dirname, '../../uploads', nomeArquivo);

    fs.unlink(caminho, (err) => {
        if (err) {
            console.error('Erro ao deletar arquivo físico:', err.message);
        } else {
            //console.log(`Imagem ${nomeArquivo} deletada da pasta uploads.`);
        }
    });
}



async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        //console.log('Executando SQL:', sql, 'com params:', params); // DEBUG
        const [resultado] = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
            codigoErro = 409;
            throw new AppError(
                'Não é possível excluir o registro porque ele está sendo referenciado por outros dados.',
                codigoErro,
                'FOREIGN_KEY_CONSTRAINT',
                error.message
            );
        }
        codigoErro = 500;
        throw new AppError('Erro ao executar o comando', codigoErro, 'DB_EXEC_ERROR', error.message);
    } finally {
        if (conexao) conexao.release();
    }
}

async function deletarImagem(id) {
    try {
        id = parseInt(id, 10);
        
        // Primeiro busca o nome do arquivo
        const sqlSelect = "SELECT nome_imagensCarro FROM imagensCarro WHERE id_imagensCarro = ?";
        const imagemPesquisada = await executarQuery(sqlSelect, [id]);
        
        if (imagemPesquisada.length === 0) {
            throw new AppError('Imagem não encontrada', 404, 'IMAGEM_NAO_ENCONTRADA');
        }

        // Depois deleta do banco
        const sqlDelete = "DELETE FROM imagensCarro WHERE id_imagensCarro = ?";
        await executarQuery(sqlDelete, [id]);

        for (const imagem of imagemPesquisada) {
            deletarArquivoImagem(imagem.nome_imagensCarro);
        }


        return { sucesso: true };
    } catch (error) {
        throw new AppError('Erro ao deletar imagem', codigoErro, 'IMAGEM_DELETE_ERROR', error.message);
    }
}


async function deletarImagemAnuncio(id) {
    try {
        id = parseInt(id, 10);

        const sqlSelect = "SELECT nome_imagensCarro FROM imagensCarro WHERE anuncioCarro_id_anuncioCarro = ?";
        const imagens = await executarQuery(sqlSelect, [id]);

        const sqlDelete = "DELETE FROM imagensCarro WHERE anuncioCarro_id_anuncioCarro = ?";
        await executarQuery(sqlDelete, [id]);

        for (const imagem of imagens) {
            deletarArquivoImagem(imagem.nome_imagensCarro);
        }

        return { sucesso: true };
    } catch (error) {
        throw new AppError('Erro ao deletar imagens relacionadas ao anúncio', codigoErro, 'IMAGEM_ANUNCIO_DELETE_ERROR', error.message);
    }
}



export { deletarImagem, deletarImagemAnuncio }
