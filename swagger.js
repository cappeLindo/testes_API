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
        {
            name: 'FiltroAlerta',
            description: 'Rotas para gerenciamento de filtros de alerta',
        }
    ],
    components: {
        schemas: {
            FiltroAlerta: {
                type: 'object',
                properties: {
                    nome_filtroAlerta: {
                        type: 'string',
                        example: 'Filtro SUV Premium'
                    },
                    ano: {
                        type: 'integer',
                        example: 2022
                    },
                    condicao: {
                        type: 'string',
                        example: 'Semi-novo'
                    },
                    ipva_pago: {
                        type: 'boolean',
                        example: true
                    },
                    blindagem: {
                        type: 'boolean',
                        example: false
                    },
                    data_ipva: {
                        type: 'string',
                        format: 'date',
                        example: '2023-01-15'
                    },
                    data_compra: {
                        type: 'string',
                        format: 'date',
                        example: '2023-01-01'
                    },
                    valor_maximo: {
                        type: 'number',
                        example: 150000.00
                    },
                    valor_minimo: {
                        type: 'number',
                        example: 80000.00
                    },
                    cor_id_cor: {
                        type: 'integer',
                        example: 3
                    },
                    cambio_id_cambio: {
                        type: 'integer',
                        example: 1
                    },
                    aro_id_aro: {
                        type: 'integer',
                        example: 2
                    },
                    categoria_id_categoria: {
                        type: 'integer',
                        example: 1
                    },
                    marca_id_marca: {
                        type: 'integer',
                        example: 5
                    },
                    combustivel_id_combustivel: {
                        type: 'integer',
                        example: 2
                    },
                    cliente_id_cliente: {
                        type: 'integer',
                        example: 1
                    },
                    modelo_id_modelo: {
                        type: 'integer',
                        example: 10
                    }
                }
            }
        }
    }
};

swaggerAutogen({ openapi: '3.0.0', language: 'pt-br' })(outputFile, endpointsFiles, doc);