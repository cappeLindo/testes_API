import express, { json, query, Router } from 'express'
import { conexao } from "../config.js"
const routerSimples = express.Router()

routerSimples.get('/cor/:id?', (req, res) => {
    const id = req.params.id;
    if (!id) {
        const query = 'SELECT * FROM cor';
        conexao.query(query, (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            res.json(resultado);
        });
    } else {
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
            return;
        }
        const query = 'SELECT * FROM cor WHERE id_cor = ?';
        conexao.query(query, [id], (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            if (resultado.length === 0) {
                res.status(404).json({ error: 'Registro não encontrado.' });
                return;
            }
            res.json(resultado[0]);
        });
    }
});

// Função para tratar erros e enviar respostas
const handleError = (res, err, message) => {
    console.error(message, err);
    res.status(500).json({ error: message });
};

// Função para validar se um ID é válido
const isValidId = (id, res, errorMessage) => {
    if (isNaN(id)) {
        res.status(400).json({ error: errorMessage });
        return false;
    }
    return true;
};

routerSimples.get('/modelo', (req, res) => {
    const { categoria: idCategoria, idMarca } = req.query;

    // Verifica se ambos os IDs foram passados
    if (idCategoria && idMarca) {
        if (!isValidId(idCategoria, res, 'ID inválido. Deve ser um número.') || !isValidId(idMarca, res, 'ID inválido. Deve ser um número.')) {
            return;
        }

        const query = 'SELECT * FROM modelo WHERE categoria_id_categoria = ? AND marca_id_marca = ?';
        conexao.query(query, [idCategoria, idMarca], (err, resultado) => {
            if (err) return handleError(res, err, 'Erro ao buscar dados.');
            if (resultado.length === 0) return res.status(404).json({ error: 'Registro não encontrado.' });
            res.json(resultado);
        });
    }
    // Verifica apenas o ID da categoria
    else if (idCategoria) {
        if (!isValidId(idCategoria, res, 'ID inválido. Deve ser um número.')) return;

        const query = 'SELECT * FROM modelo WHERE categoria_id_categoria = ?';
        conexao.query(query, [idCategoria], (err, resultado) => {
            if (err) return handleError(res, err, 'Erro ao buscar dados.');
            if (resultado.length === 0) return res.status(404).json({ error: 'Registro não encontrado.' });
            res.json(resultado);
        });
    }
    // Verifica apenas o ID da marca
    else if (idMarca) {
        if (!isValidId(idMarca, res, 'ID inválido. Deve ser um número.')) return;

        const query = 'SELECT * FROM modelo WHERE marca_id_marca = ?';
        conexao.query(query, [idMarca], (err, resultado) => {
            if (err) return handleError(res, err, 'Erro ao buscar dados.');
            if (resultado.length === 0) return res.status(404).json({ error: 'Registro não encontrado.' });
            res.json(resultado);
        });
    }
    // Caso nenhum ID seja fornecido, retorna todos os registros
    else {
        const query = 'SELECT * FROM modelo';
        conexao.query(query, (err, resultado) => {
            if (err) return handleError(res, err, 'Erro ao buscar dados.');
            res.json(resultado);
        });
    }
});

routerSimples.get('/modelo/:id?', (req, res) => {
    const id = req.params.id;

    // Caso o ID não seja fornecido, retorna todos os registros
    if (!id) {
        const query = 'SELECT * FROM modelo';
        conexao.query(query, (err, resultado) => {
            if (err) return handleError(res, err, 'Erro ao buscar dados.');
            res.json(resultado);
        });
    }
    // Se o ID for fornecido, verifica se é válido e busca o registro específico
    else {
        if (!isValidId(id, res, 'ID inválido. Deve ser um número.')) return;

        const query = 'SELECT * FROM modelo WHERE id_modelo = ?';
        conexao.query(query, [id], (err, resultado) => {
            if (err) return handleError(res, err, 'Erro ao buscar dados.');
            if (resultado.length === 0) return res.status(404).json({ error: 'Registro não encontrado.' });
            res.json(resultado[0]);
        });
    }
});


routerSimples.get('/combustivel/:id?', (req, res) => {
    const id = req.params.id;
    if (!id) {
        const query = 'SELECT * FROM combustivel';
        conexao.query(query, (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            res.json(resultado);
        });
    } else {
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
            return;
        }
        const query = 'SELECT * FROM combustivel WHERE id_combustivel = ?';
        conexao.query(query, [id], (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            if (resultado.length === 0) {
                res.status(404).json({ error: 'Registro não encontrado.' });
                return;
            }
            res.json(resultado[0]);
        });
    }
});

