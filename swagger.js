import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js'];

const doc = {
    info: {
        version: '1.0',
        title: 'API Veículos',
        description: 'API do projeto de fabrica de software WEBCARS',
        
        
    },
    servers: [
        {
            title: 'Web cars',
            url: 'https://webcars.dev.vilhena.ifro.edu.br/api/',
        } 
    ],
    tags: [
        {
            name: 'Aro',
            description: 'Rotas para gerenciamento de aros',
        },
        {
            name: 'Câmbio',
            description: 'Rotas para gerenciamento de câmbios',
        },
        {
            name: 'Carro',
            description: 'Rotas para gerenciamento de carros',
        },
        {
            name: 'Categoria',
            description: 'Rotas para gerenciamento de categorias',
        },
        {
            name: 'Combustível',
            description: 'Rotas para gerenciamento de combustíveis',
        },
        {
            name: 'Cor',
            description: 'Rotas para gerenciamento de cores',
        },
        {
            name: 'Marca',
            description: 'Rotas para gerenciamento de marcas',
        },
        {
            name: 'Modelo',
            description: 'Rotas para gerenciamento de modelos',
        },
    ]
};

    swaggerAutogen({ openapi: '3.0.0', language: 'pt-br' })(outputFile, endpointsFiles, doc);