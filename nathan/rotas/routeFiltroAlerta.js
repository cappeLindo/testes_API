import AppError from '../utils/AppError.js';
import { validarFiltroAlerta } from '../validacao/validarFiltroAlerta.js';
import {
    apresentarFiltroAlerta,
    apresentarFiltroAlertaPorID,
    apresentarFiltroAlertaPorNome
} from '../servicos/filtroAlerta/apresentar.js';
import { adicionarFiltroAlerta } from '../servicos/filtroAlerta/adicionar.js';
import { deletarFiltroAlerta } from '../servicos/filtroAlerta/deletar.js';
import { editarFiltroAlerta, editarFiltroAlertaParcial } from '../servicos/filtroAlerta/editar.js';

const routeFiltroAlerta = express.Router();

routeFiltroAlerta.get('/', async (req, res, next) => {
    // #swagger.tags = ['FiltroAlerta']
    // #swagger.description = 'Lista filtros de alerta'
    const { nome } = req.query;
    try {
        const resultado = nome ? await apresentarFiltroAlertaPorNome(nome) : await apresentarFiltroAlerta();
        res.status(200).json(resultado);
    } catch (error) {
        next(new AppError('Erro ao buscar filtros', 500));
    }
});

routeFiltroAlerta.get('/:id', async (req, res, next) => {
    // #swagger.tags = ['FiltroAlerta']
    // #swagger.description = 'Busca filtro por ID'
    const { id } = req.params;
    try {
        const resultado = await apresentarFiltroAlertaPorID(id);
        res.status(200).json(resultado[0]);
    } catch (error) {
        next(new AppError('Filtro não encontrado', 404));
    }
});

routeFiltroAlerta.post('/', async (req, res, next) => {
    // #swagger.tags = ['FiltroAlerta']
    /* #swagger.requestBody = {
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/FiltroAlerta" }
            }
        }
    } */
    try {
        const validacao = await validarFiltroAlerta(req.body);
        if (!validacao.status) throw new AppError(validacao.mensagem, 400);
        
        const resultado = await adicionarFiltroAlerta(req.body);
        res.status(201).json({ id: resultado.insertId });
    } catch (error) {
        next(error);
    }
});

routeFiltroAlerta.put('/:id', async (req, res, next) => {
    // #swagger.tags = ['FiltroAlerta']
    const { id } = req.params;
    try {
        const validacao = await validarFiltroAlerta(req.body);
        if (!validacao.status) throw new AppError(validacao.mensagem, 400);
        
        await editarFiltroAlerta(id, req.body);
        res.status(200).json({ mensagem: 'Atualizado com sucesso' });
    } catch (error) {
        next(error);
    }
});

routeFiltroAlerta.delete('/:id', async (req, res, next) => {
    // #swagger.tags = ['FiltroAlerta']
    const { id } = req.params;
    try {
        await deletarFiltroAlerta(id);
        res.status(200).json({ mensagem: 'Deletado com sucesso' });
    } catch (error) {
        next(error);
    }
});

export default routeFiltroAlerta;