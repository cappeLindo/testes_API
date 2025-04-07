import express from "express"
import path from "path"
import multer from "multer"
const routerUploadImagem = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = file.originalname
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

// Middleware para lidar com uploads
routerUploadImagem.post('/upload', upload.array('imagens', 7), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }

    console.log('Arquivos recebidos:', req.files);
    res.status(200).send({ mensagem: 'Upload realizado com sucesso!', arquivos: req.files });
});

export default routerUploadImagem