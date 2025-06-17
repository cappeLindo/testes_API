USE `webcars_db`;

-- Inserir dados na tabela Endereco
INSERT INTO `endereco` (estado, cidade, bairro, rua) VALUES
('São Paulo', 'São Paulo', 'Moema', 'Av. Ibirapuera, 123'),
('Rio de Janeiro', 'Rio de Janeiro', 'Copacabana', 'Rua Barata Ribeiro, 456'),
('Minas Gerais', 'Belo Horizonte', 'Savassi', 'Rua Antônio de Albuquerque, 789'),
('Paraná', 'Curitiba', 'Batel', 'Av. do Batel, 101'),
('Rio Grande do Sul', 'Porto Alegre', 'Moinhos de Vento', 'Rua Dinarte Ribeiro, 202');

-- Inserir dados na tabela Concessionaria (genéricos, com senhas hasheadas fictícias)
INSERT INTO `concessionaria` (nome, cnpj, email, senha, telefone, imagem, endereco_id) VALUES
('Auto Concessionária ABC', '12.345.678/0001-99', 'contato@abc.com', 'Senha@123', '(11) 99999-1111', 0x00, 1),
('Revenda Rio Car', '98.765.432/0001-88', 'rio@revendario.com', 'Senha@123', '(21) 98888-2222', 0x00, 2),
('Carros BH', '45.678.123/0001-77', 'bh@carrosbh.com', 'Senha@123', '(31) 97777-3333', 0x00, 3),
('Curitiba Veículos', '56.789.123/0001-66', 'curitiba@veiculos.com', 'Senha@123', '(41) 96666-4444', 0x00, 4),
('Sul Carros', '78.901.234/0001-55', 'sul@carros.com', 'Senha@123', '(51) 95555-5555', 0x00, 5);

-- Inserir dados na tabela Marca
INSERT INTO `marca` (nome) VALUES
('Toyota'),
('Volkswagen'),
('Honda'),
('Ford'),
('Chevrolet');

-- Inserir dados na tabela Categoria
INSERT INTO `categoria` (nome) VALUES
('Sedan'),
('SUV'),
('Hatch'),
('Picape'),
('Esportivo');

-- Inserir dados na tabela Modelo
INSERT INTO `modelo` (nome, marca_id, categoria_id) VALUES
('Corolla', 1, 1), -- Toyota Sedan
('Tiguan', 2, 2),  -- Volkswagen SUV
('Civic', 3, 1),   -- Honda Sedan
('Ranger', 4, 4),  -- Ford Picape
('Onix', 5, 3),    -- Chevrolet Hatch
('Camry', 1, 1),   -- Toyota Sedan
('Golf', 2, 3),    -- Volkswagen Hatch
('HR-V', 3, 2),    -- Honda SUV
('Mustang', 4, 5), -- Ford Esportivo
('Cruze', 5, 1);   -- Chevrolet Sedan

-- Inserir dados na tabela Combustivel
INSERT INTO `combustivel` (nome) VALUES
('Gasolina'),
('Etanol'),
('Flex'),
('Diesel'),
('Híbrido');

-- Inserir dados na tabela Aro
INSERT INTO `aro` (nome) VALUES
('15'),
('16'),
('17'),
('18'),
('20');

-- Inserir dados na tabela Cambio
INSERT INTO `cambio` (nome) VALUES
('Manual'),
('Automático'),
('CVT'),
('Dupla Embreagem');

-- Inserir dados na tabela Cor
INSERT INTO `cor` (nome) VALUES
('Preto'),
('Branco'),
('Prata'),
('Vermelho'),
('Azul');

