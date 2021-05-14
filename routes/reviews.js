const express = require('express');
const { customers } = require('../config/mongoCollections');
const { restaurants } = require('../config/mongoCollections');
const router = express.Router();
const customerData = require('../data/customers');
const restaurantData = require('../data/restaurants');
const reviewsData = require('../data/reviews');

router.get('/restaurant/:id', async(req, res) =>{
    try {
        let restaurant = await restaurantData.get(req.params.id);
        let customer = req.session.customer;
        if (customer) {
            reviewed = await reviewsData.hasReviewed(req.params.id, customer.reviews);
            if (reviewed) {
                res.render('review/restaurantReview', {restaurant: restaurant, showForm: true, hasReview: true, review: reviewed});
            } else {
                res.render('review/restaurantReview', {restaurant: restaurant, showForm: true, hasReview: false});
            }
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

router.post('/customer/:id', async(req, res) => {
    let review = req.body.review;
    let rating = req.body.rating;
    let customer = req.session.customer;
    let restaurant;
    try {
        restaurant = await restaurantData.get(req.params.id);
    } catch (e) {
        res.status(500).json({error: e.toString()});
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
            res.status(500).json({error: e.toString()});
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

module.exports = router;