const customers = require('./customers');
const restaurants = require('./restaurants')
const path = require('path');
const reviews = require('./reviews');
const reservations = require('./reservation')

const constructorMethod = (app) => {
    app.use('/customers', customers);
    app.use('/restaurants', restaurants);
    app.use('/reservations', reservations);
    app.use('/reviews', reviews);
    app.get('/', (req, res) => {
        if (req.session.restaurant) {
            res.redirect("restaurants/private");
        } else if (req.session.customer) {
            res.redirect("customers/private");
        } else {
            res.render('home/home', {Title: 'Restaurant Table Reservation Page'});
        }
    });
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Not found'});
    });
};

module.exports = constructorMethod;