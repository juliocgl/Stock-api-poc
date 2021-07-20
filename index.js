const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// MongoDB connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/stock", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB connection successful'));

// Define the models
const stockModel = require('./api/models/stock.js');
const reservationModel = require('./api/models/reservation.js');

// Define the routes
const routes = require('./api/routes/routes.js');

// Register the routes
routes(app);

app.listen(port, () => {
    console.log(`Stock REST API server running on ${port}`);
});