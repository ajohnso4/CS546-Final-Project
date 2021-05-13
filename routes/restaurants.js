const express = require('express');
const { restaurants } = require('../config/mongoCollections');
const router = express.Router();
const restaurantData = require('../data/restaurants');
const reviewsData = require('../data/reviews');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    let restaurant = await restaurantData.getAll();
    try {
        res.json(restaurant);
    } catch(e) {
        res.status(404).json({error: e});
    }
});

router.get('/register', async(req, res) => {
    return  res.status(200).render("restaurants/register");
});

router.get('/private', async(req, res) => {
    let restaurant = req.session.restaurant;
    res.render('restaurants/private', {restaurant: restaurant})
})

router.post('/register', async(req, res) => {
    let restaurant = req.body;
    const password = await bcrypt.hash(restaurant.passwordHash, 16);
    let restaurantDetails
    try{
        restaurantDetails = await restaurantData.create(restaurant.name, restaurant.address, restaurant.email, restaurant.phone,
                                        restaurant.description, password);
        req.session.restaurant = restaurantDetails;
        res.redirect('/restaurants/private');
    }catch(e){
        res.status(500).render("restaurants/register", {layout: false, hasError: true, errors: [e]});
    }
});

router.get('/login', async(req, res) => {
    if (req.session.restaurant) {
        return res.redirect("private");
    } else {
        return res.status(200).render("restaurants/login");
    }
})

router.post('/login', async(req, res) => {
    let restaurantName = req.body.restaurantName;
    let password = req.body.password;
    let restaurant;
    try {
        let restaurantId = await restaurantData.getId(restaurantName);
        restaurant = await restaurantData.get(restaurantId);
    } catch (e) {
        res.status(401).render("restaurants/login",{errors:[e], hasError: true});
    }
    
    if(restaurant){

        let validPwd = await bcrypt.compareSync(password, restaurant.passwordHash);
        if(!validPwd){
            res.status(401).render("restaurants/login",{errors:["Invalid password"], hasError: true});
            return;
        }
       
        req.session.restaurant = restaurant;
        res.redirect("/restaurants/private");
    }

    if(!req.session.restaurant){
        res.status(401).render("restaurants/login", {layouts: false,
            errors: ['Provide username', 'Provide password'], hasError: true
        })
        return;
    }
    
});

router.get('/reservation', async(req, res) => {
    if (!req.session.restaurant) {
        return res.redirect('/')
    }
    let restaurant = req.session.restaurant
    return res.render('restaurants/reservation', {reservation: restaurant.reservations})
})

router.get('/logout', async(req, res) => {
    req.session.destroy();
    res.render('restaurants/logout')
})

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