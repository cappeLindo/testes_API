import express from 'express';
import { apresentarModelo, apresentarModeloPorId, apresentarModeloPorNome, apresentarModeloPorIdCategoria, apresentarModeloPorIdMarca, apresentarModeloPorNomeCategoria, apresentarModeloPorNomeMarca } from '../servicos/modelo/apresentar.js';
//import { adicionarModelo } from '../servicos/modelo/adicionar.js';
import AppError from '../utils/AppError.js';
//import { validarModelo } from '../validacao/validarModelo.js';
//import { deletarModelo } from '../servicos/modelo/deletar.js';
//import { editarModelo } from '../servicos/modelo/editar.js';

const routerModelo = express.Router();

/*routerModelo.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        if (isNaN(id)) {
            throw new AppError('ID inválido', 400, 'INVALID_ID');
        }
    
        if (nome === undefined) {
            throw new AppError('Nome do modelo é obrigatório', 400, 'MISSING_NAME');
        }
    
        const nomeValido = await validarModelo(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        const resultado = await editarModelo(id, nome);

        if (resultado.affectedRows === 0) {
            throw new AppError('Modelo não encontrado', 404, 'MODELO_NOT_FOUND');
        }

        return res.status(200).send("Modelo editado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        // Aqui você pode usar next(error) se tiver um middleware global de tratamento de erros
        throw new AppError('Erro ao editar modelo', 500, 'MODELO_EDIT_ERROR', error.message);
    }
});

routerModelo.post('/', async (req, res) => {
    const { nome } = req.body;

    try {
        if (!nome) {
            throw new AppError('Nome e valor da modelo é obrigatório.', 400, 'MISSING_DATA');
        }
    
        const nomeValido = await validarModelo(nome);

        if (!nomeValido.status) {
            throw new AppError('O valor é inválido.', 400, 'INVALID_VALUE', nomeValido.mensagem);
        }

        await adicionarModelo(nome);

        return res.status(201).send("Modelo cadastrado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }
});

routerModelo.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await deletarModelo(id);
        if (resultado.affectedRows === 0) {
            throw new AppError('MODELO não encontrado', 404, 'MODELO_NOT_FOUND');
        }
        res.status(200).send("MODELO deletado com sucesso!");
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Erro interno do servidor.', 500, 'INTERNAL_ERROR', error.message);
    }

});
*/

routerModelo.get('/', async (req, res) => {
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarModeloPorNome(nome);
        if (!resultado.length) {
            throw new AppError('Modelo com esse nome não encontrado', 404, 'MODELO_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});

routerModelo.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarModeloPorId(id);
        if (!resultado.length) {
            throw new AppError('Modelo não encontrado', 404, 'MODELO_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});

routerModelo.get('/marca/', async (req, res) => {
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarModeloPorNomeMarca(nome);
        if (!resultado.length) {
            throw new AppError('Modelo com a marca com esse nome não encontrado', 404, 'MODELO_MARCA_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});

routerModelo.get('/marca/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarModeloPorIdMarca(id);
        if (!resultado.length) {
            throw new AppError('Modelo com essa marca não encontrado', 404, 'MODELO_MARCA_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});

routerModelo.get('/categoria/', async (req, res) => {
    const { nome } = req.query;
    if (nome) {
        const resultado = await apresentarModeloPorNomeCategoria(nome);
        if (!resultado.length) {
            throw new AppError('Modelo com essa categoria com esse nome não encontrado', 404, 'MODELO_CATEGORIA_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});

routerModelo.get('/categoria/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
        const resultado = await apresentarModeloPorIdCategoria(id);
        if (!resultado.length) {
            throw new AppError('Modelo com essa categoria não encontrado', 404, 'MODELO_CATEGORIA_NOT_FOUND');
        }
        res.status(200).json(resultado);
    } else {
        const resultado = await apresentarModelo();
        res.status(200).json(resultado);
    }
});



export default routerModelo;