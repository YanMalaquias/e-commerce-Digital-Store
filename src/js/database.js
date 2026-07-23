const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho absoluto para a pasta data (garante compatibilidade no Render.com)
const dbPath = path.resolve(__dirname, '../data/database.sqlite');

// Conecta ao banco de dados SQLite (cria o arquivo database.sqlite se não existir)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        // Cria a tabela de usuários se não existir
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstname TEXT NOT NULL,
            surname TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha_hash TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela users:', err.message);
            } else {
                console.log('Tabela users pronta.');

                // Adiciona índice para a coluna email para melhorar a performance de buscas no login/reset
                db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`, (err) => {
                    if (err) {
                        console.error('Erro ao criar índice na tabela users:', err.message);
                    } else {
                        console.log('Índice na coluna email pronto.');
                    }
                });
            }
        });
    }
});

module.exports = db;