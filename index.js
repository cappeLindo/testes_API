import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUI from "swagger-ui-express";
import fs from "fs";
import { apresentarImagemPorId } from "./hiago/servicos/imagensCarro/apresentar.js";

const swaggerDocumentation = JSON.parse(fs.readFileSync("./swagger-output.json", "utf-8"));

import errorHandler from "./middlewares/errorHandler.js";

import routerAro from "./hiago/rotas/aro.js";
import routerCambio from "./hiago/rotas/cambio.js";
import routerCategoria from "./hiago/rotas/categoria.js";
import routerCombustivel from "./hiago/rotas/combustivel.js";
import routerCor from "./hiago/rotas/cor.js";
import routerMarca from "./hiago/rotas/marca.js";
import routerModelo from "./hiago/rotas/modelo.js";
import routerAnuncioCarro from "./hiago/rotas/anuncioCarro.js";
import routerFiltroAlerta from "./nathan/rotas/routeFiltroAlerta.js";
import routerCliente from "./cappe/rotas/cliente.js";
import routerConcessionaria from "./carlos/rotas/concessionaria.js";

const porta = 9000;
const app = express();
app.use(cors());

app.use(express.json());

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation, {
    explorer: true,
    swaggerOptions: {
        docExpansion: 'none',
        defaultModelsExpandDepth: -1,
    }
}));

app.use('/aro', routerAro);
app.use('/cambio', routerCambio);
app.use('/categoria', routerCategoria);
app.use('/combustivel', routerCombustivel);
app.use('/cor', routerCor);
app.use('/marca', routerMarca);
app.use('/modelo', routerModelo);
app.use('/carro', routerAnuncioCarro);
app.use('/filtro-alerta', routerFiltroAlerta);
app.use('/cliente', routerCliente);
app.use('/concessionaria', routerConcessionaria);

app.get('/carro/imagem/:idImagem', async (req, res) => {
    // #swagger.tags = ['Carro']
    // #swagger.description = 'Retorna a imagem de um carro pelo ID da imagem'
    // #swagger.parameters['idImagem'] = { in: 'path', description: 'ID da imagem do carro', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Imagem do carro encontrada com sucesso', schema: { type: 'string', format: 'binary' } }
    // #swagger.responses[404] = { description: 'Imagem não encontrada' }
    // #swagger.responses[500] = { description: 'Erro interno ao buscar a imagem' }

    const { idImagem } = req.params;
    try {
        const [resultado] = await apresentarImagemPorId(idImagem);

        if (!resultado || !resultado.arquivo_imagem) {
            return res.status(404).send('Imagem não encontrada');
        }

        res.set('Content-Type', 'image/jpeg');
        res.send(resultado.arquivo_imagem);
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
});

app.use(errorHandler);

app.listen(porta, () => {
    const data = new Date();
    console.log(`Servidor iniciado na porta ${porta} ${data}`);
});