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


const routeAnuncioCarro = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

        if (nome) {
            const resultado = await apresentarCarroPorNome(nome);
            if (!resultado.length) {
                throw new AppError('Carro com esse nome não encontrado', 404, 'CARRO_NOT_FOUND');
            }
            res.status(200).json(resultado);
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
            res.status(200).json(resultado);
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