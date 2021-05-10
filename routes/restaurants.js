const express = require('express');
const { restaurants } = require('../config/mongoCollections');
const router = express.Router();
const restaurantData = require('../data/restaurants');
const reviewsData = require('../data/reviews');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    let restaurant = await restaurantData.getAll();
    try{
        res.json(restaurant);
    }catch(e){
        res.status(404).json({error: e});
    }
});

router.get('/register', async(req, res) => {
    return  res.status(200).render("restaurants/register", {layout: false});
});

router.post('/register', async(req, res) => {
    let restaurant = req.body;
    const password = await bcrypt.hash(restaurant.passwordHash, 16);
    try{
        await restaurantData.create(restaurant.name, restaurant.address, restaurant.email, restaurant.phone,
                                        restaurant.description, password);
        res.redirect('/restaurants/login');
    }catch(e){
        res.status(500).render("restaurants/register", {layout: false, hasError: true, errors: [e]});
    }
});

router.post('/login', async(req, res) => {
    let restaurantName = req.body.restaurantName;
    let password = req.body.password;

    let restaurantId = restaurantData.getId(restaurantName);
    let restaurant = restaurantData.get(restaurantId);

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