const dbConnection = require('../config/mongoConnection');
const customersData = require('../data/customers');
const restaurantsData = require('../data/restaurants');
const reservationsData = require('../data/reservations');
const reviewsData = require('../data/reviews');

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    let res1 = await restaurantsData.create("Dino & Harry's Steak House","https://www.dinoandharrys.com","163 14th St, Hoboken, NJ 07030, United States", "dinoandharrys@gmail.com","2016596202", 
    "Classic steakhouse housed in a 19th-century saloon with stained glass, a tin ceiling & live music.",
    "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK")
    let res2 = await restaurantsData.create("Empyrean Indian Kitchen & Bar", "https://empyreankitchen.com/", "20 Hudson Pl, Hoboken, NJ 07030, United States",
    "empyreankitchen@gmail.com", "2016834160","What makes our restaurant best among the other Indian restaurants in Hoboken City is the perfect blend of authentic taste, traditions, and hospitality. The dishes of India are characterized by the extensive use of various Indian spices, herbs, vegetables, and recipes.",
    "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK")
    let res3 = await restaurantsData.create("Amanda's", "https://www.amandasrestaurant.com", "908 Washington St A, Hoboken, NJ 07030, United States",
    "amandasrestaurant@gmail.com", "2017980101", "American eatery serving early-bird dinner, Sunday brunch & more in a circa-1895 brownstone.",
    "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK")
    let res4 = await restaurantsData.create("Blue Eyes","https://blueeyesrestaurant.com", "525 Sinatra Dr, Hoboken, NJ, 07030", "blueeyes@gmail.com", "2016836861",
        "Light-filled, modern Italian place with a Frank Sinatra theme & riverfront patio with skyline views.", 
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    let res5 = await restaurantsData.create("Sorellina","https://www.sorellinahoboken.com", "1036 Washington St, Hoboken, NJ 07030", "sorellina@gmail.com", "2019633333",
        "Vibrant eatery with retro accents featuring Italian cuisine, old-country wines & sidewalk tables.",
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    let res6 = await restaurantsData.create("Onieal's","http://onieals.com", "343 Park Ave, Hoboken, NJ 07030", "onieal@gmail.com", "2016531492",
        "This neighborhood pub serves beer & New American chow in a casual space with outdoor seating.",
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    let res7 = await restaurantsData.create("Il Tavolo di Palmisano","https://iltavolohoboken.com", "700 Clinton St, Hoboken, NJ 07030", "tavolo@gmail.com", "2013455980",
        "Italian restaurant",
        "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    
    let cus1 = await customersData.create("Andrew", "Johnson", "ajohnso4@stevens.edu", "4845228181", "Hoboken", "NJ", "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    let cus2 = await customersData.create("Ali", "Kolenovic", "akolenovic@stevens.edu", "2019161502", "Hoboken", "NJ", "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    let cus3 = await customersData.create("Manasa", "Prakash", "mgeemara@stevens.edu","2019209556","Hoboken", "NJ", "$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK");
    let cus4 = await customersData.create("Hamsa","Ramalingu","hramalin@stevens.edu","2014248395","Hodoken","NJ","$2b$16$6EQG4BWI.X1CGrjUbA5cT.w8HkfSQJvtqaIJnDfFYr6PwddwjVBmK")
    let rev1 = await reviewsData.create(res1._id, cus1._id, "Great Place", 5);
    let rev2 = await reviewsData.create(res2._id, cus2._id, "okok", 3);
    let rev3 = await reviewsData.create(res3._id, cus3._id, "good bananas", 4);
    let rev4 = await reviewsData.create(res4._id, cus4._id, "i love their chicken", 5);
    let rev5 = await reviewsData.create(res5._id, cus4._id, "There was glass in the food", 1);
    let rev6 = await reviewsData.create(res6._id, cus1._id, "smelly food", 2);
    let rev7 = await reviewsData.create(res7._id, cus3._id, "mhmhmhmhm", 5);
    
    console.log('seeded!');
    await db.serverConfig.close();
}

main().catch((error) => {
    console.error(error);
    return dbConnection().then((db) => {
        return db.serverConfig.close();
      });
});