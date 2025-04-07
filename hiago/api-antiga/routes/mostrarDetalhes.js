import express from 'express';

import { apresentarDadosCarroDetalhadamente, apresentarDadosFiltroDetalhadamente } from '../servicos/apresentarDados.js';

const routerMostrarDetalhes = express.Router();
routerMostrarDetalhes.get('/anuncioCarro/:id?', async (req, res) => {
    const id = req.params.id;
    try {
        const mensagem = await apresentarDadosCarroDetalhadamente(id)
        res.json(mensagem)
    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

routerMostrarDetalhes.get('/anuncioCarro/:id?', async (req, res) => {
    const id = req.params.id;
    try {
        const mensagem = await apresentarDadosCarroDetalhadamente(id)
        res.json(mensagem)
    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

routerMostrarDetalhes.get('/filtroAlerta/:id?', async (req, res) => {
    const id = req.params.id;
    try {
        const mensagem = await apresentarDadosFiltroDetalhadamente(id)
        res.json(mensagem)
    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});



export default routerMostrarDetalhes;
