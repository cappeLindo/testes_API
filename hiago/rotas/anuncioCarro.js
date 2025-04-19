import express from 'express';
import AppError from '../utils/AppError.js';
import upload from '../upload/multerConfig.js';
import path from 'path';
import fs from 'fs/promises';
import { dirname } from "path";
import { fileURLToPath } from 'url';

import { validarCarro} from '../validacao/validarCarro.js';

import { apresentarCarro, apresentarCarroPorNome, apresentarCarroPorID } from '../servicos/anuncioCarro/apresentar.js';
import { adicionarCarro } from '../servicos/anuncioCarro/adicionar.js';
import { deletarAnuncioCarro } from '../servicos/anuncioCarro/deletar.js';
import { editarAnuncioCarro, editarAnuncioCarroParcial } from '../servicos/anuncioCarro/editar.js';

import { deletarImagemAnuncio } from '../servicos/imagensCarro/deletar.js';
import { adicionarImagem } from '../servicos/imagensCarro/adicionar.js';
import { apresentarImagemPorId, apresentarImagemPorNome, apresentarImagemPorIdAnuncio } from '../servicos/imagensCarro/apresentar.js';

const routeAnuncioCarro = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

routeAnuncioCarro.patch('/:id', upload.array('imagensCarro', 7), async (req, res) => {
    // #swagger.tags = ['Carro']
    // #swagger.description = 'Atualiza um carro pelo ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID do carro', required: true, type: 'integer' }
    // #swagger.parameters['imagensCarro'] = { in: 'formData', type: 'file', required: false, description: 'Imagens do carro' }
    // #swagger.parameters['nomeCarro'] = { in: 'formData', type: 'string', required: false, description: 'Nome do carro' }

    try {
        const { id } = req.params;
        const { nomeCarro, anoCarro, condicaoCarro, valorCarro,
            ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem,
            idCor, idAro, idCategoria, idMarca, idModelo,
            idCombustivel, idCambio, idConcessionaria
        } = req.body;

        const arquivosRecebidos = req.files;
        const camposAtualizar = {};
        if (nomeCarro) camposAtualizar.nome_anuncioCarro = nomeCarro;
        if (anoCarro) camposAtualizar.ano = anoCarro;
        if (condicaoCarro) camposAtualizar.condicao = condicaoCarro;
        if (valorCarro) camposAtualizar.valor = valorCarro;
        if (ipvaPago !== undefined) camposAtualizar.ipva_pago = ipvaPago;
        if (dataIpva) camposAtualizar.data_ipva = dataIpva;
        if (dataCompra) camposAtualizar.data_compra = dataCompra;
        if (detalhesVeiculo) camposAtualizar.detalhes_veiculo = detalhesVeiculo;
        if (blindagem !== undefined) camposAtualizar.blindagem = blindagem;
        if (idCor) camposAtualizar.cor_id_cor = idCor;
        if (idAro) camposAtualizar.aro_id_aro = idAro;
        if (idCategoria) camposAtualizar.categoria_id_categoria = idCategoria;
        if (idMarca) camposAtualizar.marca_id_marca = idMarca;
        if (idModelo) camposAtualizar.modelo_id_modelo = idModelo;
        if (idCombustivel) camposAtualizar.combustivel_id_combustivel = idCombustivel;
        if (idCambio) camposAtualizar.cambio_id_cambio = idCambio;
        if (idConcessionaria) camposAtualizar.concessionaria_id_concessionaria = idConcessionaria;



        if (Object.keys(camposAtualizar).length === 0) {
            throw new AppError('O valor é inválido.', 400, 'MISSING_DATA');
        }

        const validacao = await validarCarro(
            nomeCarro, anoCarro, condicaoCarro, valorCarro,
            ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem,
            idCor, idAro, idCategoria, idMarca, idModelo,
            idCombustivel, idCambio
        );
        if (!validacao.status) {
            throw new AppError(validacao.mensagem, 400, 'VALIDATION_ERROR');
        }

        const resultado = await editarAnuncioCarroParcial(id, camposAtualizar)
        if (resultado.affectedRows > 0) {
            await deletarImagemAnuncio(id);

            const imagensSalvas = [];

            for (let i = 0; i < arquivosRecebidos.length; i++) {
                const file = arquivosRecebidos[i];
                const nomeFinal = `${Date.now()}-${i}-${file.originalname}`;
                const caminhoFinal = path.join(__dirname, '..', 'uploads', nomeFinal);
    
                await fs.writeFile(caminhoFinal, file.buffer);
                imagensSalvas.push(nomeFinal);
            }
    
            imagensSalvas.map(async (imagem) => {
                await adicionarImagem(imagem, id);
            })
            return res.status(200).send("Registro atualizado com sucesso.")
            
        } else {
            throw new AppError('anuncio não encontrado', 404, 'MODELO_NOT_FOUND');
        }
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }
})

