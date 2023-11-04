// This file is the entry point of the API server
// set up app and port variables
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queries');    // to get the exported functions from queries.js
const port = 3000;

// Sequelize
// https://www.youtube.com/watch?v=YNyGD4rakmc&list=PLkqiWyX-_Lov8qmMOVn4SEQwr9yOjNn3f&index=1
const Sequelize = require('sequelize');
const sequelize = new Sequelize('api', 'me', 'password', {
    port: 3000,
    dialect: 'postgres'
});

// Promise
sequelize.authenticate().then(() => {
    console.log("Connection successful!");
}).catch((err) => {
    console.log("Error connecting to database");
});

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// tell route to look for a GET request on the root / URL and return some JSON
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API'})
});

// tell the app to listen on the port you set
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});

// for each endpoint, set the HTTP request method, the endpoint URL path, and the relevant function
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)