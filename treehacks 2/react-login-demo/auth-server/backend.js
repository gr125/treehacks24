const express = require("express");
const cors = require("cors"); // Import the cors middleware
const { Pool } = require('pg');

const app = express();
const port = 3080;

// Use the cors middleware
app.use(cors());

// Create a PostgreSQL pool
const pool = new Pool({
    user: 'brendantang',
    host: 'localhost',
    database: 'ehr',
    port: 5432,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint for user login
app.post("/auth", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Connect to the database
        const client = await pool.connect();

        // Query the database to retrieve the user record by email
        const result = await client.query('SELECT * FROM account WHERE email = $1', [email]);
        const user = result.rows[0];
        // If user with the provided email doesn't exist, return error
        if (!user) {
            console.log('failed user test')
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Verify the password (plaintext comparison for simplicity)
        if (password !== user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Close the connection
        client.release();

        // Return success response with user ID
        res.status(200).json({ message: "success", userId: user.id });
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ message: "An error occurred" });
    }
});

// Endpoint to fetch user information
app.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        // Connect to the database
        const client = await pool.connect();

        // Fetch data from different tables based on the user ID
        const patientsQuery = 'SELECT birthdate, first, last, race, ethnicity, address, city, state FROM patients WHERE id = $1';
        const allergiesQuery = 'SELECT start, description, type, category, description1, severity1, description2, severity2 FROM allergies WHERE patient = $1';
        const careplansQuery = 'SELECT start, stop, description, reasondescription FROM careplans WHERE patient = $1';
        const conditionsQuery = 'SELECT START,STOP,DESCRIPTION FROM conditions WHERE patient = $1';
        const observationsQuery = 'SELECT DATE, CATEGORY, DESCRIPTION, VALUE, UNITS, TYPE FROM observations WHERE patient = $1';

        const patientsResult = await client.query(patientsQuery, [userId]);
        const allergiesResult = await client.query(allergiesQuery, [userId]);
        const careplansResult = await client.query(careplansQuery, [userId]);
        const conditionsResult = await client.query(conditionsQuery, [userId]);
        const observationsResult = await client.query(observationsQuery, [userId]);

        // Close the connection
        client.release();

        // Combine the results from all queries
        const userData = {
            patients: patientsResult.rows,
            allergies: allergiesResult.rows,
            careplans: careplansResult.rows,
            conditions: conditionsResult.rows,
            observations: observationsResult.rows
        };

        console.log(userData)

        // Return user information
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ message: "An error occurred" });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
