const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'teste',
    database: 'gabriel'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('MySQL Connected...');
});

// Endpoint para obter todas as pessoas
app.get('/pessoa', (req, res) => {
    let sql = 'SELECT * FROM pessoa';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching pessoas:', err);
            return res.status(500).send('Server error');
        }
        res.send(results);
    });
});

// Endpoint para criar uma nova pessoa
app.post('/pessoa', (req, res) => {
    const pessoa = req.body;
    const sql = 'INSERT INTO pessoa SET ?';
    db.query(sql, pessoa, (err, result) => {
        if (err) {
            console.error('Error adding pessoa:', err);
            return res.status(500).send('Server error');
        }
        res.send(result);
    });
});

// Endpoint para atualizar uma pessoa existente
app.put('/pessoa/:id', (req, res) => {
    const { nome, endereco, bairro, cidade, UF, telefone } = req.body;
    const sql = 'UPDATE pessoa SET nome = ?, endereco = ?, bairro = ?, cidade = ?, UF = ?, telefone = ? WHERE id = ?';
    const values = [nome, endereco, bairro, cidade, UF, telefone, req.params.id];
    
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating pessoa:', err);
            return res.status(500).send('Server error');
        }
        res.send(result);
    });
});

// Endpoint para deletar uma pessoa
app.delete('/pessoa/:id', (req, res) => {
    const sql = 'DELETE FROM pessoa WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting pessoa:', err);
            return res.status(500).send('Server error');
        }
        res.send(result);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
