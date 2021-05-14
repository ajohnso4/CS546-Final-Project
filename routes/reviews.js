const express = require('express');
const { customers } = require('../config/mongoCollections');
const { restaurants } = require('../config/mongoCollections');
const router = express.Router();
const customerData = require('../data/customers');
const restaurantData = require('../data/restaurants');
const reviewsData = require('../data/reviews');


router.get('/', async(req, res) => {
    try{
        let restaurants = await restaurantData.getAll();
        return res.render('review/restaurantsList', {restaurants: restaurants});
    }catch(e){
        res.status(500).json({error: e});
    }

});
router.get('/restaurant/:id', async(req, res) =>{
    try {
        let restaurant = await restaurantData.get(req.params.id);
        let customer = req.session.customer;
        if (customer) {
            reviewed = await reviewsData.hasReviewed(req.params.id, customer.reviews);
            if (reviewed) {
                res.render('review/restaurantReview', {restaurant: restaurant, isCustomer: false});
            } else {
                res.render('review/restaurantReview', {restaurant: restaurant, isCustomer: true, customer: req.session.customer});
            }
        } else {
            res.render('review/restaurantReview', {restaurant: restaurant, isCustomer: false});
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

module.exports = router;