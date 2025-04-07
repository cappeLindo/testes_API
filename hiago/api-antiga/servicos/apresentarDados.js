import { conexao } from "../config.js";
import axios from 'axios';
const rotaPradrao = 'http://localhost:8080/api/';



async function apresentarDadosCarroDetalhadamente(id) {
    const tabelas = ['marca', 'cor', 'aro', 'categoria', 'combustivel', 'modelo', 'concessionaria', 'cambio'];
    let mensagemJson;
    if (!id) {
        const query = 'SELECT * FROM anuncioCarro';
        return new Promise((resolve, reject) => {
            conexao.query(query, async (err, resultado) => {
                if (err) {
                    console.error('Erro ao executar a query:', err);
                    mensagemJson = { error: 'Erro ao buscar dados.' };
                    return reject(mensagemJson);
                }

                for (const tabela of tabelas) {
                    for (const item of resultado) {
                        try {
                            const response = await axios.get(`${rotaPradrao}${tabela}/${item[`${tabela}_id_${tabela}`]}`);
                            item[`${tabela}_id_${tabela}`] = response.data[`nome_${tabela}`];
                        } catch (error) {
                            console.error('Erro ao buscar dados da API externa:', error);
                            item[`${tabela}_id_${tabela}`] = null;
                        }
                    }
                }

                for (const item of resultado) {
                    try {
                        const resposta = await axios.get(`${rotaPradrao}imagens/${item[`id_anuncioCarro`]}`);
                        item.imagens =  resposta.data.map((imagem) => imagem.nome_imagensCarro);
                    } catch (error) {
                        console.error('Erro ao buscar dados da API externa:', error);
                        item[`imagens`] = null;
                    }
                }

                mensagemJson = resultado;
                resolve(mensagemJson);
            });
        });
    } else {
        if (isNaN(id)) {
            mensagemJson = { error: 'ID inválido. Deve ser um número.' };
            return mensagemJson;
        }

        const query = 'SELECT * FROM anuncioCarro WHERE id_anuncioCarro = ?';
        return new Promise((resolve, reject) => {
            conexao.query(query, [id], async (err, resultado) => {
                if (err) {
                    console.error('Erro ao executar a query:', err);
                    mensagemJson = { error: 'Erro ao buscar dados.' };
                    return reject(mensagemJson);
                }

                if (resultado.length === 0) {
                    mensagemJson = { error: 'Registro não encontrado.' };
                    return resolve(mensagemJson);
                }

                for (const tabela of tabelas) {
                    try {
                        const response = await axios.get(`${rotaPradrao}${tabela}/${resultado[0][`${tabela}_id_${tabela}`]}`);
                        resultado[0][`${tabela}_id_${tabela}`] = response.data[`nome_${tabela}`];
                    } catch (error) {
                        console.error('Erro ao buscar dados da API externa:', error);
                        resultado[0][`${tabela}_id_${tabela}`] = null;
                    }
                }

                for (const item of resultado) {
                    try {
                        const resposta = await axios.get(`${rotaPradrao}imagens/${item[`id_anuncioCarro`]}`);
                        item.imagens =  resposta.data.map((imagem) => imagem.nome_imagensCarro);
                    } catch (error) {
                        console.error('Erro ao buscar dados da API externa:', error);
                        item[`imagens`] = null;
                    }
                }

                mensagemJson = resultado[0];
                resolve(mensagemJson);
            });
        });
    }
}


async function apresentarDadosFiltroDetalhadamente(id) {
    const tabelas = ['marca', 'cor', 'aro', 'categoria', 'combustivel', 'modelo', 'cambio'];
    let mensagemJson;
    if (!id) {
        const query = 'SELECT * FROM filtroAlerta';
        return new Promise((resolve, reject) => {
            conexao.query(query, async (err, resultado) => {
                if (err) {
                    console.error('Erro ao executar a query:', err);
                    mensagemJson = { error: 'Erro ao buscar dados.' };
                    return reject(mensagemJson);
                }

                for (const tabela of tabelas) {
                    for (const item of resultado) {
                        try {
                            const response = await axios.get(`${rotaPradrao}${tabela}/${item[`${tabela}_id_${tabela}`]}`);
                            item[`${tabela}_id_${tabela}`] = response.data[`nome_${tabela}`];
                        } catch (error) {
                            console.error('Erro ao buscar dados da API externa:', error);
                            item[`${tabela}_id_${tabela}`] = null;
                        }
                    }
                }

                mensagemJson = resultado;
                resolve(mensagemJson);
            });
        });
    } else {
        if (isNaN(id)) {
            mensagemJson = { error: 'ID inválido. Deve ser um número.' };
            return mensagemJson;
        }

        const query = 'SELECT * FROM filtroAlerta WHERE id_filtroAlerta = ?';
        return new Promise((resolve, reject) => {
            conexao.query(query, [id], async (err, resultado) => {
                if (err) {
                    console.error('Erro ao executar a query:', err);
                    return reject(mensagemJson);
                }

                if (resultado.length === 0) {
                    mensagemJson = { error: 'Registro não encontrado.' };
                    return resolve(mensagemJson);
                }

                for (const tabela of tabelas) {
                    try {
                        const response = await axios.get(`${rotaPradrao}${tabela}/${resultado[0][`${tabela}_id_${tabela}`]}`);
                        resultado[0][`${tabela}_id_${tabela}`] = response.data[`nome_${tabela}`];
                    } catch (error) {
                        console.error('Erro ao buscar dados da API externa:', error);
                        resultado[0][`${tabela}_id_${tabela}`] = null;
                    }
                }

                mensagemJson = resultado[0];
                resolve(mensagemJson);
            });
        });
    }
}

export { apresentarDadosCarroDetalhadamente, apresentarDadosFiltroDetalhadamente };
