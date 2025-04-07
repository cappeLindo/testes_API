import express, { json, query, Router } from 'express'
import { adicionarVeiculo, adicionarFiltro } from '../servicos/adicionarDados.js'
const routerAdicionar = express.Router()

routerAdicionar.post('/adicionarCarro', (req, res) => {
    const nomeAnuncio = req.query.nomeAnuncio;
    const anoCarro = req.query.anoCarro;
    const condicaoCarro = req.query.condicaoCarro;
    const valorCarro = req.query.valorCarro;
    const ipvaPago = req.query.ipvaPago;
    const dataIpva = req.query.dataIpva;
    const dataCompra = req.query.dataCompra;
    const detalhesVeiculo = req.query.detalhesVeiculo;
    const blindagem = req.query.blindagem;
    const idCor = req.query.idCor;
    const idAro = req.query.idAro;
    const idCategoria = req.query.idCategoria;
    const idMarca = req.query.idMarca;
    const idModelo = req.query.idModelo;
    const idCombustivel = req.query.idCombustivel;
    const idCambio = req.query.idCambio;
    const idConcessionaria = req.query.idConcessionaria;
    const nomeImagens = req.query.nomeImagens;
    var mensagem;
    mensagem = adicionarVeiculo(nomeAnuncio, anoCarro, condicaoCarro, valorCarro, ipvaPago, dataIpva,
        dataCompra, detalhesVeiculo, blindagem, idCor, idAro, idCategoria,
        idMarca, idModelo, idCombustivel, idCambio, idConcessionaria, nomeImagens)
    res.json(mensagem)
})

routerAdicionar.post('/adicionarFiltro', (req, res) => {
    const nomeFiltro = req.query.nomeFiltro;
    const anoCarroFiltro = req.query.anoCarroFiltro;
    const condicaoCarroFiltro = req.query.condicaoCarroFiltro;
    const ipvaPagoFiltro = req.query.ipvaPagoFiltro;
    const blindagemFiltro = req.query.blindagemFiltro;
    const dataIpvaFiltro = req.query.dataIpvaFiltro;
    const dataCompraFiltro = req.query.dataCompraFiltro;
    const valorMaxFiltro = req.query.valorMaxFiltro;
    const valorMinFiltro = req.query.valorMinFiltro;
    const idCorFiltro = req.query.idCorFiltro;
    const idCambioFiltro = req.query.idCambioFiltro;
    const idAroFiltro = req.query.idAroFiltro;
    const idCategoriaFiltro = req.query.idCategoriaFiltro;
    const idMarcaFiltro = req.query.idMarcaFiltro;
    const idCombustivelFiltro = req.query.idCombustivelFiltro;
    const idClient = req.query.idClient;
    const idModeloFiltro = req.query.idModeloFiltro;
    var mensagem;
    mensagem = adicionarFiltro(nomeFiltro, anoCarroFiltro, condicaoCarroFiltro, ipvaPagoFiltro, blindagemFiltro, dataIpvaFiltro, dataCompraFiltro, valorMaxFiltro, valorMinFiltro, idCorFiltro, idCambioFiltro, idAroFiltro,idCategoriaFiltro, idMarcaFiltro, idCombustivelFiltro, idClient, idModeloFiltro)
    res.json(mensagem)
})

export default routerAdicionar