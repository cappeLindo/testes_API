-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema webcars_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema webcars_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `webcars_db` DEFAULT CHARACTER SET utf8 ;
USE `webcars_db` ;

-- -----------------------------------------------------
-- Table `webcars_db`.`endereco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`endereco` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(45) NOT NULL,
  `cidade` VARCHAR(45) NOT NULL,
  `bairro` VARCHAR(45) NOT NULL,
  `rua` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`concessionaria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`concessionaria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `cnpj` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `telefone` VARCHAR(45) NOT NULL,
  `imagem` LONGBLOB NOT NULL,
  `endereco_id` INT NOT NULL,
  PRIMARY KEY (`id`, `endereco_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_concessionaria_endereco1_idx` (`endereco_id` ASC) VISIBLE,
  CONSTRAINT `fk_concessionaria_endereco1`
    FOREIGN KEY (`endereco_id`)
    REFERENCES `webcars_db`.`endereco` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`modelo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`modelo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`combustivel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`combustivel` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`aro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`aro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`categoria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`marca`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`marca` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`cambio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`cambio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`cor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`cor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`carro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`carro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `ano` INT NOT NULL,
  `condicao` VARCHAR(45) NOT NULL,
  `valor` DECIMAL(65,2) NOT NULL,
  `ipva_pago` TINYINT NOT NULL,
  `data_ipva` DATE NULL,
  `data_compra` DATE NULL,
  `detalhes_veiculo` LONGTEXT NOT NULL,
  `quilometragem` VARCHAR(45) NULL,
  `blindagem` TINYINT NOT NULL,
  `concessionaria_id` INT NOT NULL,
  `modelo_id` INT NOT NULL,
  `combustivel_id` INT NOT NULL,
  `aro_id` INT NOT NULL,
  `categoria_id` INT NOT NULL,
  `marca_id` INT NOT NULL,
  `cambio_id` INT NOT NULL,
  `cor_id` INT NOT NULL,
  PRIMARY KEY (`id`, `concessionaria_id`, `modelo_id`, `combustivel_id`, `aro_id`, `categoria_id`, `marca_id`, `cambio_id`, `cor_id`),
  INDEX `fk_carro_concessionaria_idx` (`concessionaria_id` ASC) VISIBLE,
  INDEX `fk_carro_modelo1_idx` (`modelo_id` ASC) VISIBLE,
  INDEX `fk_carro_combustivel1_idx` (`combustivel_id` ASC) VISIBLE,
  INDEX `fk_carro_aro1_idx` (`aro_id` ASC) VISIBLE,
  INDEX `fk_carro_categoria1_idx` (`categoria_id` ASC) VISIBLE,
  INDEX `fk_carro_marca1_idx` (`marca_id` ASC) VISIBLE,
  INDEX `fk_carro_cambio1_idx` (`cambio_id` ASC) VISIBLE,
  INDEX `fk_carro_cor1_idx` (`cor_id` ASC) VISIBLE,
  CONSTRAINT `fk_carro_concessionaria`
    FOREIGN KEY (`concessionaria_id`)
    REFERENCES `webcars_db`.`concessionaria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_carro_modelo1`
    FOREIGN KEY (`modelo_id`)
    REFERENCES `webcars_db`.`modelo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_carro_combustivel1`
    FOREIGN KEY (`combustivel_id`)
    REFERENCES `webcars_db`.`combustivel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_carro_aro1`
    FOREIGN KEY (`aro_id`)
    REFERENCES `webcars_db`.`aro` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_carro_categoria1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `webcars_db`.`categoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_carro_marca1`
    FOREIGN KEY (`marca_id`)
    REFERENCES `webcars_db`.`marca` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_carro_cambio1`
    FOREIGN KEY (`cambio_id`)
    REFERENCES `webcars_db`.`cambio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_carro_cor1`
    FOREIGN KEY (`cor_id`)
    REFERENCES `webcars_db`.`cor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`cliente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `cpf` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `telefone` VARCHAR(45) NOT NULL,
  `imagem` LONGBLOB NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`filtroAlerta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`filtroAlerta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `ano` INT NULL,
  `condicao` VARCHAR(45) NULL,
  `ipva_pago` TINYINT NULL,
  `blindagem` TINYINT NULL,
  `data_ipva` DATE NULL,
  `data_compra` DATE NULL,
  `valor_maximo` DECIMAL(65,2) NULL,
  `valor_minimo` DECIMAL(65,2) NULL,
  `cliente_id` INT NOT NULL,
  `marca_id` INT NULL,
  `categoria_id` INT NULL,
  `cambio_id` INT NULL,
  `aro_id` INT NULL,
  `modelo_id` INT NULL,
  `combustivel_id` INT NULL,
  `cor_id` INT NULL,
  PRIMARY KEY (`id`, `cliente_id`),
  INDEX `fk_filtroAlerta_cliente1_idx` (`cliente_id` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_marca1_idx` (`marca_id` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_categoria1_idx` (`categoria_id` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_cambio1_idx` (`cambio_id` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_aro1_idx` (`aro_id` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_modelo1_idx` (`modelo_id` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_combustivel1_idx` (`combustivel_id` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_cor1_idx` (`cor_id` ASC) VISIBLE,
  CONSTRAINT `fk_filtroAlerta_cliente1`
    FOREIGN KEY (`cliente_id`)
    REFERENCES `webcars_db`.`cliente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_marca1`
    FOREIGN KEY (`marca_id`)
    REFERENCES `webcars_db`.`marca` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_categoria1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `webcars_db`.`categoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_cambio1`
    FOREIGN KEY (`cambio_id`)
    REFERENCES `webcars_db`.`cambio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_aro1`
    FOREIGN KEY (`aro_id`)
    REFERENCES `webcars_db`.`aro` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_modelo1`
    FOREIGN KEY (`modelo_id`)
    REFERENCES `webcars_db`.`modelo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_combustivel1`
    FOREIGN KEY (`combustivel_id`)
    REFERENCES `webcars_db`.`combustivel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_cor1`
    FOREIGN KEY (`cor_id`)
    REFERENCES `webcars_db`.`cor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`imagensCarro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`imagensCarro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `arquivo` LONGBLOB NOT NULL,
  `carro_id` INT NOT NULL,
  PRIMARY KEY (`id`, `carro_id`),
  INDEX `fk_imagensCarro_carro1_idx` (`carro_id` ASC) VISIBLE,
  CONSTRAINT `fk_imagensCarro_carro1`
    FOREIGN KEY (`carro_id`)
    REFERENCES `webcars_db`.`carro` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webcars_db`.`favoritos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webcars_db`.`favoritos` (
  `carro_id` INT NOT NULL,
  `cliente_id` INT NOT NULL,
  PRIMARY KEY (`carro_id`, `cliente_id`),
  INDEX `fk_carro_has_cliente_cliente1_idx` (`cliente_id` ASC) VISIBLE,
  INDEX `fk_carro_has_cliente_carro1_idx` (`carro_id` ASC) VISIBLE,
  CONSTRAINT `fk_carro_has_cliente_carro1`
    FOREIGN KEY (`carro_id`)
    REFERENCES `webcars_db`.`carro` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_carro_has_cliente_cliente1`
    FOREIGN KEY (`cliente_id`)
    REFERENCES `webcars_db`.`cliente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
