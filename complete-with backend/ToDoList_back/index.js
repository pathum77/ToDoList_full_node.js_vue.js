const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());
app.use(cors());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todowebapp'
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection success');
    else
        console.log('DB connection failed \n Error: ' + JSON.stringify(err, undefined, 2));
});

app.listen(3000, () => console.log('server running on posr 3000'));


//get tasklist
app.post('/todo/getall', (req, res) => {
    let userid = req.body.userid;
    mysqlConnection.query("SELECT * FROM tasklist WHERE userid ='" + userid + "'", (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//insert task
app.post('/task/add', (req, res) => {
    let newTask = req.body.taskName;
    let userId = req.body.userid;
    let status = "To-Do";
    mysqlConnection.query("INSERT INTO tasklist (userid, task, status) VALUES ('" + userId + "', '" + newTask + "', '" + status + "')", (err, rows, fields) => {
        if (!err)
            res.send('Added');
        else
            console.log(err);
    });
});

// delete task
app.delete('/task/delete/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM tasklist WHERE taskid = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully');
        else
            console.log(err);
    })
});

//edit task
app.post('/task/edit/:id', (req, res) => {
    let taskStatus = req.body.taskStatus;
    mysqlConnection.query("UPDATE tasklist SET status = '" + taskStatus + "' WHERE taskid = ?", [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Updated');
        else
            console.log(err);
    })
});

////////Login Register/////////////

app.post('/user/register', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    mysqlConnection.query("SELECT * FROM users WHERE email = '" + email + "'", (err, rows, fields) => {
        if (rows.length > 0) {
            res.send('500')
        }
        else {
            res.send('201');
            mysqlConnection.query("INSERT INTO users (email, password) VALUES ('" + email + "', '" + password + "')", (err, rows, fields) => {
            });
        }
    });
});

app.post('/user/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    mysqlConnection.query("SELECT * FROM users WHERE email = '" + email + "' and password = '" + password + "'", (err, rows, fields) => {
        if (rows.length > 0)
            res.send('201')
        else
            res.send('500');
    });
});