routerSimples.get('/aro/:id?', (req, res) => {
    const id = req.params.id;
    if (!id) {
        const query = 'SELECT * FROM aro';
        conexao.query(query, (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            res.json(resultado);
        });
    } else {
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
            return;
        }
        const query = 'SELECT * FROM aro WHERE id_aro = ?';
        conexao.query(query, [id], (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            if (resultado.length === 0) {
                res.status(404).json({ error: 'Registro não encontrado.' });
                return;
            }
            res.json(resultado[0]);
        });
    }
});

routerSimples.get('/marca/:id?', (req, res) => {
    const id = req.params.id;
    if (!id) {
        const query = 'SELECT * FROM marca';
        conexao.query(query, (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            res.json(resultado);
        });
    } else {
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
            return;
        }
        const query = 'SELECT * FROM marca WHERE id_marca = ?';
        conexao.query(query, [id], (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            if (resultado.length === 0) {
                res.status(404).json({ error: 'Registro não encontrado.' });
                return;
            }
            res.json(resultado[0]);
        });
    }
});

routerSimples.get('/concessionaria/:id?', (req, res) => {
    const id = req.params.id;
    if (!id) {
        const query = 'SELECT * FROM concessionaria';
        conexao.query(query, (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            res.json(resultado);
        });
    } else {
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
            return;
        }
        const query = 'SELECT * FROM concessionaria WHERE id_concessionaria = ?';
        conexao.query(query, [id], (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            if (resultado.length === 0) {
                res.status(404).json({ error: 'Registro não encontrado.' });
                return;
            }
            res.json(resultado[0]);
        });
    }
});

routerSimples.get('/categoria/:id?', (req, res) => {
    const id = req.params.id;
    if (!id) {
        const query = 'SELECT * FROM categoria';
        conexao.query(query, (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            res.json(resultado);
        });
    } else {
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
            return;
        }
        const query = 'SELECT * FROM categoria WHERE id_categoria = ?';
        conexao.query(query, [id], (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            if (resultado.length === 0) {
                res.status(404).json({ error: 'Registro não encontrado.' });
                return;
            }
            res.json(resultado[0]);
        });
    }
});

routerSimples.get('/cambio/:id?', (req, res) => {
    const id = req.params.id;
    if (!id) {
        const query = 'SELECT * FROM cambio';
        conexao.query(query, (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            res.json(resultado);
        });
    } else {
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
            return;
        }
        const query = 'SELECT * FROM cambio WHERE id_cambio = ?';
        conexao.query(query, [id], (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            if (resultado.length === 0) {
                res.status(404).json({ error: 'Registro não encontrado.' });
                return;
            }
            res.json(resultado[0]);
        });
    }
});

routerSimples.get('/anuncioCarro/:id?', (req, res) => {
    const id = req.params.id;
    if (!id) {
        const query = 'SELECT * FROM anuncioCarro';
        conexao.query(query, (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            res.json(resultado);
        });
    } else {
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
            return;
        }
        const query = 'SELECT * FROM anuncioCarro WHERE id_anuncioCarro = ?';
        conexao.query(query, [id], (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            if (resultado.length === 0) {
                res.status(404).json({ error: 'Registro não encontrado.' });
                return;
            }
            res.json(resultado[0]);
        });
    }
});

routerSimples.get('/imagens/:id?', (req, res) => {
    const id = req.params.id;
    if (!id) {
        const query = 'SELECT * FROM imagensCarro';
        conexao.query(query, (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            res.json(resultado);
        });
    } else {
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
            return;
        }
        const query = 'SELECT * FROM imagensCarro WHERE anuncioCarro_id_anuncioCarro = ?';
        conexao.query(query, [id], (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            if (resultado.length === 0) {
                res.status(404).json({ error: 'Registro não encontrado.' });
                return;
            }
            res.json(resultado);
        });
    }
});

routerSimples.get('/filtroAlerta/:id?', (req, res) => {
    const id = req.params.id;
    if (!id) {
        const query = 'SELECT * FROM filtroAlerta';
        conexao.query(query, (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            res.json(resultado);
        });
    } else {
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
            return;
        }
        const query = 'SELECT * FROM imagensCarro WHERE filtroalerta = ?';
        conexao.query(query, [id], (err, resultado) => {
            if (err) {
                console.error('Erro ao executar a query:', err);
                res.status(500).json({ error: 'Erro ao buscar dados.' });
                return;
            }
            if (resultado.length === 0) {
                res.status(404).json({ error: 'Registro não encontrado.' });
                return;
            }
            res.json(resultado);
        });
    }
});

export default routerSimples