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

const porta = 9000;
const app = express();
app.use(cors());

app.use(express.json());

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation, {
    explorer: true,
    swaggerOptions: {
        docExpansion: 'none', // ou 'list' ou 'full'
        defaultModelsExpandDepth: -1, // oculta modelos
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


app.get('/carro/imagem/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [resultado] = await apresentarImagemPorId(id);

        if (!resultado || !resultado.arquivo_imagem) {
            return res.status(404).send('Imagem não encontrada');
        }

        // Ajuste o Content-Type de acordo com o tipo real da imagem, se possível
        res.set('Content-Type', 'image/jpeg');
        res.send(resultado.arquivo_imagem);
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
});



app.use(errorHandler);

app.listen(porta, () => {
    const data = new Date();
    console.log(`Seridor iniciado na porta ${porta} ${data}`);
});