import multer from "multer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    // Define o diretório onde os arquivos serão armazenados
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads"));
    },
    //cria um nome único para o arquivo
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const novoNome = uniqueSuffix + "-" + file.originalname
        cb(null, novoNome);
    }
});

// Configuração do filtro de arquivos
const fileFilter = (req, file, cb) => {
    // Verifica se o arquivo é uma imagem
    const extensoesValidas = [".jpg", ".jpeg", ".png"];
    const extensao = path.extname(file.originalname).toLowerCase();
    if (extensoesValidas.includes(extensao)) {
        cb(null, true);
    } else {
        cb(new Error("Formato de arquivo inválido. Apenas JPG, JPEG e PNG são permitidos."), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB
    }
    
});


export default upload;