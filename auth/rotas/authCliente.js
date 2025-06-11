import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../../config.js";

const authRoutesCliente = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação Cliente
 *   description: Endpoints para gerenciamento de atores
 */

/**
 * @swagger
 * /auth/cliente/login:
 *   post:
 *     summary: Realiza o login do usuário,
 *     tags: [Autenticação Cliente]
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
 *         description: Login realizado com sucesso
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
 *                   example: Usuário ou senha incorretos.
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
authRoutesCliente.post("/cliente/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Consulta usando await
        const [results] = await pool.query("SELECT * FROM cliente WHERE email = ?", [email]);

        if (results.length === 0) {
            return res.status(401).json({ error: "Usuário ou senha incorretos." });
        }

        const usuario = results[0];

        const senhaValida = await senha === usuario.senha ? true : false;
        if (!senhaValida) {
            return res.status(401).json({ error: "Usuário ou senha incorretos." });
        }

        const token = jwt.sign(
            { id: usuario.idperfil, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Envia o token como cookie HTTP only, para maior segurança
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // só em HTTPS produção
            maxAge: 86400000, // 24 hora em ms
            sameSite: "lax"
        });

        // Também pode enviar no json se quiser
        res.json({ message: "Login realizado com sucesso" });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

/**
 * @swagger
 * /auth/cliente/logout:
 *   post:
 *     summary: Realiza o logout do usuário,
 *     tags: [Autenticação Cliente]
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
 *                   example: Logout realizado com sucesso.
 */
authRoutesCliente.post("/cliente/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax"
    });

    res.json({ message: "Logout realizado com sucesso." });
});

export default authRoutesCliente