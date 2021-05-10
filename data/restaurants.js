const mongoCollections = require("../config/mongoCollections");
const ObjectId = require('mongodb').ObjectId;
const restaurants = mongoCollections.restaurants;

const create = async function create(name, address, email, phone, description, passwordHash) {
    if (name === undefined || address === undefined || email === undefined || phone === undefined ||
        description === undefined || passwordHash === undefined) {
        throw "All parameters must be provided.";
    }
    if (typeof name !== 'string' || typeof address !== 'string' || typeof email !== 'string' ||
        typeof phone !== 'string' || typeof description !== 'string' || typeof passwordHash !== 'string') {
        throw "Incorrect paramaters type.";
    }
    if (name.replace(/\s/g, "") === "" || address.replace(/\s/g, "") === "" || email.replace(/\s/g, "") === "" ||
        phone.replace(/\s/g, "") === "" || description.replace(/\s/g, "") === "" || passwordHash.replace(/\s/g, "") === "") {
        throw "Parameters cannot be empty strings.";
    }
    // Can not write dashes in the form for now
    let regex = /^\d{3}\d{3}\d{4}$/;
    if (!regex.test(phone)) {
        throw "Phone number is in wrong format.";
    }
    const restaurantsCollection = await restaurants();
    let newRestaurant = {
        name: name,
        address: address,
        email: email,
        phone: phone,
        description: description,
        passwordHash: passwordHash,
        reservations: [],
        reviews: []
    };
    const insertInfo = await restaurantsCollection.insertOne(newRestaurant);
    if (insertInfo.insertedCount === 0) throw "Could not add restaurant";
    const newId = insertInfo.insertedId;

    const restaurant = await get(newId.toString());
    return restaurant;
}

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
    const restaurantsCollection = await restaurants();
    const restaurant = await restaurantsCollection.findOne({ _id: id });
    if (restaurant === null) {
        throw "No Restaurant with provided ID.";
    }
    restaurant._id = restaurant._id.toString();
    return restaurant;
}
const getId = async function getId(name) {
    const restaurantsCollection = await restaurants();
    var restaurant =  await restaurantsCollection.findOne({ name: name});
    restaurant = restaurant._id.toString();
    return restaurant
}
const getAll = async function getAll() {
    const restaurantsCollection = await restaurants();
    let restaurantsList = await restaurantsCollection.find({}).toArray();
    for (let item of restaurantsList) {
        item._id = item._id.toString();
    }
    return restaurantsList;
}

const update = async function update(id, updatedRestaurant) {
    const restaurantsCollection = await restaurants();
    if (id === undefined || updatedRestaurant === undefined) {
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
    if (updatedRestaurant.name === undefined || updatedRestaurant.address === undefined || updatedRestaurant.email === undefined || updatedRestaurant.phone === undefined ||
        updatedRestaurant.description === undefined || updatedRestaurant.passwordHash === undefined) {
        throw "All parameters must be provided.";
    }
    if (typeof updatedRestaurant.name !== 'string' || typeof updatedRestaurant.address !== 'string' || typeof updatedRestaurant.email !== 'string' ||
        typeof updatedRestaurant.phone !== 'string' || typeof updatedRestaurant.description !== 'string' || typeof updatedRestaurant.passwordHash !== 'string') {
        throw "Incorrect paramaters type.";
    }
    if (updatedRestaurant.name.replace(/\s/g, "") === "" || updatedRestaurant.address.replace(/\s/g, "") === "" || updatedRestaurant.email.replace(/\s/g, "") === "" ||
        updatedRestaurant.phone.replace(/\s/g, "") === "" || updatedRestaurant.description.replace(/\s/g, "") === "" || updatedRestaurant.passwordHash.replace(/\s/g, "") === "") {
        throw "Parameters cannot be empty strings.";
    }
    let regex = /^\d{3}-\d{3}-\d{4}$/;
    if (!regex.test(updatedRestaurant.phone)) {
        throw "Phone number is in wrong format.";
    }
    const updatedRestaurantData = {};
    if (updatedRestaurant.name) {
        updatedRestaurantData.name = updatedRestaurant.name;
    }
    if (updatedRestaurant.address) {
        updatedRestaurantData.address = updatedRestaurant.address;
    }
    if (updatedRestaurant.email) {
        updatedRestaurantData.email = updatedRestaurant.email;
    }
    if (updatedRestaurant.phone) {
        updatedRestaurantData.phone = updatedRestaurant.phone;
    }
    if (updatedRestaurant.description) {
        updatedRestaurantData.description = updatedRestaurant.description;
    }
    if (updatedRestaurant.passwordHash) {
        updatedRestaurantData.passwordHash = updatedRestaurant.passwordHash;
    }
    if (updatedRestaurant.reservations) {
        updatedRestaurantData.reservations = updatedRestaurant.reservations;
    }
    if (updatedRestaurant.reviews) {
        updatedRestaurantData.reviews = updatedRestaurant.reviews;
    }
    const updatedInfo = await restaurantsCollection.updateOne({ _id: id}, { $set: updatedRestaurantData });
    if (updatedInfo.modifiedCount === 0) {
        throw "Could not update restaurant.";
    }
    return await get(id.toString());
}

const remove = async function remove(id) {
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
    const restaurantsCollection = await restaurants();
    const deletionInfo = await restaurantsCollection.deleteOne({ _id: id });

    if (deletionInfo.deletedCount === 0) {
      throw "No restaurant exists with provided ID";
    }
    return { restaurantId: id.toString(), deleted: true };
}
module.exports = {
    create,
    get,
    getId,
    getAll,
    update,
    remove
}