//---------------- Básico para a API ----------------
import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";


//---------------- Para a documentação ----------------
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

//---------------- Routes da API ----------------
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
import authRoutesCliente from "./auth/rotas/authCliente.js";
import authRoutesConcessionaria from "./auth/rotas/authConcessionaria.js";
import routerFavoritosCarros from "./hiago/rotas/favoritos.js";
import routerEndereco from "./hiago/rotas/enderecos.js";

//---------------- Configuração básica da API ----------------
const porta = 9000;
const app = express();
app.use(cors());
app.use(express.json());


//---------------- Documentação da API ----------------
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        docExpansion: "none",              
        defaultModelsExpandDepth: -1      
    }
}));

//---------------- Hiago ----------------

app.use('/auth', authRoutesCliente);
app.use('/auth', authRoutesConcessionaria);
app.use('/aro', routerAro); 
app.use('/cambio', routerCambio); 
app.use('/categoria', routerCategoria);
app.use('/combustivel', routerCombustivel);
app.use('/cor', routerCor);
app.use('/marca', routerMarca);
app.use('/modelo', routerModelo);
app.use('/favoritosCarros', routerFavoritosCarros);
app.use('/endereco', routerEndereco);
app.use('/carro', routerAnuncioCarro); //revisar, arrumar e adicionar verificação.

//---------------- Nathan ----------------
app.use('/filtro-alerta', routerFiltroAlerta); //revisar, arrumar e adicionar verificação.

//---------------- Carlos ----------------
app.use('/cliente', routerCliente);

//---------------- Cappe ----------------
app.use('/concessionaria', routerConcessionaria);


//---------------- Configuração do tratamento de erros personalizado ----------------
app.use(errorHandler);


//---------------- Iniciaização da API ----------------
app.listen(porta, () => {
    const data = new Date();
    console.log(`Servidor iniciado na porta ${porta} ${data}\nAcesse o localhost: http://localhost:9000/docs/`);
});