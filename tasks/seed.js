const dbConnection = require('../config/mongoConnection');
const customersData = require('../data/customers');
const restaurantsData = require('../data/restaurants');
const reservationsData = require('../data/reservations');
const reviewsData = require('../data/reviews');

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    await restaurantsData.create("La Isla", "104 Washington St, Hoboken, NJ 07030", "laisla@gmail.com", 
        "2016598197", "Cozy, longtime venue serving budget Cuban classics for breakfast, lunch & dinner with BYO policy.", 
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    await restaurantsData.create("Blue Eyes", "525 Sinatra Dr, Hoboken, NJ, 07030", "blueeyes@gmail.com", "2016836861",
        "Light-filled, modern Italian place with a Frank Sinatra theme & riverfront patio with skyline views.", 
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    await restaurantsData.create("Sorellina", "1036 Washington St, Hoboken, NJ 07030", "sorellina@gmail.com", "2019633333",
        "Vibrant eatery with retro accents featuring Italian cuisine, old-country wines & sidewalk tables.",
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    await restaurantsData.create("Onieal's", "343 Park Ave, Hoboken, NJ 07030", "onieal@gmail.com", "2016531492",
        "This neighborhood pub serves beer & New American chow in a casual space with outdoor seating.",
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    await restaurantsData.create("Il Tavolo di Palmisano", "700 Clinton St, Hoboken, NJ 07030", "tavolo@gmail.com", "2013455980",
        "Italian restaurant",
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
        await restaurantsData.create("La Isla", "104 Washington St, Hoboken, NJ 07030", "laisla@gmail.com", 
        "2016598197", "Cozy, longtime venue serving budget Cuban classics for breakfast, lunch & dinner with BYO policy.", 
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    await restaurantsData.create("Blue Eyes", "525 Sinatra Dr, Hoboken, NJ, 07030", "blueeyes@gmail.com", "2016836861",
        "Light-filled, modern Italian place with a Frank Sinatra theme & riverfront patio with skyline views.", 
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    await restaurantsData.create("Sorellina", "1036 Washington St, Hoboken, NJ 07030", "sorellina@gmail.com", "2019633333",
        "Vibrant eatery with retro accents featuring Italian cuisine, old-country wines & sidewalk tables.",
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    await restaurantsData.create("Onieal's", "343 Park Ave, Hoboken, NJ 07030", "onieal@gmail.com", "2016531492",
        "This neighborhood pub serves beer & New American chow in a casual space with outdoor seating.",
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    await restaurantsData.create("Il Tavolo di Palmisano", "700 Clinton St, Hoboken, NJ 07030", "tavolo@gmail.com", "2013455980",
        "Italian restaurant",
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    await customersData.create("Andrew", "Johnson", "ajohnso4@stevens.edu", "4845228181", "Hoboken", "NJ", "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    await customersData.create("Ali", "Kolenovic", "akolenovic@stevens.edu", "2019161502", "Hoboken", "NJ", "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    await customersData.create("Manasa", "Prakash", "mgeemara@stevens.edu","2019209556","Hoboken", "NJ", "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    console.log('seeded!');
    await db.serverConfig.close();
}

main().catch((error) => {
    console.error(error);
    return dbConnection().then((db) => {
        return db.serverConfig.close();
      });
});