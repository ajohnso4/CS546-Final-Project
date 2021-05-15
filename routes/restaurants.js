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

router.get('/login', async(req, res) => {
    if(!req.session.restaurant){
        res.status(200).render("restaurants/login");
    } else {
        res.redirect("/restaurants/private")
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
    let restaurantDetails;
    let name =restaurant.name;
    let website = restaurant.website;
    let address = restaurant.address; 
    let email= restaurant.email;
    let phone = restaurant.phone;
    let description = restaurant.description;

    if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(401).render("restaurants/register", {layout: false,errors: ["Invalid Name Provided"]})
        return;
    }

    if (!website || typeof website !== 'string' || !address.trim()) {
        res.status(401).render("restaurants/register", {layout: false, errors: ["Invalid Website Provided"]})
        return;
    }

    if (!address || typeof address !== 'string' || !address.trim()) {
        res.status(401).render("restaurants/register", {layout: false,  errors: ["Invalid Address Provided"]})
        return;
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
        res.status(401).render("restaurants/register", {layout: false,  errors: ["Invalid Phone Number Provided"]})
        return;
    }
    if (!description || typeof description  !== 'string' || !description.trim()) {
        res.status(401).render("restaurants/register", {layout: false, errors: ["Invalid Description Provided"]})
        return;
    }
    if (!password || typeof password !== 'string' || !password.trim()) {
        res.status(401).render("restaurants/register", {layout: false, errors: ["Invalid Passowrd Provided"]})
        return;
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
        res.status(401).render("restaurants/register", {layout: false,  errors: ["Invalid Email Provided"]})
        return;
    }
    try{
        restaurantDetails = await restaurantData.create(restaurant.name, restaurant.website, restaurant.address, restaurant.email, restaurant.phone,
                                        restaurant.description, password);
        req.session.restaurant = restaurantDetails;
        console.log(restaurantDetails);
        res.redirect('/restaurants/private');
    }catch(e){
        res.status(500).render("restaurants/register", {layout: false, errors: ["Provide Valid Details"]});
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
    
    if (!restaurantName || typeof restaurantName !== 'string' || !restaurantName.trim()){
        res.status(401).render("restaurants/login", {layout: false, errors: ["Invalid Name Provided"]})
        return;
    }
    if (!password || typeof password !== 'string' || !password.trim()) {
        res.status(401).render("restaurants/login", {layout: false, errors: ["Invalid Password Provided"]})
        return;
    }
    let restaurant;
    try {
        let restaurantId = await restaurantData.getId(restaurantName);
        restaurant = await restaurantData.get(restaurantId);
    } catch (e) {
        res.status(500).render("restaurants/login",{errors:["invalid Info"]});
    }
    
    if(restaurant){

        let validPwd = await bcrypt.compareSync(password, restaurant.passwordHash);
        if(!validPwd){
            res.status(401).render("restaurants/login",{errors:["Invalid password"]
        });
            return;
        }
       
        req.session.restaurant = restaurant;
        res.redirect("/restaurants/private");
    }

    // if(!req.session.restaurant){
    //     res.status(401).render("restaurants/login", {layouts: false,
    //         errors: ['Provide username', 'Provide password'], hasError: true
    //     })
    //     return;
    // }
    
});

router.get('/reservation', async(req, res) => {
    if (!req.session.restaurant) {
        return res.redirect('/');
    }
    let restaurant = req.session.restaurant;
    return res.render('reservation/restaurantReservation', {reservations: restaurant.reservations, reviewLink: restaurant._id});
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

router.get('/:id', async (req, res) => {
    try{
        let restaurant = await restaurantData.get(req.params.id);
        res.json(restaurant);

    }catch(e) {
        res.status(500).json({error: e});
    }
});
module.exports = router;