const dbConnection = require('./config/mongoConnection');
const customersData = require('./data/customers');
const restaurantData = require('./data/restaurants');

async function main(){
    console.log('starting to seed');
    let restaurant = await restaurantData.create("Andy's Place", "https://google.com", "1009 Park Ave", "andy@gmail.com", "5555555555", "food to eat", "$2y$16$1CdVBsg7TaPDiZGy0jhnZOa.SY7/9szjAUeR7Rswq6GCrZdP9dQY2");
    let customer = await customersData.create("Andrew", "Johnson", "ajohnso4@stevens.edu", "4845228181", "Hoboken", "NJ", "$2y$16$1CdVBsg7TaPDiZGy0jhnZOa.SY7/9szjAUeR7Rswq6GCrZdP9dQY2");
    
    console.log('finished!');
}
main();