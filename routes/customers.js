const express = require('express');
const { customers } = require('../config/mongoCollections');
const router = express.Router();
const customerData = require('../data/customers');
const reviewsData = require('../data/reviews');

router.get('/', async (req, res) => {
    let customers = await customerData.getAll();
    try{
        res.json(customers);
    }catch(e){
        res.status(404).json({error: e});
    }
});

router.get('/:id', async (req, res) => {
    let customer;
    try{
        customer = await customerData.get(req.params.id);
    }catch(e){
        res.status(500).json({error: e});
    }
    try{
        res.json(customer);
    }catch(e){
        res.status(404).json({error: e});
    }
});

router.post('/', async (req, res) => {
    let customer = req.body;
    try{
        let passwordHash = 
        await customerData.create(customer.firstName, customer.lastName, customer.email, customer.phone, customer.city, customer.state, customer.passwordHash);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.delete('/:id', async (req, res) => {
    try{
        let customer = await customerData.remove(req.params.id);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.patch('/:id', async (req, res) => {
    try{
        await customerData.update(req.params.id, req.body);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.post("/login", async (req, res) =>{
    let email = req.body.email;
    let password = req.body.password;
    if(username && password){
        let userID = await users.getfromEmail(email);
        if(userID != -1){
            let user = await users.passwordCorrect(userID, password);
            if(user == false){
                res.render("users/login", {title: "Login Screen", error: "Password is incorrect"});
            }else{
                res.cookie("name", "AuthCookie");
                req.session.user = user;
                res.redirect('/private');
            }
        }else{
            res.render("users/login", {title: "Login Screen", error: "Invalid Login Information"});
        }
    }else{
        res.render("users/login", {title: "Login Screen", error: "Invalid Login Information"});
    }
});

module.exports = router;