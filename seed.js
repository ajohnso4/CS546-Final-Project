const dbConnection = require('./config/mongoConnection');
const customersData = require('./data/customers');
const restaurantsData = require('./data/restaurants');
const reservationsData = require('./data/reservations');
const reviewsData = require('./data/reviews');

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    await restaurantsData.create("La Isla", "104 Washington St, Hoboken, NJ 07030", "laisla@gmail.com", 
        "201-659-8197", "Cozy, longtime venue serving budget Cuban classics for breakfast, lunch & dinner with BYO policy.", 
        "testpassword");
    await restaurantsData.create("Blue Eyes", "525 Sinatra Dr, Hoboken, NJ, 07030", "blueeyes@gmail.com", "201-683-6861",
        "Light-filled, modern Italian place with a Frank Sinatra theme & riverfront patio with skyline views.", 
        "testpassword");
    await restaurantsData.create("Sorellina", "1036 Washington St, Hoboken, NJ 07030", "sorellina@gmail.com", "201-963-3333",
        "Vibrant eatery with retro accents featuring Italian cuisine, old-country wines & sidewalk tables.",
        "testpassword");
    await restaurantsData.create("Onieal's", "343 Park Ave, Hoboken, NJ 07030", "onieal@gmail.com", "201-653-1492",
        "This neighborhood pub serves beer & New American chow in a casual space with outdoor seating.",
        "testpassword");
    await restaurantsData.create("Il Tavolo di Palmisano", "700 Clinton St, Hoboken, NJ 07030", "tavolo@gmail.com", "201-345-5980",
        "Italian restaurant",
        "testpassword");
    await customersData.create("Andrew", "Johnson", "ajohnso4@stevens.edu", "484-522-8181", "Hoboken", "NJ", "password");
    await customersData.create("Ali", "Kolenovic", "akolenovic@stevens.edu", "201-916-1502", "Hoboken", "NJ", "password");
    console.log('seeded!');
}

main();