const customers = require('./customers');
const restaurants = require('./restaurants')
const path = require('path');

const constructorMethod = (app) => {
    app.use('/customers', customers);
    app.use('/restaurants', restaurants);
    app.get("/", (req, res) => {
        res.render(path.resolve("views/layouts/main"));
    })
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Not found'});
    });
};

module.exports = constructorMethod;