import express from "express";
import cors from "cors";

import swaggerUI from "swagger-ui-express";
import fs from "fs";

const swaggerDocumentation = JSON.parse(fs.readFileSync("./swagger-output.json", "utf-8"));


import errorHandler from "./middlevares/errorHandler.js";

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

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation, {
    explorer: true,
    swaggerOptions: {
        docExpansion: 'none', // ou 'list' ou 'full'
        defaultModelsExpandDepth: -1, // oculta modelos
    }
}));

app.use('/api/aro', routerAro);
app.use('/api/cambio', routerCambio);
app.use('/api/categoria', routerCategoria);
app.use('/api/combustivel', routerCombustivel);
app.use('/api/cor', routerCor);
app.use('/api/marca', routerMarca);
app.use('/api/modelo', routerModelo);

app.use('/api/carro', routerAnuncioCarro);

app.use(errorHandler);

app.listen(porta, () => {
    const data = new Date();
    console.log(`Seridor iniciado na porta ${porta} ${data}`);
});