app.get('/api/atualizarDados', (req, res) => {
  const tabela = req.query.tabela;
  const valorid = req.query.id;
  const valor = req.query.valor;

  if (!tabela || !valorid || !valor) {
    return res.status(400).json({ error: "Por favor, forneça 'tabela', 'id' e 'valor' como parâmetros na URL." });
  }

  const insert = 'UPDATE ?? set ?? = (?) where ?? = ?';
  const coluna = `nome_${tabela}`
  const colunaId = `id_${tabela}`
  // Usa conexão segura com os placeholders
  conexao.query(insert, [tabela, coluna, valor, colunaId, valorid], (err, resultado) => {
    if (err) {
      console.error("Erro ao inserir no banco de dados:", err);
      return res.status(500).json({ error: "Erro ao inserir no banco de dados." });
    }

    res.status(200).json({ message: "Atualização realizada com sucesso!", resultado });
  });
});