const mongoCollections = require("../config/mongoCollections");
const ObjectId = require('mongodb').ObjectId;
const reviews = mongoCollections.reviews;
const customersData = require("./customers");
const restaurantsData = require("./restaurants");

// create a review from customerId and restaurantId
const create = async function create(restaurantId, customerId, review, rating) {
    if (restaurantId === undefined || customerId === undefined || review === undefined || rating === undefined) {
            throw "All parameters must be provided";
        }
    if (typeof restaurantId !== 'string' || typeof customerId !== 'string' || typeof review !== 'string' ||
        typeof rating !== 'number') {
            throw "Parameters must be of correct type";
        }
    if (restaurantId.replace(/\s/g, "") === "" || customerId.replace(/\s/g, "") === "" || review.replace(/\s/g, "") === "") {
        throw "Parameters cannot be empty strings.";
    }
    if (rating < 1 || rating > 5) {
        throw "Number of guests must be between 1 and 10";
    }

    try {
        restaurantId = new ObjectId(restaurantId);
    } catch (e) {
        throw "Restaurant ID is invalid.";
    }
    try {
        customerId = new ObjectId(customerId);
    } catch (e) {
        throw "Customer ID is invalid.";
    }
    let newId = new ObjectId();
    newId = newId.toString();
    let customer = await customersData.get(customerId.toString());
    let restaurant = await restaurantsData.get(restaurantId.toString());
    let reviewCollection = await reviews();
    const newReview = {
        _id: newId,
        restaurantId: restaurantId.toString(),
        customerId: customerId.toString(),
        fullName: `${customer.firstName} ${customer.lastName}`, 
        review: review,
        rating: rating
    };

    const insertInfo = await reviewCollection.insertOne(newReview);
    if (insertInfo.insertedCount === 0) throw "Could not add review";
    //const newId = insertInfo.insertedId;

    //const getReview = await get(newId.toString());
    customer.reviews.push(newReview);
    restaurant.reviews.push(newReview);
    await customersData.update(customerId.toString(), customer);
    await restaurantsData.update(restaurantId.toString(), restaurant);
    return newReview;

}
//gets a review from review ID
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
        for (let review of restaurant.reviews) {
            if (review._id.toString() == id.toString()) {
                found = 1;
                return review;
            }
        }
    }
    if (found == 0) {
        throw "Review ID not found.";
    }
}

const getAll = async function getAll() {
    const reviewsCollection = await reviews();
    let reviewsList = await reviewsCollection.find({}).toArray();
    for (let item of reviewsList) {
        item._id = item._id.toString();
    }
    return reviewsList;
}
//gets all reviews that a customer made
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
    return customer.reviews;
}
//gets all reviews that a restaurant has
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
    return restaurant.reviews;
}
// removes a review from both the customer and restaurant
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
        for (let review of customer.reviews) {
            if (review._id.toString() == id.toString()) {
                customerID = customer._id.toString();
                customer.reviews = customer.reviews.filter(function (item) {
                    return item._id.toString() !== id.toString();
                })
                await customersData.update(customerID, customer);
            }
        }
    }
    let restaurants = await restaurantsData.getAll();
    for (let restaurant of restaurants) {
        for (let review of restaurant.reviews) {
            if (review._id.toString() == id.toString()) {
                restaurantID = restaurant._id.toString();
                restaurant.reviews = restaurant.reviews.filter(function (item) {
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
    return { reviewId: id.toString(), deleted: true };
}

const hasReviewed = async function hasReviewed(restaurantId, reviews) {
    for (i in reviews) {
        if (reviews[i].restaurantId = restaurantId) {
            return reviews[i];
        }
    }
    return undefined;
}
module.exports = {
    create,
    getAllFromCustomer,
    getAllFromRestaurant,
    get,
    getAll,
    hasReviewed,
    remove
}