routeAnuncioCarro.delete('/:id', async (req, res) => { 
    // #swagger.tags = ['Carro']
    // #swagger.description = 'Deleta um carro pelo ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID do carro', required: true, type: 'integer' }
    const { id } = req.params;
    try {
        if (!id) {
            throw new AppError('ID do carro é obrigatório', 400, 'MISSING_ID');
        }
        await deletarImagemAnuncio(id);
        const resultado = await deletarAnuncioCarro(id);
        if (resultado.affectedRows === 0) {
            throw new AppError('Carro não encontrado', 404, 'CARRO_NOT_FOUND');
        }
        
        res.status(200).json({ message: 'Carro deletado com sucesso!' });
    } catch (error) {
        if (!(error instanceof AppError)) {
            throw new AppError('Erro ao deletar carro', 500, 'CARRO_DELETE_ERROR', error.message);
        }
        throw error;
    }
})

routeAnuncioCarro.post('/', upload.array('imagensCarro', 7), async (req, res, next) => {
    // #swagger.tags = ['Carro']
    // #swagger.description = 'Cadastra um carro'
    // #swagger.parameters['imagensCarro'] = { in: 'formData', type: 'file', required: true, description: 'Imagens do carro' }
    // #swagger.parameters['nomeCarro'] = { in: 'formData', type: 'string', required: true, description: 'Nome do carro' }
    // #swagger.parameters['anoCarro'] = { in: 'formData', type: 'integer', required: true, description: 'Ano do carro' }
    // #swagger.parameters['condicaoCarro'] = { in: 'formData', type: 'string', required: true, description: 'Condição do carro' }
    // #swagger.parameters['valorCarro'] = { in: 'formData', type: 'number', required: true, description: 'Valor do carro' }
    // #swagger.parameters['ipvaPago'] = { in: 'formData', type: 'boolean', required: true, description: 'IPVA pago' }
    // #swagger.parameters['dataIpva'] = { in: 'formData', type: 'string', required: true, description: 'Data do IPVA' }
    // #swagger.parameters['dataCompra'] = { in: 'formData', type: 'string', required: true, description: 'Data da compra' }
    // #swagger.parameters['detalhesVeiculo'] = { in: 'formData', type: 'string', required: true, description: 'Detalhes do veículo' }
    // #swagger.parameters['blindagem'] = { in: 'formData', type: 'boolean', required: true, description: 'Blindagem' }
    // #swagger.parameters['idCor'] = { in: 'formData', type: 'integer', required: true, description: 'ID da cor' }
    // #swagger.parameters['idAro'] = { in: 'formData', type: 'integer', required: true, description: 'ID do aro' }
    // #swagger.parameters['idCategoria'] = { in: 'formData', type: 'integer', required: true, description: 'ID da categoria' }
    // #swagger.parameters['idMarca'] = { in: 'formData', type: 'integer', required: true, description: 'ID da marca' }
    // #swagger.parameters['idModelo'] = { in: 'formData', type: 'integer', required: true, description: 'ID do modelo' }
    // #swagger.parameters['idCombustivel'] = { in: 'formData', type: 'integer', required: true, description: 'ID do combustível' }
    // #swagger.parameters['idCambio'] = { in: 'formData', type: 'integer', required: true, description: 'ID do câmbio' }
    // #swagger.parameters['idConcessionaria'] = { in: 'formData', type: 'integer', required: true, description: 'ID da concessionária' }
    
    const {
        nomeCarro, anoCarro, condicaoCarro, valorCarro,
        ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem,
        idCor, idAro, idCategoria, idMarca, idModelo,
        idCombustivel, idCambio, idConcessionaria
    } = req.body;

    const arquivosRecebidos = req.files;

    try {
        // Verificação de campos obrigatórios
        if (
            !nomeCarro || !anoCarro || !condicaoCarro || !valorCarro ||
            ipvaPago === undefined || !dataIpva || !dataCompra || !detalhesVeiculo ||
            blindagem === undefined || !idCor || !idAro || !idCategoria ||
            !idMarca || !idModelo || !idCombustivel || !idCambio || !idConcessionaria
        ) {
            throw new AppError('Todos os campos são obrigatórios.', 400, 'MISSING_DATA');
        }

        // Verificação de imagens
        if (!arquivosRecebidos || arquivosRecebidos.length < 1) {
            throw new AppError('É necessário pelo menos uma imagem.', 400, 'MIN_IMAGES_REQUIRED');
        }

        if (arquivosRecebidos.length > 7) {
            throw new AppError('Número máximo de imagens é 7.', 400, 'MAX_IMAGES_EXCEEDED');
        }

        // Insere o carro no banco

        const validacao = await validarCarro(
            nomeCarro, anoCarro, condicaoCarro, valorCarro,
            ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem,
            idCor, idAro, idCategoria, idMarca, idModelo,
            idCombustivel, idCambio
        );
        if (!validacao.status) {
            throw new AppError(validacao.mensagem, 400, 'VALIDATION_ERROR');
        }

        const resultado = await adicionarCarro(
            nomeCarro, anoCarro, condicaoCarro, valorCarro,
            ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem,
            idCor, idAro, idCategoria, idMarca, idModelo,
            idCombustivel, idCambio, idConcessionaria
        );

        if (resultado.affectedRows === 0) {
            throw new AppError('Erro ao cadastrar carro', 404, 'CARRO_NOT_FOUND');
        }

        // Salva as imagens no disco após sucesso no banco
        const imagensSalvas = [];

        for (let i = 0; i < arquivosRecebidos.length; i++) {
            const file = arquivosRecebidos[i];
            const nomeFinal = `${Date.now()}-${i}-${file.originalname}`;
            const caminhoFinal = path.join(__dirname, '..', 'uploads', nomeFinal);

            await fs.writeFile(caminhoFinal, file.buffer);
            imagensSalvas.push(nomeFinal);
        }

        imagensSalvas.map(async (imagem) => {
            await adicionarImagem(imagem, resultado.insertId);
        })
        

        res.status(201).json({
            message: 'Carro cadastrado com sucesso!',
            id: resultado.insertId,
            imagensCarro: imagensSalvas
        });

    } catch (error) {
        next(new AppError('Erro ao cadastrar carro', 500, 'CARRO_POST_ERROR', error.message));
    }
});



