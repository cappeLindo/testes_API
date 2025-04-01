-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Web-Cars
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Web-Cars
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Web-Cars` DEFAULT CHARACTER SET utf8 ;
USE `Web-Cars` ;

-- -----------------------------------------------------
-- Table `Web-Cars`.`endereco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`endereco` (
  `id_endereco` INT NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(45) NOT NULL,
  `cidade` VARCHAR(45) NOT NULL,
  `bairro` VARCHAR(45) NOT NULL,
  `rua` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_endereco`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`concessionaria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`concessionaria` (
  `id_concessionaria` INT NOT NULL AUTO_INCREMENT,
  `nome_concessionaria` VARCHAR(45) NOT NULL,
  `cnpj_concessionaria` VARCHAR(45) NOT NULL,
  `email_concessionaria` VARCHAR(45) NOT NULL,
  `telefone_concessionaria` VARCHAR(45) NOT NULL,
  `imagem_concessionaria` VARCHAR(45) NOT NULL,
  `endereco_id_endereco` INT NOT NULL,
  PRIMARY KEY (`id_concessionaria`),
  INDEX `fk_concessionaria_endereco1_idx` (`endereco_id_endereco` ASC) VISIBLE,
  CONSTRAINT `fk_concessionaria_endereco1`
    FOREIGN KEY (`endereco_id_endereco`)
    REFERENCES `Web-Cars`.`endereco` (`id_endereco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`cor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`cor` (
  `id_cor` INT NOT NULL AUTO_INCREMENT,
  `nome_cor` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_cor`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`aro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`aro` (
  `id_aro` INT NOT NULL AUTO_INCREMENT,
  `nome_aro` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_aro`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`categoria` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `nome_categoria` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_categoria`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`marca`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`marca` (
  `id_marca` INT NOT NULL AUTO_INCREMENT,
  `nome_marca` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_marca`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`modelo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`modelo` (
  `id_modelo` INT NOT NULL AUTO_INCREMENT,
  `nome_modelo` VARCHAR(45) NOT NULL,
  `marca_id_marca` INT NOT NULL,
  `categoria_id_categoria` INT NOT NULL,
  PRIMARY KEY (`id_modelo`),
  INDEX `fk_modelo_marca1_idx` (`marca_id_marca` ASC) VISIBLE,
  INDEX `fk_modelo_categoria1_idx` (`categoria_id_categoria` ASC) VISIBLE,
  CONSTRAINT `fk_modelo_marca1`
    FOREIGN KEY (`marca_id_marca`)
    REFERENCES `Web-Cars`.`marca` (`id_marca`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_modelo_categoria1`
    FOREIGN KEY (`categoria_id_categoria`)
    REFERENCES `Web-Cars`.`categoria` (`id_categoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`combustivel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`combustivel` (
  `id_combustivel` INT NOT NULL AUTO_INCREMENT,
  `nome_combustivel` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_combustivel`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`cambio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`cambio` (
  `id_cambio` INT NOT NULL AUTO_INCREMENT,
  `nome_cambio` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_cambio`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`anuncioCarro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`anuncioCarro` (
  `id_anuncioCarro` INT NOT NULL AUTO_INCREMENT,
  `nome_anuncioCarro` VARCHAR(45) NOT NULL,
  `ano` INT NOT NULL,
  `condicao` VARCHAR(45) NOT NULL,
  `valor` DECIMAL(65,2) NOT NULL,
  `ipva_pago` TINYINT NOT NULL,
  `data_ipva` DATE NULL,
  `data_compra` DATE NULL,
  `detalhes_veiculo` VARCHAR(45) NOT NULL,
  `blindagem` TINYINT NOT NULL,
  `cor_id_cor` INT NOT NULL,
  `aro_id_aro` INT NOT NULL,
  `categoria_id_categoria` INT NOT NULL,
  `marca_id_marca` INT NOT NULL,
  `modelo_id_modelo` INT NOT NULL,
  `combustivel_id_combustivel` INT NOT NULL,
  `cambio_id_cambio` INT NOT NULL,
  `concessionaria_id_concessionaria` INT NOT NULL,
  PRIMARY KEY (`id_anuncioCarro`),
  INDEX `fk_anuncioCarro_cor1_idx` (`cor_id_cor` ASC) VISIBLE,
  INDEX `fk_anuncioCarro_aro1_idx` (`aro_id_aro` ASC) VISIBLE,
  INDEX `fk_anuncioCarro_categoria1_idx` (`categoria_id_categoria` ASC) VISIBLE,
  INDEX `fk_anuncioCarro_marca1_idx` (`marca_id_marca` ASC) VISIBLE,
  INDEX `fk_anuncioCarro_modelo1_idx` (`modelo_id_modelo` ASC) VISIBLE,
  INDEX `fk_anuncioCarro_combustivel1_idx` (`combustivel_id_combustivel` ASC) VISIBLE,
  INDEX `fk_anuncioCarro_cambio1_idx` (`cambio_id_cambio` ASC) VISIBLE,
  INDEX `fk_anuncioCarro_concessionaria1_idx` (`concessionaria_id_concessionaria` ASC) VISIBLE,
  CONSTRAINT `fk_anuncioCarro_cor1`
    FOREIGN KEY (`cor_id_cor`)
    REFERENCES `Web-Cars`.`cor` (`id_cor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_anuncioCarro_aro1`
    FOREIGN KEY (`aro_id_aro`)
    REFERENCES `Web-Cars`.`aro` (`id_aro`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_anuncioCarro_categoria1`
    FOREIGN KEY (`categoria_id_categoria`)
    REFERENCES `Web-Cars`.`categoria` (`id_categoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_anuncioCarro_marca1`
    FOREIGN KEY (`marca_id_marca`)
    REFERENCES `Web-Cars`.`marca` (`id_marca`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_anuncioCarro_modelo1`
    FOREIGN KEY (`modelo_id_modelo`)
    REFERENCES `Web-Cars`.`modelo` (`id_modelo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_anuncioCarro_combustivel1`
    FOREIGN KEY (`combustivel_id_combustivel`)
    REFERENCES `Web-Cars`.`combustivel` (`id_combustivel`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_anuncioCarro_cambio1`
    FOREIGN KEY (`cambio_id_cambio`)
    REFERENCES `Web-Cars`.`cambio` (`id_cambio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_anuncioCarro_concessionaria1`
    FOREIGN KEY (`concessionaria_id_concessionaria`)
    REFERENCES `Web-Cars`.`concessionaria` (`id_concessionaria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`cliente` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `nome_cliente` VARCHAR(45) NOT NULL,
  `cpf_cliente` VARCHAR(45) NOT NULL,
  `email_cliente` VARCHAR(45) NOT NULL,
  `telefone_cliente` VARCHAR(45) NOT NULL,
  `imagem_cliente` VARCHAR(45) NULL,
  PRIMARY KEY (`id_cliente`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`filtroAlerta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`filtroAlerta` (
  `id_filtroAlerta` INT NOT NULL AUTO_INCREMENT,
  `nome_filtroAlerta` VARCHAR(45),
  `ano` INT NULL,
  `condicao` VARCHAR(45) NULL,
  `ipva_pago` TINYINT NULL,
  `data_ipva` DATE NULL,
  `data_compra` DATE NULL,
  `valor_maximo` DECIMAL(65,2) NULL,
  `valor_minimo` DECIMAL(65,2) NULL,
  `cor_id_cor` INT NOT NULL,
  `cambio_id_cambio` INT NOT NULL,
  `aro_id_aro` INT NOT NULL,
  `categoria_id_categoria` INT NOT NULL,
  `marca_id_marca` INT NOT NULL,
  `combustivel_id_combustivel` INT NOT NULL,
  `cliente_id_cliente` INT NOT NULL,
  `modelo_id_modelo` INT NOT NULL,
  PRIMARY KEY (`id_filtroAlerta`),
  INDEX `fk_filtroAlerta_cor1_idx` (`cor_id_cor` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_cambio1_idx` (`cambio_id_cambio` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_aro1_idx` (`aro_id_aro` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_categoria1_idx` (`categoria_id_categoria` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_marca1_idx` (`marca_id_marca` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_cliente1_idx` (`cliente_id_cliente` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_combustivel1_idx` (`combustivel_id_combustivel` ASC) VISIBLE,
  INDEX `fk_filtroAlerta_modelo1_idx` (`modelo_id_modelo` ASC) VISIBLE,
  CONSTRAINT `fk_filtroAlerta_cor1`
    FOREIGN KEY (`cor_id_cor`)
    REFERENCES `Web-Cars`.`cor` (`id_cor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_cambio1`
    FOREIGN KEY (`cambio_id_cambio`)
    REFERENCES `Web-Cars`.`cambio` (`id_cambio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_aro1`
    FOREIGN KEY (`aro_id_aro`)
    REFERENCES `Web-Cars`.`aro` (`id_aro`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_categoria1`
    FOREIGN KEY (`categoria_id_categoria`)
    REFERENCES `Web-Cars`.`categoria` (`id_categoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_marca1`
    FOREIGN KEY (`marca_id_marca`)
    REFERENCES `Web-Cars`.`marca` (`id_marca`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_cliente1`
    FOREIGN KEY (`cliente_id_cliente`)
    REFERENCES `Web-Cars`.`cliente` (`id_cliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_combustivel1`
    FOREIGN KEY (`combustivel_id_combustivel`)
    REFERENCES `Web-Cars`.`combustivel` (`id_combustivel`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_filtroAlerta_modelo1`
    FOREIGN KEY (`modelo_id_modelo`)
    REFERENCES `Web-Cars`.`modelo` (`id_modelo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Web-Cars`.`imagensCarro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Web-Cars`.`imagensCarro` (
  `id_imagensCarro` INT NOT NULL AUTO_INCREMENT,
  `nome_imagensCarro` VARCHAR(45) NOT NULL,
  `anuncioCarro_id_anuncioCarro` INT NOT NULL,
  PRIMARY KEY (`id_imagensCarro`),
  INDEX `fk_imagensCarro_anuncioCarro1_idx` (`anuncioCarro_id_anuncioCarro` ASC) VISIBLE,
  CONSTRAINT `fk_imagensCarro_anuncioCarro1`
    FOREIGN KEY (`anuncioCarro_id_anuncioCarro`)
    REFERENCES `Web-Cars`.`anuncioCarro` (`id_anuncioCarro`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
