require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_secreta_super_segura';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Configurações
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Limitar login a 5 tentativas a cada 15 minutos
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Muitas tentativas de login. Tente novamente mais tarde.' }
});

// Limitar registro a 3 por hora por IP
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { message: 'Muitas tentativas de registro. Tente novamente mais tarde.' }
});

// Rota de Cadastro
app.post('/api/register', registerLimiter, (req, res) => {
    const { firstname, surname, email, senha } = req.body;

    if (!firstname || !surname || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    if (senha.length < 8) {
        return res.status(400).json({ message: 'Senha deve ter no mínimo 8 caracteres.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email inválido.' });
    }

    // Faz o hash da senha
    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao processar a senha.', error: err.message });
        }

        // Insere o usuário no banco de dados
        db.run('INSERT INTO users (firstname, surname, email, senha_hash) VALUES (?, ?, ?, ?)', [firstname, surname, email, hash], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ message: 'Email já cadastrado.' });
                }
                return res.status(500).json({ message: 'Erro ao salvar usuário.', error: err.message });
            }

            const token = jwt.sign({ id: this.lastID, email }, SECRET_KEY, { expiresIn: '24h' });

            res.status(201).json({ 
                message: 'Usuário cadastrado com sucesso!', 
                token, 
                user: { id: this.lastID, firstname, surname, email } 
            });
        });
    });
});

// Rota de Login
app.post('/api/login', loginLimiter, (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email inválido.' });
    }

    // Busca o usuário pelo email
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        // Compara a senha informada com o hash salvo
        bcrypt.compare(senha, user.senha_hash, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao verificar a senha.', error: err.message });
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Email ou senha incorretos.' });
            }

            // Gera o token JWT
            const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
            
            const { senha_hash, ...userWithoutPassword } = user;

            res.json({ message: 'Login realizado com sucesso!', token, user: userWithoutPassword });
        });
    });
});

// Reset de senha
const resetCodes = {};

app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório.' });
    }
    
    db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
        if (!user) {
            return res.status(404).json({ message: 'Email não encontrado.' });
        }
        
        // Gerar código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        resetCodes[email] = { code, expiresAt: Date.now() + 15 * 60 * 1000 };
        
        console.log(`Reset code for ${email}: ${code}`);
        
        res.json({ message: 'Código enviado para seu email.' });
    });
});

app.post('/api/reset-password', (req, res) => {
    const { email, code, newPassword } = req.body;
    
    if (!resetCodes[email]) {
        return res.status(400).json({ message: 'Código expirado.' });
    }
    
    if (resetCodes[email].code !== code || resetCodes[email].expiresAt < Date.now()) {
        return res.status(400).json({ message: 'Código inválido ou expirado.' });
    }
    
    bcrypt.hash(newPassword, 10, (err, hash) => {
        db.run(
            'UPDATE users SET senha_hash = ? WHERE email = ?',
            [hash, email],
            (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Erro ao resetar senha.' });
                }
                
                delete resetCodes[email];
                res.json({ message: 'Senha alterada com sucesso.' });
            }
        );
    });
});


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});