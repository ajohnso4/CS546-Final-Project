const express = require('express');
const { restaurants } = require('../config/mongoCollections');
const router = express.Router();
const restaurantData = require('../data/restaurants');
const reviewsData = require('../data/reviews');
const bcryptjs = require('bcryptjs');

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


router.get('/signup', async(req, res) => {
    console.log("asdfghjk")
    res.render("layouts/main")
})


router.post('/login', async(req, res) => {
    let restaurantName = req.body.restaurantName;
    let password = req.body.password;

    let restaurant = restaurantData.getId(restaurantName);

    if(restaurant){

        let validPwd = await bcryptjs.compareSync(password, restaurant.passwordHash);
        if(!validPwd){
            res.status(401).render("restaurants/login",{layouts: false, errors:["Invalid password"], hasError: this.true});
            return;
        }
       
        req.session.restaurant = restaurantName;
        res.redirect("/private");
    }

    if(!req.session.restaurant){
        res.status(401).render("restaurants/login", {layouts: false,
            errors: ['Provide username', 'Provide password'], hasError: true
        })
        return;
    }
    
})

router.post('/register', async (req, res) => {
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
    var password;
    bcryptjs.genSalt(16, function(err, salt) {
        bcryptjs.hash(restaurant.passwordHash, salt, null, function(err, hash) {
            password = hash;
        })
    })
    try{
        await restaurantData.create(restaurant.name, restaurant.address, restaurant.email, restaurant.phone,
                                        restaurant.description, password);
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