import express from "express"
import cors from "cors"
const porta = 9000;
const app = express();
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.json('Sei la')
})

app.listen(porta, () => {
    const data = new Date()
    console.log(`Seridor iniciado na porta ${porta} ${data}`)
})