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
        res.render('review/restaurantReview', {restaurant: restaurant})
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