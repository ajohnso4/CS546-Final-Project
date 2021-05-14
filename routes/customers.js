const express = require('express');
const { customers } = require('../config/mongoCollections');
const router = express.Router();
const customerData = require('../data/customers');
const restaurantData = require('../data/restaurants')
const reviewsData = require('../data/reviews');
const bcrypt = require('bcryptjs');
const e = require('express');

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
    let email = req.body.email;
    let password = req.body.password;
    if (email && password) {
        let userID = await customerData.getfromEmail(email);
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
            res.render("users/login", { title: "Login Screen", errors: ["Invalid Login Information"] });
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
    let customer = req.session.customer;
    let id = customer._id;
    let custReservations = customer.reservations;
    let reservations = []
    let obj = {}
    try {
        for (let i = 0; i < custReservations.length; i++) {
            let restaurantID = custReservations[i].restaurantId
            let restaurant = await restaurantData.get(restaurantID)
            for (let j = 0; j < restaurant.reservations.length; j++) {
                if (restaurant.reservations[j].customerId === id) {
                    obj = {
                        name: restaurant.name,
                        address: restaurant.address,
                        phone: restaurant.phone,
                        no_of_guests: restaurant.reservations[j].no_of_guests,
                        reservationDate: restaurant.reservations[j].reservationDate,
                        reservationTime: restaurant.reservations[j].reservationTime
                    }
                    reservations.push(obj)
                }
            }
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