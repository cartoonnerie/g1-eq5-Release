const dbConfig = require('../config/db');

const express = require('express');
const app = express();
const path = require("path");
const ejs = require('ejs');
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname , '/views/css')));
app.use(express.static(path.join(__dirname , '/views/js')));
app.use(bodyParser.urlencoded({extended: false}));
dbConfig.connectToDB();

app.get('/', (req, res) => {
    res.render('projects');
});

const projects = require('./routes/projects');
const backlog = require('./routes/backlog');

app.use('/projects', projects);
app.use('/backlog', backlog);

app.listen(8080, () => console.log("App listening on port 8080"));

module.exports = app; // for testing