// multerConfig.js
import multer from "multer";
import path from "path";

// Armazena arquivos em memória (RAM)
const storage = multer.memoryStorage();

// Filtro para aceitar apenas imagens JPG, JPEG e PNG
const fileFilter = (req, file, cb) => {
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
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export default upload;
