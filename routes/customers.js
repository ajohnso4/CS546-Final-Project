const express = require('express');
const { customers } = require('../config/mongoCollections');
const router = express.Router();
const customerData = require('../data/customers');
const restaurantData = require('../data/restaurants');
const reservationData = require('../data/reservations');
const reviewsData = require('../data/reviews');
const bcrypt = require('bcryptjs');
const e = require('express');
const xss = require('xss')

router.get('/', async (req, res) => {
    let customers = await customerData.getAll();
    res.json(customers);
});

router.get('/private', async (req, res) => {
    customer = req.session.customer;
    res.render("users/profile", { customer: customer });
})

router.post('/register', async (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let phone = req.body.phone;
    let city = req.body.city;
    let state = req.body.state;
    let password = req.body.password;
    let errors = [];

    if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
        errors.push("Invalid first name")
        res.status(401).render('users/signup', {errors: errors})
        return;
     }
    if (!lastName || typeof lastName !== 'string' || !lastName.trim()){
        errors.push("Invalid last name")
        res.status(401).render('users/signup', {errors: ["Invalid last name"]})
        return;
     }
     
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
        errors.push("Invalid phone")
        res.status(401).render('users/signup', {errors: errors})
        return;
     }
    if (!city || typeof city !== 'string' || !city.trim()) {
        errors.push("Invalid city")
        res.status(401).render('users/signup', {errors: errors})
        return;
     }
    if (!state || typeof state !== 'string' || !state.trim()) {
        errors.push("Invalid state")
        res.status(401).render('users/signup', {errors: errors})
        return;
     }
    if (!password || typeof password !== 'string' || !password.trim()) {
        errors.push("Invalid password")
        res.status(401).render('users/signup', {errors: errors})
        return;
     }
    if (!email || typeof email !== 'string' || !email.trim()) {
        errors.push("Invalid email")
        res.status(401).render('users/signup', {errors: errors})
        return;
     }

    const hashedPassword = await bcrypt.hash(password, 16);
    try {
        let customer = await customerData.create(firstName, lastName, email, phone, city, state, hashedPassword);
        req.session.customer = customer
        res.redirect('/customers/private');
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/login', async (req, res) => {
    if (req.session.customer) {
        res.redirect('/customers/private')
    } else {
        res.render("users/login", { Title: 'Customer Login' });
    }
});

router.post("/login", async (req, res) => {
    let email = xss(req.body.email);
    let password = xss(req.body.password);
    errors =[];
    if (!email || typeof email !== 'string' || !email.trim()) {
       res.render('users/login', {errors: ["Invalid email ID"]})
       return;
    }
    if (email && password) {
        let userID = await customerData.getfromEmail(email);
        if(userID == -1){
            res.render("users/login", {title: "Login Screen", errors:["Invalid Email ID"]});
        }else{
        console.log(userID);
        let customer = await customerData.get(userID)
        if (customer != -1) {
            let validPwd = await bcrypt.compareSync(password, customer.passwordHash);
            if (!validPwd) {
                res.render("users/login", { errors: ["Password is incorrect"] });
            } else {
                res.cookie("name", "AuthCookie");
                req.session.customer = customer;
                res.redirect('/customers/private');
            }
        } else {
            res.render("users/login", { title: "Login Screen", errors:errors });
        }
    }
    } else {
        res.render("users/login", { title: "Login Screen", errors: ["Invalid Login Information"] });
    }
});

router.get('/register', async (req, res) => {
    if (req.session.customer) {
        res.redirect('/customers/private')
    }
    res.render('users/signup');
});

router.get('/reservations', async (req, res) => {
    if (!req.session.customer) {
        res.redirect("/")
    }
    let customer = await customerData.get(req.session.customer._id);
    let id = customer._id;
    let custReservations = customer.reservations;
    let reservations = []
    let obj = {}
    try {
        for (let i = 0; i < custReservations.length; i++) {
            let restaurantID = custReservations[i].restaurantId
            let restaurant = await restaurantData.get(restaurantID)
                    obj = {
                        id: custReservations[i]._id,
                        name: restaurant.name,
                        address: restaurant.address,
                        phone: restaurant.phone,
                        no_of_guests: custReservations[i].no_of_guests,
                        reservationDate: custReservations[i].reservationDate,
                        reservationTime: custReservations[i].reservationTime
                    }
                    reservations.push(obj)
        }

        return res.render('reservation/customerReservation', { reservations: reservations })
    } catch (e) {
        res.status(500).json({ error: e });
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie('name');
    res.redirect('/');
});

router.get('/resdelete/:id', async(req, res) => {
    let reservationid = req.params.id;
    console.log(reservationid);
    console.log(typeof reservationid);
    let reservation = await reservationData.get(reservationid);
    let customer = await customerData.get(reservation.customerId);
    let restaurant = await restaurantData.get(reservation.restaurantId);
    for(let i = 0; i < customer.reservations.length; i++){
        if(customer.reservations[i]._id == reservation._id){
            customer.reservations.splice(i, 1);
            continue;
        }
    }
    for(let i = 0; i < restaurant.reservations.length; i++){
        if(restaurant.reservations[i]._id == reservation._id){
            restaurant.reservations.splice(i, 1);
            continue;
        }
    }
    let newcustomer = await customerData.update(customer._id, customer);
    let newrestaurant = await restaurantData.update(restaurant._id, restaurant);
    console.log(newcustomer);
    console.log(newrestaurant);
    res.redirect('/customers/reservations');
})

router.get('/:id', async (req, res) => {
    let customer;
    try {
        customer = await customerData.get(req.params.id);
    } catch (e) {
        res.status(500).json({ error: e });
    }
    try {
        res.json(customer);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let customer = await customerData.remove(req.params.id);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        await customerData.update(req.params.id, req.body);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;