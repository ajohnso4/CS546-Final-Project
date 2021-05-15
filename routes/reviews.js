const express = require('express');
const { customers } = require('../config/mongoCollections');
const { restaurants } = require('../config/mongoCollections');
const router = express.Router();
const customerData = require('../data/customers');
const restaurantData = require('../data/restaurants');
const reviewsData = require('../data/reviews');
const path = require('path');
const { write } = require('fs');


router.get('/', async(req, res) => {
    try{
        if (req.session.customer) {
            let restaurants = await restaurantData.getAll();
            return res.render('review/restaurantsList', {restaurants: restaurants});
        } else {
            res.sendFile(path.resolve('public/html/reviews.html'));
        }

    }catch(e){
        res.status(500).json({error: e});
    }

});
router.get('/restaurant/:id', async(req, res) =>{
    try {
        let restaurant = await restaurantData.get(req.params.id);
        let customer = req.session.customer;
        if (customer) {
            res.render('review/restaurantReview', {restaurant: restaurant, showForm: true});
        } else {
            res.render('review/restaurantReview', {restaurant: restaurant, showForm: false, hasReview: false});
        }
        
    }catch(e){
        res.status(500).json({error: e.toString()});
    }
});

router.get('/customer/:id', async(req, res) => {
    try{
        let customer = await customerData.getId(req.params.id);
        let reviews = customer.reviews;
        res.json(reviews);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.post('/restaurant/:id', async(req, res) => {
    let review = req.body.review;
    let rating = req.body.rating;
    let customer = req.session.customer;
    errors =[];
    let restaurant;
    try {
        restaurant = await restaurantData.get(req.params.id);
    } catch (e) {
        res.status(500).json();
    }

    if (!review || typeof review !== 'string' || !review.trim()) {
        errors.push('Invalid review.');
        res.status(401).render('review/restaurantReview', {restaurant: restaurant, showForm: true, errors: errors});
        return;
    }
    console.log(rating)
    if (!rating || typeof rating !== 'string' || !rating.trim() ||parseInt(rating) < 1 ||parseInt(rating) >5) {
        errors.push('Invalid Rating.');
        res.status(401).render('review/restaurantReview', {restaurant: restaurant, showForm: true, errors: errors});
        return;
    }
    
    if(review.trim() == ''){
        //render the error message on the page
        console.log('Review Cannot be blank!');
    }else if(!rating){
        //render error message that rating is missing
        console.log('Rating cannot be blank!');
    }else{
        try{
            let createdReview = await reviewsData.create(restaurant._id.toString(), customer._id.toString(), review, Number.parseInt(rating));
            res.redirect('/reviews/restaurant/' + req.params.id);
        }catch(e){
            res.status(500).json();
        }
    }
});

router.post('/delete/:id', async(req, res) => {
    try {
        let review = reviewsData.remove(req.params.id);
    } catch (e) {
        res.status(500).json({error: e.toString()});
    }
});

router.get('/allReviews', async(req, res) => {
    try{
        let reservations = await reviewsData.getAll();
        res.json(reservations);
    } catch (e) {
        res.status(500).json({error: e});
    }
});
module.exports = router;