// This is the API ??
// will use the node-postgres module to create a pool of connections so 
//     we don't have to open and close a client each time we make a query
//     pgBouncer is a popular option for production pooling

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
});

// GET all users
const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    })
};

// GET a single user by ID
const getUserById = (request, response) => {
    const id = parseInt(request.params.id)      // ??????????
  
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

// POST a new user
// extracting the name and email properties from the request body and inserting the values with INSERT
const createUser = (request, response) => {
    const { name, email } = request.body   // ?????????
  
    pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', 
        [name, email], 
        (error, results) => {
            if (error) {
                throw error
            }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
};

// PUT updated data in an existing user
//      combining what we learned in GET and POST to use the UPDATE clause
//      PUT is idempotent = the exact same call can be made over and over and will produce the same result
//      POST - the exact same call repeated will continuously make new users with the same data
const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
  
    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error
            }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
};

// DELETE a user
const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)      // ??????????
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}




