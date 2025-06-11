import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../../config.js";

const authRoutesConcessionaria = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação concessionaria
 *   description: Endpoints para gerenciamento de autenticação de concessionárias.
 */

/**
 * @swagger
 * /auth/concessionaria/login:
 *   post:
 *     summary: Realiza o login da concessionária
 *     description: Realiza a autenticação da concessionária e retorna um token JWT para sessões subsequentes.
 *     tags: [Autenticação concessionaria]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: hiago@gmail.com
 *               senha:
 *                 type: string
 *                 example: Senha@123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso e token gerado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *       401:
 *         description: Usuário ou senha incorretos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuário ou senha incorretos
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro no servidor
 */
authRoutesConcessionaria.post("/concessionaria/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Consulta no banco de dados para verificar se o email existe
    const [results] = await pool.query("SELECT * FROM concessionaria WHERE email = ?", [email]);
    
    if (results.length === 0) {
      return res.status(401).json({ error: "Usuário ou senha incorretos." });
    }

    const usuario = results[0];

    const senhaValida = senha === usuario.senha;

    if (senhaValida === false) {
      return res.status(401).json({ error: "Usuário ou senha incorretos." });
    }

    // Criação do token JWT
    const token = jwt.sign(
      { id: usuario.idperfil, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Envia o token como cookie HTTP only para maior segurança
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Somente em HTTPS no ambiente de produção
      maxAge: 86400000, // 24 horas em milissegundos
      sameSite: "lax" // Respeita a política de cookies de mesmo site
    });

    res.cookie("id", usuario.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Somente em HTTPS no ambiente de produção
      maxAge: 86400000, // 24 horas em milissegundos
      sameSite: "lax" // Respeita a política de cookies de mesmo site
    });

    // Retorna a resposta com sucesso
    res.json({ message: "Login realizado com sucesso" });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

/**
 * @swagger
 * /auth/concessionaria/logout:
 *   post:
 *     summary: Realiza o logout do usuário
 *     description: Remove o token JWT da sessão e faz logout do usuário.
 *     tags: [Autenticação concessionaria]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout realizado com sucesso
 *       500:
 *         description: Erro ao realizar logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao realizar logout
 */
authRoutesConcessionaria.post("/concessionaria/logout", (req, res) => {
  try {
    // Limpa o cookie de autenticação
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax"
    });
    res.clearCookie("id", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax"
    });

    // Responde com sucesso
    res.json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro no logout:", error);
    res.status(500).json({ error: "Erro ao realizar logout" });
  }
});

export default authRoutesConcessionaria;
