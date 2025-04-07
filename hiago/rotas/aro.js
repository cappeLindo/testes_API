import express from 'express';
import { apresentarAro, apresentarAroPorId, apresentarAroPorNome } from '../servicos/aro/apresentar.js';
import { adicionarAro } from '../servicos/aro/adicionar.js';

const routerAro = express.Router();

routerAro.post('/', async (req, res) => {
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ message: 'Nome do aro é obrigatório' });
    }
    
    


    res.status(201).json({ message: 'Aro criado com sucesso' });
});

routerAro.get('/', async (req, res) => {
    const {nome} = req.query;
    if (nome) {
        const resultado = await apresentarAroPorNome(nome);
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarAro();
        res.status(200).json(resultado);
    }
});

routerAro.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarAroPorId(id);
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarAro();
        res.status(200).json(resultado);
    }
});


export default routerAro;