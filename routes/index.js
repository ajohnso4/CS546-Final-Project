const customers = require('./customers');
const restaurants = require('./restaurants')
const reservations = require('/reservations')
const path = require('path');
const path = require('./reviews');

const constructorMethod = (app) => {
    app.use('/customers', customers);
    app.use('/restaurants', restaurants);
    app.use('/reservations', reservations);
    app.get('/', (req, res) => {
        res.render('home/home', {Title: 'Restaurant Table Reservation Page'});
    });
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Not found'});
    });
};

module.exports = constructorMethod;