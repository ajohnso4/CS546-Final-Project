const mongoCollections = require("../config/mongoCollections");
const ObjectId = require('mongodb').ObjectId;
const customersData = require("./customers");
const restaurantsData = require("./restaurants");

function isValidDate(date)
{
    let matches = /^(\d{1,2})[/](\d{1,2})[/](\d{4})$/.exec(date);
    if (matches == null) {
        return false;
    }
    return true;
}
// create a reservation from customerId and restaurantId
const create = async function create(restaurantId, customerId, reservationDate, reservationTime, no_of_guests, table) {
    if (restaurantId === undefined || customerId === undefined || reservationDate === undefined || reservationTime === undefined ||
        no_of_guests === undefined || table === undefined) {
            throw "All parameters must be provided";
        }
    if (typeof restaurantId !== 'string' || typeof customerId !== 'string' || typeof no_of_guests !== 'number' ||
        typeof table !== 'number' || typeof reservationDate !== 'string' || typeof reservationTime !== 'string') {
            throw "Parameters must be of correct type";
        }
    if (restaurantId.replace(/\s/g, "") === "" || customerId.replace(/\s/g, "") === "" || reservationDate.replace(/\s/g, "") === "" ||
        reservationTime.replace(/\s/g, "") === "") {
        throw "Parameters cannot be empty strings.";
    }
    if (no_of_guests < 1 || no_of_guests > 10) {
        throw "Number of guests must be between 1 and 10";
    }

    if (table < 1 || table > 20) {
        throw "Table must be between 1 and 20";
    }

    if (!isValidDate(reservationDate)) {
        throw "Reservation Date is invalid";
    }

    try {
        restaurantId = new ObjectId(restaurantId);
        console.log(restaurantId)
    } catch (e) {
        throw "Restaurant ID is invalid.";
    }
    try {
        customerId = new ObjectId(customerId);
        console.log(customerId)
    } catch (e) {
        throw "Customer ID is invalid.";
    }
    let newId = new ObjectId();
    newId = newId.toString();
    let customer = await customersData.get(customerId.toString());
    let restaurant = await restaurantsData.get(restaurantId.toString());
    const newReservation = {
        _id: newId,
        restaurantId: customerId.toString(),
        customerId: restaurantId.toString(),
        reservationDate: reservationDate,
        reservationTime: reservationTime,
        no_of_guests: no_of_guests,
        table: table
    };
    customer.reservations.push(newReservation);
    restaurant.reservations.push(newReservation);
    await customersData.update(customerId.toString(), customer);
    await restaurantsData.update(restaurantId.toString(), restaurant);
    return newReservation;

}
//gets a reservation from reservation ID
const get = async function get(id) {
    if (id === undefined) {
        throw "ID must be provided.";
    }
    if (typeof id !== "string" || id.replace(/\s/g, "") === "") {
        throw "ID must be string and cannot be empty.";
    }
    try {
        id = new ObjectId(id);
    } catch (e) {
        throw "ID is invalid.";
    }
    let restaurants = await restaurantsData.getAll();
    let found = 0;
    for (let restaurant of restaurants) {
        for (let reser of restaurant.reservations) {
            if (reser._id.toString() == id.toString()) {
                found = 1;
                return reser;
            }
        }
    }
    if (found == 0) {
        throw "Reservation ID not found.";
    }
}
//gets all reservations that a customer made
const getAllFromCustomer = async function getAllFromCustomer(id) {
    if (id === undefined) {
        throw "ID must be provided";
    }
    if (typeof id !== "string" || id.replace(/\s/g, "") === "") {
        throw "ID must be string and cannot be empty.";
    }
    try {
        id = new ObjectId(id);
    } catch (e) {
        throw "ID is invalid.";
    }
    let customer = await customersData.get(id.toString());
    return customer.reservations;
}
//gets all reservations that a restaurant has
const getAllFromRestaurant = async function getAllFromRestaurant(id) {
    if (id === undefined) {
        throw "ID must be provided";
    }
    if (typeof id !== "string" || id.replace(/\s/g, "") === "") {
        throw "ID must be string and cannot be empty.";
    }
    try {
        id = new ObjectId(id);
    } catch (e) {
        throw "ID is invalid.";
    }
    let restaurant = await restaurantsData.get(id.toString());
    
    return restaurant.reservations;
}
// removes a reservation from both the customer and restaurant
const remove = async function remove(id) {
    if (id === undefined) {
        throw "ID must be provided";
    }
    if (typeof id !== "string" || id.replace(/\s/g, "") === "") {
        throw "ID must be string and cannot be empty.";
    }
    try {
        id = new ObjectId(id);
    } catch (e) {
        throw "ID is invalid.";
    }
    let restaurantID;
    let customerID;
    let customers = await customersData.getAll();
    for (let customer of customers) {
        for (let reser of customer.reservations) {
            if (reser._id.toString() == id.toString()) {
                customerID = customer._id.toString();
                customer.reservations = customer.reservations.filter(function (item) {
                    return item._id.toString() !== id.toString();
                })
                await customersData.update(customerID, customer);
            }
        }
    }
    let restaurants = await restaurantsData.getAll();
    for (let restaurant of restaurants) {
        for (let reser of restaurant.reservations) {
            if (reser._id.toString() == id.toString()) {
                restaurantID = restaurant._id.toString();
                restaurant.reservations = restaurant.reservations.filter(function (item) {
                    return item._id.toString() !== id.toString();
                })
                await restaurantsData.update(restaurantID, restaurant);
            }
        }
    }

    if (customerID === undefined) {
        throw "CustomerID was not found.";
    }
    if (restaurantID === undefined) {
        throw "RestaurantID was not found";
    }
    return { reservationId: id.toString(), deleted: true };
}
module.exports = {
    create,
    getAllFromCustomer,
    getAllFromRestaurant,
    get,
    remove
}