const express = require('express');
const { customers } = require('../config/mongoCollections');
const { restaurants } = require('../config/mongoCollections');
const router = express.Router();
const customerData = require('../data/customers');
const restaurantData = require('../data/restaurants');
const reviewsData = require('../data/reviews');
const bcrypt = require('bcrypt');

//Get all the reviews for a particular restaurant
//Get all reviews for a person
//Post review to restaurant from person

router.get('/restuarant/:id', async(req, res) =>{
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
    let restaurant = req.body.restaurant;
    if(review.trim() == ''){
        //render the error message on the page
        console.log('Review Cannot be blank!');
    }else if(!rating){
        //render error message that rating is missing
        console.log('Rating cannot be blank!');
    }else{
        try{
            let createdReview = await reviewsData.create(restaurant._id, req.params.id, review, rating);
            res.json(createdReview);
        }catch(e){
            res.status(500).json({error: e});
        }
    }
});

module.exports = router;