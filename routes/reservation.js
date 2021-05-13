const express = require('express');
const { customers } = require('../config/mongoCollections');
const { restaurants } = require('../config/mongoCollections');
const router = express.Router();
const customerData = require('../data/customers');
const restaurantData = require('../data/restaurants');
const reviewsData = require('../data/reviews');
const reservationsData = require('../data/reservations');
const bcrypt = require('bcryptjs');

//Get all the reviews for a particular restaurant
//Get all reviews for a person
//Post review to restaurant from person
router.get('/', async(req, res) => {
    try{
        let restaurants = await restaurantData.getAll();
        res.render('reservation/openRestaurants', {restaurants: restaurants});
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.post('/confirm/:id', async(req, res) => {
    let date = req.body.reservationDate.toString();
    let time = req.body.reservationTime.toString();
    let nopeople = Number.parseInt(req.body.no_of_guests);
    let restaurant = await restaurantData.get(req.params.id);
    let allRestaurants = await restaurantData.getAll();
    console.log(typeof nopeople);
    try{
        let newReservation = await reservationsData.create(req.params.id, req.session.customer._id, date, time, nopeople);
        console.log(newReservation);
        res.render("reservation/openRestaurants", {restaurants: allRestaurants});
    }catch(e){
        console.log(e);
        res.render("reservation/table", {restaurant: restaurant, customer: req.session.customer, error: e});
    }
});

router.get('/restaurant/:id', async(req, res) => {
    let customer = req.session.customer;
    try{
        let restaurant = await restaurantData.get(req.params.id);
        res.render("reservation/table", {customer: customer, restaurant: restaurant});
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.get('/restuarant/getall/:id', async(req, res) =>{
    try {
        let restaurant = await restaurantData.getId(req.params.id);
        let reservations = restaurant.reservations;
        res.json(reservations);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.get('/customer/:id', async(req, res) => {
    try{
        let customer = await customerData.getId(req.params.id);
        let reservations = customer.reservations;
        res.json(reservations);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.post('/customer/:id', async(req, res) => {
    let reservationDate = req.body.reservationDate;
    let reservationTime = req.body.reservationTime;
    let restaurantno_of_guests = req.body.no_of_guests;
    if(reservationDate.trim() == ''){
        //render the error that reservationDate is missing
        console.log('Reservation Date  cannot be blank!');
    }else if(!reservationTime){
        //render error message that reservationTime is missing
        console.log(' Reservation Time cannot be blank!');}
    else if(!restaurantno_of_guests){
            //render error message that no_of_guests is missing
            console.log('no_of_guests cannot be blank!');
    }else{
        try{
            let createdReservation = await reservationsData.create(restaurant._id, req.params.id, reservationDate, reservationTime,restaurantno_of_guests);
            res.json(createdReservation);
        }catch(e){
            res.status(500).json({error: e});
        }
    }
});

module.exports = router;