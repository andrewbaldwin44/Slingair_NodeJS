'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { handleFlight, handleFourOhFour } = require('./handlers');

const PORT = process.env.PORT || 8000;

app
.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
.use(morgan('dev'))
.use(express.static('public'))
.use(bodyParser.json())
.use(express.urlencoded({extended: false}))

.get('/flights/:flightNumber', handleFlight)
.get('*', handleFourOhFour)

.listen(PORT, () => console.log(`Listening on port ${PORT}`));
