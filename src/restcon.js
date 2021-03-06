const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const port = process.env.PORT || 5000;

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('../public'))

app.use(morgan('short'))

app.post('/user_create', (req, res) => {
    console.log("Trying to create a new user....")
    console.log("How do we get the form data???")


    console.log("First name: " + req.body.create_first_name)
    const firstName = req.body.create_first_name
    const lastName = req.body.create_last_name

    const queryString = "INSERT INTO users (first_name, last_name) VALUES (?, ?)"
    getConnection().query(queryString, [firstName, lastName], (err, results, fields) => {
        if (err) {
            console.log("Failed" + err)
            res.sendStatus(500)
            return
        }

        console.log("Inserted a new user ", results.insertedId);
        res.end()
    })
    res.end()
})

    function getConnection() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345678',
            database: 'inspection'
        });
    }

app.get('/user/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id)

    const connection = getConnection()

    const id = req.params.id
    const queryString = "SELECT * FROM users WHERE id = ?"
    connection.query(queryString, [id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err)
            res.sendStatus(500)
            return
        }

        console.log("I think we fetched users successfully")

        const user = rows.map((row) => {
            return {firstName: row.first_name, lastName: row.last_name}
        })
        res.json(rows)
    })
    // res.end()
})

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello from ROOOT")
})

app.get("/users", (req, res) => {
    var user1 = { firstName: "Stephen", lastName: "Curry" }
    const user2 = { firstName: "Kevin", lastName: "Durant" }
    res.json([user1, user2])


    //res.send("Nodemon auto updates when I save this file")
})

// app.listen(5000, () => {
//     console.log("Server is up and listening on 3003.....")
// })
app.listen(port, () => console.log(`Listening on port ${port}`));