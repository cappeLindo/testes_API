-- Ajustes nas chaves primárias para evitar múltiplas colunas desnecessárias
-- Ajustes nas constraints, índices e tipos para evitar erros comuns

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `webcars_db` DEFAULT CHARACTER SET utf8;
USE `webcars_db`;

-- Tabela Endereco
CREATE TABLE IF NOT EXISTS `endereco` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(45) NOT NULL,
  `cidade` VARCHAR(45) NOT NULL,
  `bairro` VARCHAR(45) NOT NULL,
  `rua` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela Concessionaria
CREATE TABLE IF NOT EXISTS `concessionaria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `cnpj` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `telefone` VARCHAR(45) NOT NULL,
  `imagem` LONGBLOB NOT NULL,
  `endereco_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  INDEX `fk_concessionaria_endereco1_idx` (`endereco_id`),
  CONSTRAINT `fk_concessionaria_endereco1`
    FOREIGN KEY (`endereco_id`) REFERENCES `endereco`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabela Marca
CREATE TABLE IF NOT EXISTS `marca` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela Categoria
CREATE TABLE IF NOT EXISTS `categoria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela Modelo
CREATE TABLE IF NOT EXISTS `modelo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `marca_id` INT NOT NULL,
  `categoria_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_modelo_marca1_idx` (`marca_id`),
  INDEX `fk_modelo_categoria1_idx` (`categoria_id`),
  CONSTRAINT `fk_modelo_marca1`
    FOREIGN KEY (`marca_id`) REFERENCES `marca`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_modelo_categoria1`
    FOREIGN KEY (`categoria_id`) REFERENCES `categoria`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabela Combustivel
CREATE TABLE IF NOT EXISTS `combustivel` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela Aro
CREATE TABLE IF NOT EXISTS `aro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela Cambio
CREATE TABLE IF NOT EXISTS `cambio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela Cor
CREATE TABLE IF NOT EXISTS `cor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela Carro
CREATE TABLE IF NOT EXISTS `carro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `ano` INT NOT NULL,
  `condicao` VARCHAR(45) NOT NULL,
  `valor` DECIMAL(15,2) NOT NULL,
  `ipva_pago` TINYINT(1) NOT NULL,
  `data_ipva` DATE NULL,
  `data_compra` DATE NULL,
  `detalhes_veiculo` LONGTEXT NOT NULL,
  `quilometragem` VARCHAR(45) NULL,
  `blindagem` TINYINT(1) NOT NULL,
  `concessionaria_id` INT NOT NULL,
  `modelo_id` INT NOT NULL,
  `combustivel_id` INT NOT NULL,
  `aro_id` INT NOT NULL,
  `categoria_id` INT NOT NULL,
  `marca_id` INT NOT NULL,
  `cambio_id` INT NOT NULL,
  `cor_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_carro_concessionaria_idx` (`concessionaria_id`),
  INDEX `fk_carro_modelo1_idx` (`modelo_id`),
  INDEX `fk_carro_combustivel1_idx` (`combustivel_id`),
  INDEX `fk_carro_aro1_idx` (`aro_id`),
  INDEX `fk_carro_categoria1_idx` (`categoria_id`),
  INDEX `fk_carro_marca1_idx` (`marca_id`),
  INDEX `fk_carro_cambio1_idx` (`cambio_id`),
  INDEX `fk_carro_cor1_idx` (`cor_id`),
  CONSTRAINT `fk_carro_concessionaria`
    FOREIGN KEY (`concessionaria_id`) REFERENCES `concessionaria`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_carro_modelo1`
    FOREIGN KEY (`modelo_id`) REFERENCES `modelo`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_carro_combustivel1`
    FOREIGN KEY (`combustivel_id`) REFERENCES `combustivel`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_carro_aro1`
    FOREIGN KEY (`aro_id`) REFERENCES `aro`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_carro_categoria1`
    FOREIGN KEY (`categoria_id`) REFERENCES `categoria`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_carro_marca1`
    FOREIGN KEY (`marca_id`) REFERENCES `marca`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_carro_cambio1`
    FOREIGN KEY (`cambio_id`) REFERENCES `cambio`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_carro_cor1`
    FOREIGN KEY (`cor_id`) REFERENCES `cor`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabela Cliente