routeAnuncioCarro.get('/', async (req, res) => {
    // #swagger.tags = ['Carro']
    // #swagger.description = 'Lista todos os carros ou busca por nome'
    // #swagger.parameters['nome'] = { in: 'query', description: 'Nome do carro', required: false, type: 'string' }
    const { nome } = req.query;
    try {
        const resultado = nome ? await apresentarCarroPorNome(nome) : await apresentarCarro();

        if (!resultado.length) {
            throw new AppError('Carro não encontrado', 404, 'CARRO_NOT_FOUND');
        }

        // Adiciona as imagens a cada carro
        const resultadoComImagens = await Promise.all(resultado.map(async (carro) => {
            const imagens = await apresentarImagemPorIdAnuncio(carro.id_anuncioCarro); // ajuste conforme seu campo
            return {
                ...carro,
                imagens: imagens.map(img => img.nome_imagensCarro)
            };
        }));

        res.status(200).json(resultadoComImagens);
    } catch (error) {
        if (!(error instanceof AppError)) {
            throw new AppError('Erro ao apresentar carro', 500, 'CARRO_LIST_ERROR', error.message);
        }
        throw error;
    }
});

routeAnuncioCarro.get('/:id', async (req, res) => {
    // #swagger.tags = ['Carro']
    // #swagger.description = 'Lista todos os carros ou busca por ID'
    // #swagger.parameters['id'] = { in: 'query', description: 'ID do carro', required: false, type: 'integer' }
    const { id } = req.params;
    try {
        if (id) {
            const resultado = await apresentarCarroPorID(id);
            if (!resultado.length) {
                throw new AppError('Carro com esse id não encontrado', 404, 'CARRO_NOT_FOUND');
            }

            // Adiciona as imagens ao carro
            const imagens = await apresentarImagemPorIdAnuncio(id);
            resultado[0].imagens = imagens.map(img => img.nome_imagensCarro); // adiciona array de nomes

            res.status(200).json(resultado[0]);
        } else {
            const resultado = await apresentarCarro();
            res.status(200).json(resultado);
        }
    } catch (error) {
        if (!(error instanceof AppError)) {
            throw new AppError('Erro ao apresentar carro', 500, 'CARRO_LIST_ERROR', error.message);
        }
        throw error;
    }
});


export default routeAnuncioCarro;