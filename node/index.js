const express = require('express');
const mysql = require('mysql2/promise'); 
const app = express();
const port = 3000;

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}

const CREATE_TABLE_QUERY = `
    CREATE TABLE IF NOT EXISTS people (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    );
`;

const CREATE_PEOPLE_QUERY = `
    INSERT INTO people (name) VALUES (?);
`;

const GET_PEOPLE_QUERY = `
    SELECT * FROM people;
`;

async function initializeDatabase() {
    const connection = await mysql.createConnection(config);
    
    await connection.query(CREATE_TABLE_QUERY);

    await connection.query(CREATE_PEOPLE_QUERY, ['Leonardo Blume']);  

    return connection; 
}

app.get('/', async (req, res) => {
    let connection;
  
    try {
        connection = await mysql.createConnection(config);
       
        await connection.query(CREATE_PEOPLE_QUERY, ['Leonardo Blume']);  

        const [rows] = await connection.query(GET_PEOPLE_QUERY);

        const peopleFormatted = rows.map(row => `<p>${row.name}</p>`).join('');

        res.send('<h1>Full Cycle Rocks!!</h1>' + peopleFormatted);
    } catch (err) {
        console.error('Database error: ', err);
        res.status(500).send('An error occurred while querying the database.');
    } finally {
        if (connection) {
            connection.end();
        }
    }
});

initializeDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Database initialization error: ', err);
    });