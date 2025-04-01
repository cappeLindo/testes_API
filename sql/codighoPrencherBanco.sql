use `web-Cars`;
-- Populating the endereco table
INSERT INTO `Web-Cars`.`endereco` (`estado`, `cidade`, `bairro`, `rua`) VALUES
('SP', 'São Paulo', 'Centro', 'Rua A'),
('RJ', 'Rio de Janeiro', 'Copacabana', 'Rua B'),
('MG', 'Belo Horizonte', 'Savassi', 'Rua C');

-- Populating the concessionaria table
INSERT INTO `Web-Cars`.`concessionaria` (`nome_concessionaria`, `cnpj_concessionaria`, `email_concessionaria`, `telefone_concessionaria`, `imagem_concessionaria`, `endereco_id_endereco`) VALUES
('Concessionária A', '00.000.000/0001-00', 'emailA@concessionaria.com', '(11) 1111-1111', 'imagemA.jpg', 1),
('Concessionária B', '00.000.000/0002-00', 'emailB@concessionaria.com', '(21) 2222-2222', 'imagemB.jpg', 2),
('Concessionária C', '00.000.000/0003-00', 'emailC@concessionaria.com', '(31) 3333-3333', 'imagemC.jpg', 3);

-- Populating the cor table
INSERT INTO `Web-Cars`.`cor` (`nome_cor`) VALUES
('Vermelho'),
('Azul'),
('Preto');

-- Populating the aro table
INSERT INTO `Web-Cars`.`aro` (`nome_aro`) VALUES
('Aro 15'),
('Aro 16'),
('Aro 17');

-- Populating the categoria table
INSERT INTO `Web-Cars`.`categoria` (`nome_categoria`) VALUES
('SUV'),
('Sedan'),
('Hatch');

-- Populating the marca table
INSERT INTO `Web-Cars`.`marca` (`nome_marca`) VALUES
('Toyota'),
('Honda'),
('Ford');

-- Populating the modelo table
INSERT INTO `Web-Cars`.`modelo` (`nome_modelo`, `marca_id_marca`, `categoria_id_categoria`) VALUES
('Corolla', 1, 2),
('Civic', 2, 2),
('Focus', 3, 3);

-- Populating the combustivel table
INSERT INTO `Web-Cars`.`combustivel` (`nome_combustivel`) VALUES
('Gasolina'),
('Álcool'),
('Diesel');

-- Populating the cambio table
INSERT INTO `Web-Cars`.`cambio` (`nome_cambio`) VALUES
('Manual'),
('Automático');

-- Populating the anuncioCarro table
INSERT INTO `Web-Cars`.`anuncioCarro` (`nome_anuncioCarro`, `ano`, `condicao`, `valor`, `ipva_pago`, `data_ipva`, `data_compra`, `detalhes_veiculo`, `blindagem`, 
`cor_id_cor`, `aro_id_aro`, `categoria_id_categoria`, `marca_id_marca`, `modelo_id_modelo`, 
`combustivel_id_combustivel`, `cambio_id_cambio`, `concessionaria_id_concessionaria`) VALUES
('Anuncio A', 2020, 'Novo', 50000.00, 1, '2023-01-01', '2023-01-10', 'Detalhes A', 0, 
1, 1, 1, 1, 1, 
1, 1, 1),
('Anuncio B', 2019, 'Usado', 40000.00, 0, NULL, NULL, 'Detalhes B', 0, 
2, 2, 2, 2, 2, 
2, 2, 2),
('Anuncio C', 2018, 'Novo', 30000.00, 1, '2023-02-01', '2023-02-10', 'Detalhes C', 1,
3, 3, 3, 3, 3,
3, 1, 3);

-- Populating the cliente table
INSERT INTO `Web-Cars`.`cliente` (`nome_cliente`, `cpf_cliente`, `email_cliente`, `telefone_cliente`, `imagem_cliente`) VALUES
('Cliente A', '000.000.000-00', 'clienteA@email.com', '(11) 4444-4444', NULL),
('Cliente B', '111.111.111-11', 'clienteB@email.com', '(21) 5555-5555', NULL),
('Cliente C', '222.222.222-22', 'clienteC@email.com', '(31) 6666-6666', NULL);

-- Populating the filtroAlerta table
INSERT INTO `Web-Cars`.`filtroAlerta` (`nome_filtroAlerta`, `ano`, `condicao`, `ipva_pago`, `data_ipva`, `data_compra`, 
`valor_maximo`, `valor_minimo`,
`cor_id_cor`, `cambio_id_cambio`, 
`aro_id_aro`, 
`categoria_id_categoria`,
`marca_id_marca`,
`cliente_id_cliente`,
`combustivel_id_combustivel`,
`modelo_id_modelo`) VALUES
('Carro A', 2020, 'Novo', NULL, NULL, NULL,
60000.00, NULL,
1, 
1,
1,
1,
1,
1,
1,
1),
('Carro B', 2019, NULL, NULL,NULL,NULL,
50000.00,NULL,
2,
2,
2,
2,
2,
2,
2,
2),
('Carro C', 2018,'Usado','0','2023-03-01','2023-03-10',
40000.00,NULL,
3,
1,
3,
3,
3,
3,
3,
3);

-- Populating the imagensCarro table
INSERT INTO `Web-Cars`.`imagensCarro` (`nome_imagensCarro`,`anuncioCarro_id_anuncioCarro`) VALUES
('imagemA.jpg','1'),
('imagemB.jpg','2'),
('imagemC.jpg','3');


