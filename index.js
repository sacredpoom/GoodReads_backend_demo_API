const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

db.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});