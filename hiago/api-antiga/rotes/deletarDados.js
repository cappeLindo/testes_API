app.get('/api/deletarDados', (req, res) => {
  const tabela = req.query.tabela;
  const valorid = req.query.id;

  // Validação básica para evitar erros
  if (!tabela || !valorid) {
    return res.status(400).json({ error: "Por favor, forneça 'tabela' e 'id'' como parâmetros na URL." });
  }

  // Monta o comando SQL usando placeholders para evitar injeção de SQL
  const insert = 'DELETE from ?? where ?? = ?';
  const colunaId = `id_${tabela}`
  // Usa conexão segura com os placeholders
  conexao.query(insert, [tabela, colunaId, valorid], (err, resultado) => {
    if (err) {
      console.error("Erro ao inserir no banco de dados:", err);
      return res.status(500).json({ error: "Erro ao inserir no banco de dados." });
    }

    res.status(200).json({ message: "Deletação realizada com sucesso!", resultado });
  });
});