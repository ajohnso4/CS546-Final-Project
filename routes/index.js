const customers = require('./customers');
const path = require('path');

const constructorMethod = (app) => {
    app.use('/customers', customers);
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Not found'});
    });
};

module.exports = constructorMethod;