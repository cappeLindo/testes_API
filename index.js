import express from "express";
import cors from "cors";

import errorHandler from "./middlevares/errorHandler.js";

import routerAro from "./hiago/rotas/aro.js";
import routerCambio from "./hiago/rotas/cambio.js";
import routerCategoria from "./hiago/rotas/categoria.js";
import routerCombustivel from "./hiago/rotas/combustivel.js";
import routerCor from "./hiago/rotas/cor.js";

const porta = 9000;
const app = express();
app.use(cors());

app.use(express.json());


app.use('/api/aro', routerAro);
app.use('/api/cambio', routerCambio);
app.use('/api/categoria', routerCategoria);
app.use('/api/combustivel', routerCombustivel);
app.use('/api/cor', routerCor);


app.use(errorHandler);

app.listen(porta, () => {
    const data = new Date();
    console.log(`Seridor iniciado na porta ${porta} ${data}`);
});