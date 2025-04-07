import express from "express";
import cors from "cors";

import "./importRotas.js";

import errorHandler from "./middlevares/errorHandler.js";

import routerAro from "./hiago/rotas/aro.js";

const porta = 9000;
const app = express();
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.json('Sei la');
});

app.use('/aro', routerAro);

app.use(errorHandler);

app.listen(porta, () => {
    const data = new Date();
    console.log(`Seridor iniciado na porta ${porta} ${data}`);
});