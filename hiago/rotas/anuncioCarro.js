import express from 'express';
import AppError from '../utils/AppError.js';
import upload from '../../middlewares/multerConfig.js';


import { validarCarro } from '../validacao/validarCarro.js';

import { apresentarCarro, apresentarCarroPorNome, apresentarCarroPorID } from '../servicos/anuncioCarro/apresentar.js';
import { adicionarCarro } from '../servicos/anuncioCarro/adicionar.js';
import { deletarAnuncioCarro } from '../servicos/anuncioCarro/deletar.js';
import { editarAnuncioCarro, editarAnuncioCarroParcial } from '../servicos/anuncioCarro/editar.js';

import { deletarImagemAnuncio, deletarImagem } from '../servicos/imagensCarro/deletar.js';
import { adicionarImagem } from '../servicos/imagensCarro/adicionar.js';
import { apresentarImagemPorId, apresentarImagemPorNome, apresentarImagemPorIdAnuncio } from '../servicos/imagensCarro/apresentar.js';

const routeAnuncioCarro = express.Router();


routeAnuncioCarro.put('/:id', upload.array('imagensCarro', 7), async (req, res) => {
    // #swagger.tags = ['Carro']
    // #swagger.description = 'Atualiza um carro pelo ID'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID do carro', required: true, type: 'integer' }
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

    const { id } = req.params;
    const {
        nomeCarro, anoCarro, condicaoCarro, valorCarro,
        ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem,
        idCor, idAro, idCategoria, idMarca, idModelo,
        idCombustivel, idCambio
    } = req.body;
    const arquivosRecebidos = req.files;

    try {
        // Validação dos campos obrigatórios
        if (
            !nomeCarro || !anoCarro || !condicaoCarro || !valorCarro ||
            ipvaPago === undefined || !dataIpva || !dataCompra || !detalhesVeiculo ||
            blindagem === undefined || !idCor || !idAro || !idCategoria ||
            !idMarca || !idModelo || !idCombustivel || !idCambio
        ) {
            throw new AppError('Todos os campos são obrigatórios.', 400, 'MISSING_DATA');
        }

        if (!arquivosRecebidos || arquivosRecebidos.length < 1) {
            throw new AppError('É necessário pelo menos uma imagem.', 400, 'MIN_IMAGES_REQUIRED');
        }

        if (arquivosRecebidos.length > 7) {
            throw new AppError('Número máximo de imagens é 7.', 400, 'MAX_IMAGES_EXCEEDED');
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

        const resultado = await editarAnuncioCarro(
            nomeCarro, anoCarro, condicaoCarro, valorCarro,
            ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem,
            idCor, idAro, idCategoria, idMarca, idModelo,
            idCombustivel, idCambio, id
        );

        if (resultado.affectedRows === 0) {
            throw new AppError('Carro não encontrado', 404, 'CARRO_NOT_FOUND');
        }

        // Deleta imagens antigas
        await deletarImagemAnuncio(id);

        // Adiciona novas imagens
        for (let i = 0; i < arquivosRecebidos.length; i++) {
            const file = arquivosRecebidos[i];
            const nomeFinal = `${Date.now()}-${i}-${file.originalname}`;
            await adicionarImagem(nomeFinal, id, file.buffer);
        }

        return res.status(200).json({ mensagem: 'Registro atualizado com sucesso.' });
    } catch (error) {
        next(error);
    }
});




routeAnuncioCarro.patch('/:id', upload.array('imagensCarro', 7), async (req, res, next) => {
    // #swagger.tags = ['Carro']
    // #swagger.description = 'Atualiza um carro pelo ID fornecido pelo usuario'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID do carro', required: true, type: 'integer' }
    // #swagger.parameters['imagensCarro'] = { in: 'formData', type: 'file', required: false, description: 'Imagens do carro' }
    // #swagger.parameters['nomeCarro'] = { in: 'formData', type: 'string', required: false, description: 'Nome do carro' }
    // #swagger.parameters['anoCarro'] = { in: 'formData', type: 'integer', required: false, description: 'Ano do carro' }
    // #swagger.parameters['condicaoCarro'] = { in: 'formData', type: 'string', required: false, description: 'Condição do carro' }
    // #swagger.parameters['valorCarro'] = { in: 'formData', type: 'number', required: false, description: 'Valor do carro' }
    // #swagger.parameters['ipvaPago'] = { in: 'formData', type: 'boolean', required: false, description: 'IPVA pago' }
    // #swagger.parameters['dataIpva'] = { in: 'formData', type: 'string', required: false, description: 'Data do IPVA' }
    // #swagger.parameters['dataCompra'] = { in: 'formData', type: 'string', required: false, description: 'Data da compra' }
    // #swagger.parameters['detalhesVeiculo'] = { in: 'formData', type: 'string', required: false, description: 'Detalhes do veículo' }
    // #swagger.parameters['blindagem'] = { in: 'formData', type: 'boolean', required: false, description: 'Blindagem' }
    // #swagger.parameters['idCor'] = { in: 'formData', type: 'integer', required: false, description: 'ID da cor' }
    // #swagger.parameters['idAro'] = { in: 'formData', type: 'integer', required: false, description: 'ID do aro' }
    // #swagger.parameters['idCategoria'] = { in: 'formData', type: 'integer', required: false, description: 'ID da categoria' }
    // #swagger.parameters['idMarca'] = { in: 'formData', type: 'integer', required: false, description: 'ID da marca' }
    // #swagger.parameters['idModelo'] = { in: 'formData', type: 'integer', required: false, description: 'ID do modelo' }
    // #swagger.parameters['idCombustivel'] = { in: 'formData', type: 'integer', required: false, description: 'ID do combustível' }
    // #swagger.parameters['idCambio'] = { in: 'formData', type: 'integer', required: false, description: 'ID do câmbio' }
    // #swagger.parameters['idConcessionaria'] = { in: 'formData', type: 'integer', required: false, description: 'ID da concessionária' }
    // #swagger.parameters['imagensExcluidas'] = { in: 'formData', type: 'array', required: false, description: 'Imagens a serem excluídas' }
    // #swagger.parameters['imagensExcluidas[].id'] = { in: 'formData', type: 'integer', required: false, description: 'ID da imagem a ser excluída' }
    try {
        const { id } = req.params;
        const arquivosRecebidos = req.files;

        const {
            nomeCarro, anoCarro, condicaoCarro, valorCarro,
            ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem,
            idCor, idAro, idCategoria, idMarca, idModelo,
            idCombustivel, idCambio, idConcessionaria,
            imagensExcluidas // Deve vir como JSON string
        } = req.body;

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

        if (Object.keys(camposAtualizar).length === 0 && arquivosRecebidos.length === 0 && !imagensExcluidas) {
            throw new AppError('Nada para atualizar.', 400, 'NO_UPDATE_DATA');
        }

        const resultado = await editarAnuncioCarroParcial(id, camposAtualizar);
        if (resultado.affectedRows === 0) {
            throw new AppError('Carro não encontrado.', 404, 'CARRO_NOT_FOUND');
        }

        // Exclui imagens, se solicitado
        if (imagensExcluidas) {
            let imagensArray;
        
            try {
                if (Array.isArray(imagensExcluidas)) {
                    imagensArray = imagensExcluidas;
                } else if (typeof imagensExcluidas === 'string') {
                    // Tenta converter de JSON ou string separada por vírgula
                    try {
                        imagensArray = JSON.parse(imagensExcluidas);
                    } catch {
                        imagensArray = imagensExcluidas.split(',').map(id => parseInt(id.trim()));
                    }
                } else {
                    throw new Error();
                }
        
                for (const id of imagensArray) {
                    if (!isNaN(id)) await deletarImagem(id);
                }
        
            } catch {
                throw new AppError('Formato inválido para imagensExcluidas', 400, 'INVALID_JSON');
            }
        }        

        // Adiciona novas imagens
        if (arquivosRecebidos.length > 0) {
            for (let i = 0; i < arquivosRecebidos.length; i++) {
                const file = arquivosRecebidos[i];
                const nomeFinal = `${Date.now()}-${i}-${file.originalname}`;
                await adicionarImagem(nomeFinal, id, file.buffer);
            }
        }

        return res.status(200).json({ mensagem: 'Carro atualizado com sucesso (parcial).' });
    } catch (error) {
        next(error);
    }
});


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

routeAnuncioCarro.post('/:idConcessionaria', upload.array('imagensCarro', 7), async (req, res, next) => {
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
        idCombustivel, idCambio
    } = req.body;

    const arquivosRecebidos = req.files;

    const idConcessionaria = req.params.idConcessionaria

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

        for (let i = 0; i < arquivosRecebidos.length; i++) {
            const file = arquivosRecebidos[i];
            const nomeFinal = `${Date.now()}-${i}-${file.originalname}`;
            await adicionarImagem(nomeFinal, resultado.insertId, file.buffer);
        }

        /*res.status(201).json({
            message: 'Carro cadastrado com sucesso!',
            id: resultado.insertId,
            imagensCarro: imagensSalvas
        });*/

        res.status(201).send('Carro cadastrado com sucesso!')

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
                imagens: imagens.map(img => img.id_imagensCarro)
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
            resultado[0].imagens = imagens.map(img => img.id_imagensCarro); // adiciona array de nomes

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