-- Inserir dados na tabela Carro
INSERT INTO `carro` (nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, quilometragem, blindagem, concessionaria_id, modelo_id, combustivel_id, aro_id, categoria_id, marca_id, cambio_id, cor_id) VALUES
('Toyota Corolla XEi', 2023, 'Usado', 120000.00, 1, '2025-01-15', '2023-06-10', 'Veículo em excelente estado, completo com ar-condicionado, multimídia e câmera de ré.', '35000', 0, 1, 1, 3, 3, 1, 1, 2, 3), -- Flex, 17", Automático, Prata
('Volkswagen Tiguan Allspace', 2022, 'Usado', 180000.00, 1, '2025-02-20', '2022-08-15', 'SUV com teto solar, tração 4x4 e bancos em couro.', '45000', 0, 2, 2, 4, 4, 2, 2, 2, 1), -- Diesel, 18", Automático, Preto
('Honda Civic Touring', 2024, 'Novo', 150000.00, 0, NULL, NULL, 'Zero km, com garantia de fábrica e todos os opcionais.', '0', 0, 3, 3, 5, 3, 1, 3, 3, 2), -- Híbrido, 17", CVT, Branco
('Ford Ranger XLS', 2021, 'Usado', 200000.00, 1, '2025-03-10', '2021-12-01', 'Picape robusta, ideal para trabalho e lazer, com tração 4x4.', '60000', 1, 4, 4, 4, 4, 4, 4, 1, 4), -- Diesel, 18", Manual, Vermelho
('Chevrolet Onix LT', 2023, 'Usado', 85000.00, 1, '2025-01-30', '2023-03-20', 'Hatch econômico, com baixa manutenção e multimídia.', '25000', 0, 5, 5, 3, 2, 3, 5, 1, 5); -- Flex, 16", Manual, Azul

-- Inserir dados na tabela Cliente (genéricos, com senhas hasheadas fictícias)
INSERT INTO `cliente` (nome, cpf, email, senha, telefone, imagem) VALUES
('João Silva', '123.456.789-00', 'joao.silva@email.com', 'Senha@123', '(11) 91234-5678', NULL),
('Maria Oliveira', '987.654.321-00', 'maria.oliveira@email.com', 'Senha@123', '(21) 92345-6789', NULL),
('Pedro Santos', '456.789.123-00', 'pedro.santos@email.com', 'Senha@123', '(31) 93456-7890', NULL),
('Ana Costa', '789.123.456-00', 'ana.costa@email.com', 'Senha@123', '(41) 94567-8901', NULL),
('Lucas Pereira', '321.654.987-00', 'lucas.pereira@email.com', 'Senha@123', '(51) 95678-9012', NULL);

-- Inserir dados na tabela filtroAlerta
INSERT INTO `filtroAlerta` (nome, ano, condicao, ipva_pago, blindagem, data_ipva, data_compra, valor_maximo, valor_minimo, cliente_id, marca_id, categoria_id, cambio_id, aro_id, modelo_id, combustivel_id, cor_id) VALUES
('Busca Sedan Toyota', 2023, 'Usado', 1, 0, NULL, NULL, 130000.00, 100000.00, 1, 1, 1, 2, NULL, 1, 3, 3), -- Toyota, Sedan, Automático, Flex, Prata
('Busca SUV Híbrido', NULL, 'Novo', NULL, 0, NULL, NULL, 200000.00, 150000.00, 2, NULL, 2, 3, 4, NULL, 5, NULL), -- SUV, CVT, Híbrido, qualquer cor
('Busca Picape Diesel', 2021, 'Usado', 1, 1, NULL, NULL, 250000.00, 180000.00, 3, 4, 4, NULL, 4, 4, 4, NULL), -- Ford, Picape, Diesel, 18"
('Busca Hatch Econômico', 2023, 'Usado', NULL, 0, NULL, NULL, 90000.00, 70000.00, 4, 5, 3, 1, 2, 5, 3, 5), -- Chevrolet, Hatch, Manual, 16", Flex, Azul
('Busca Esportivo Ford', NULL, NULL, NULL, NULL, NULL, NULL, 300000.00, 200000.00, 5, 4, 5, 2, 5, 9, NULL, 4); -- Ford, Esportivo, Automático, 20", Vermelho

-- Inserir dados na tabela imagensCarro
INSERT INTO `imagensCarro` (nome, arquivo, carro_id) VALUES
('Corolla_XEi_frente.jpg', 0x00, 1),
('Corolla_XEi_lateral.jpg', 0x00, 1),
('Tiguan_frente.jpg', 0x00, 2),
('Civic_interior.jpg', 0x00, 3),
('Ranger_traseira.jpg', 0x00, 4),
('Onix_lateral.jpg', 0x00, 5);

-- Inserir dados na tabela favoritos
INSERT INTO `favoritos` (carro_id, cliente_id) VALUES
(1, 1), -- João Silva favoritou Corolla
(2, 2), -- Maria Oliveira favoritou Tiguan
(3, 3), -- Pedro Santos favoritou Civic
(4, 4), -- Ana Costa favoritou Ranger
(5, 5); -- Lucas Pereira favoritou Onix