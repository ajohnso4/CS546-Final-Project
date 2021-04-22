const express = require('express');
const { customers } = require('../config/mongoCollections');
const router = express.Router();
const customerData = require('../data/customers');
const reviewsData = require('../data/reviews');

router.get('/', async (req, res) => {
    let customers = await customerData.getAll();
    try{
        res.json(customers);
    }catch(e){
        res.status(404).json({error: e});
    }
});

router.get('/:id', async (req, res) => {
    let customer;
    try{
        customer = await customerData.get(req.params.id);
    }catch(e){
        res.status(500).json({error: e});
    }
    try{
        res.json(customer);
    }catch(e){
        res.status(404).json({error: e});
    }
});

router.post('/', async (req, res) => {
    let customer = req.body;
    try{
        await customerData.create(customer.firstName, customer.lastName, customer.email, customer.phone, customer.city, customer.state, customer.passwordHash);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.delete('/:id', async (req, res) => {
    try{
        let customer = await customerData.remove(req.params.id);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.patch('/:id', async (req, res) => {
    try{
        await customerData.update(req.params.id, req.body);
    }catch(e){
        res.status(500).json({error: e});
    }
});

module.exports = router;