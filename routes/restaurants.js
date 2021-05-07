const express = require('express');
const { restaurants } = require('../config/mongoCollections');
const router = express.Router();
const restaurantData = require('../data/restaurants');
const reviewsData = require('../data/reviews');

router.get('/', async (req, res) => {
    let restaurant = await restaurantData.getAll();
    try{
        res.json(customers);
    }catch(e){
        res.status(404).json({error: e});
    }
});

router.get('/:id', async (req, res) => {
    let restaurant;
    try{
        restaurant = await restaurantData.get(req.params.id);
    }catch(e){
        res.status(500).json({error: e});
    }
    try{
        res.json(restaurant);
    }catch(e){
        res.status(404).json({error: e});
    }
});

router.post('/', async (req, res) => {
    let restaurant = req.body;
    if (!restaurant.name) {
        res.status(400).json({error: 'You must provide a name!'});
    }
    if (!restaurant.address) {
        res.status(400).json({error: 'You must provide an address!'});
    }
    if (!restaurant.email) {
        res.status(400).json({error: 'You must provide an email!'});
    }
    if (!restaurant.phone) {
        res.status(400).json({error: 'You must provide a phone number!'});
    }
    if (!restaurant.description) {
        res.status(400).json({error: 'You must provide a description!'});
    }
    if (!restaurant.passwordHash) {
        res.status(400).json({error: 'You must provide a password!'});
    }
    try{
        await restaurantData.create(restaurant.name, restaurant.address, restaurant.email, restaurant.phone,
                                        restaurant.description, restaurant.passwordHash);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.delete('/:id', async (req, res) => {
    try{
        let restaurant = await restaurantData.remove(req.params.id);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.patch('/:id', async (req, res) => {
    try{
        await restaurantData.update(req.params.id, req.body);
    }catch(e){
        res.status(500).json({error: e});
    }
});

module.exports = router;