CREATE TABLE IF NOT EXISTS `cliente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `cpf` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `telefone` VARCHAR(45) NOT NULL,
  `imagem` LONGBLOB NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB;

-- Tabela filtroAlerta
CREATE TABLE IF NOT EXISTS `filtroAlerta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `ano` INT NULL,
  `condicao` VARCHAR(45) NULL,
  `ipva_pago` TINYINT(1) NULL,
  `blindagem` TINYINT(1) NULL,
  `data_ipva` DATE NULL,
  `data_compra` DATE NULL,
  `valor_maximo` DECIMAL(15,2) NULL,
  `valor_minimo` DECIMAL(15,2) NULL,
  `cliente_id` INT NOT NULL,
  `marca_id` INT NULL,
  `categoria_id` INT NULL,
  `cambio_id` INT NULL,
  `aro_id` INT NULL,
  `modelo_id` INT NULL,
  `combustivel_id` INT NULL,
  `cor_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_filtroAlerta_cliente1_idx` (`cliente_id`),
  INDEX `fk_filtroAlerta_marca1_idx` (`marca_id`),
  INDEX `fk_filtroAlerta_categoria1_idx` (`categoria_id`),
  INDEX `fk_filtroAlerta_cambio1_idx` (`cambio_id`),
  INDEX `fk_filtroAlerta_aro1_idx` (`aro_id`),
  INDEX `fk_filtroAlerta_modelo1_idx` (`modelo_id`),
  INDEX `fk_filtroAlerta_combustivel1_idx` (`combustivel_id`),
  INDEX `fk_filtroAlerta_cor1_idx` (`cor_id`),
  CONSTRAINT `fk_filtroAlerta_cliente1`
    FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_filtroAlerta_marca1`
    FOREIGN KEY (`marca_id`) REFERENCES `marca`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_filtroAlerta_categoria1`
    FOREIGN KEY (`categoria_id`) REFERENCES `categoria`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_filtroAlerta_cambio1`
    FOREIGN KEY (`cambio_id`) REFERENCES `cambio`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_filtroAlerta_aro1`
    FOREIGN KEY (`aro_id`) REFERENCES `aro`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_filtroAlerta_modelo1`
    FOREIGN KEY (`modelo_id`) REFERENCES `modelo`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_filtroAlerta_combustivel1`
    FOREIGN KEY (`combustivel_id`) REFERENCES `combustivel`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_filtroAlerta_cor1`
    FOREIGN KEY (`cor_id`) REFERENCES `cor`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabela imagensCarro
CREATE TABLE IF NOT EXISTS `imagensCarro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `arquivo` LONGBLOB NOT NULL,
  `carro_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_imagensCarro_carro1_idx` (`carro_id`),
  CONSTRAINT `fk_imagensCarro_carro1`
    FOREIGN KEY (`carro_id`) REFERENCES `carro`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabela favoritos (tabela de relacionamento N:N entre carro e cliente)
CREATE TABLE IF NOT EXISTS `favoritos` (
  `carro_id` INT NOT NULL,
  `cliente_id` INT NOT NULL,
  PRIMARY KEY (`carro_id`, `cliente_id`),
  INDEX `fk_carro_has_cliente_cliente1_idx` (`cliente_id`),
  INDEX `fk_carro_has_cliente_carro1_idx` (`carro_id`),
  CONSTRAINT `fk_carro_has_cliente_carro1`
    FOREIGN KEY (`carro_id`) REFERENCES `carro`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_carro_has_cliente_cliente1`
    FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
