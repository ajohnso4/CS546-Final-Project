const mongoCollections = require("../config/mongoCollections");
const ObjectId = require('mongodb').ObjectId;
const customers = mongoCollections.customers;

const create = async function create(firstName, lastName, email, phone, city, state, passwordHash) {
    if (firstName === undefined || lastName === undefined || email === undefined || phone === undefined ||
        city === undefined || state === undefined || passwordHash === undefined) {
        throw "All parameters must be provided.";
    }
    if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string' ||
        typeof phone !== 'string' || typeof city !== 'string' || typeof state !== 'string' || typeof passwordHash !== 'string') {
        throw "Incorrect paramaters type.";
    }
    if (firstName.replace(/\s/g, "") === "" || lastName.replace(/\s/g, "") === "" || email.replace(/\s/g, "") === "" ||
        phone.replace(/\s/g, "") === "" || city.replace(/\s/g, "") === "" || state.replace(/\s/g, "") === "" || passwordHash.replace(/\s/g, "") === "") {
        throw "Parameters cannot be empty strings.";
    }
    // let regex = /^\d{3}\d{3}\d{4}$/;
    // if (!regex.test(phone)) {
    //     throw "Phone number is in wrong format.";
    // }
    const customersCollection = await customers();
    let newCustomer = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        city: city,
        state: state,
        passwordHash: passwordHash,
        reservations: [],
        reviews: []
    };
    const insertInfo = await customersCollection.insertOne(newCustomer);
    if (insertInfo.insertedCount === 0) throw "Could not add customer";
    const newId = insertInfo.insertedId;

    const customer = await get(newId.toString());
    return customer;
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
    const customersCollection = await customers();
    const customer = await customersCollection.findOne({ _id: id });
    if (customer === null) {
        throw "No Customer with provided ID.";
    }
    customer._id = customer._id.toString();
    return customer;
}
const getId = async function getId(name) {
    const customersCollection = await customers();
    var customer =  await customersCollection.findOne({ name: name});
    customer = customer._id;
    return customer
}
const getAll = async function getAll() {
    const customersCollection = await customers();
    let customersList = await customersCollection.find({}).toArray();
    for (let item of customersList) {
        item._id = item._id.toString();
    }
    return customersList;
}

const getfromEmail = async function getfromEmail(email) {
    const customersCollection = await customers();
    if(!email) throw 'Username must be provided!';
    if(typeof email != 'string' || email.trim() == '') throw 'Username must be a valid String!';
    let customersList = await customersCollection.find({}).toArray();
    for(customer of customersList){
        if(email == customer.email){
            return customer._id.toString();
        }
    } 
    return -1;
}

const update = async function update(id, updatedCustomer) {
    const customersCollection = await customers();
    if (id === undefined || updatedCustomer === undefined) {
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
    if (updatedCustomer.firstName === undefined || updatedCustomer.lastName === undefined || updatedCustomer.email === undefined || updatedCustomer.phone === undefined ||
        updatedCustomer.city === undefined || updatedCustomer.state === undefined || updatedCustomer.passwordHash === undefined) {
        throw "All parameters must be provided.";
    }
    if (typeof updatedCustomer.firstName !== 'string' || typeof updatedCustomer.lastName !== 'string' || typeof updatedCustomer.email !== 'string' ||
        typeof updatedCustomer.phone !== 'string' || typeof updatedCustomer.city !== 'string' || typeof updatedCustomer.state !== 'string' || typeof updatedCustomer.passwordHash !== 'string') {
        throw "Incorrect paramaters type.";
    }
    if (updatedCustomer.firstName.replace(/\s/g, "") === "" || updatedCustomer.lastName.replace(/\s/g, "") === "" || updatedCustomer.email.replace(/\s/g, "") === "" ||
        updatedCustomer.phone.replace(/\s/g, "") === "" || updatedCustomer.city.replace(/\s/g, "") === "" || updatedCustomer.state.replace(/\s/g, "") === "" || updatedCustomer.passwordHash.replace(/\s/g, "") === "") {
        throw "Parameters cannot be empty strings.";
    }
    // let regex = /^\d{3}-\d{3}-\d{4}$/;
    // if (!regex.test(updatedCustomer.phone)) {
    //     throw "Phone number is in wrong format.";
    // }
    const updatedCustomerData = {};
    if (updatedCustomer.firstName) {
        updatedCustomerData.firstName = updatedCustomer.firstName;
    }
    if (updatedCustomer.lastName) {
        updatedCustomerData.lastName = updatedCustomer.lastName;
    }
    if (updatedCustomer.email) {
        updatedCustomerData.email = updatedCustomer.email;
    }
    if (updatedCustomer.phone) {
        updatedCustomerData.phone = updatedCustomer.phone;
    }
    if (updatedCustomer.city) {
        updatedCustomerData.city = updatedCustomer.city;
    }
    if (updatedCustomer.state) {
        updatedCustomerData.state = updatedCustomer.state;
    }
    if (updatedCustomer.passwordHash) {
        updatedCustomerData.passwordHash = updatedCustomer.passwordHash;
    }
    if (updatedCustomer.reservations) {
        updatedCustomerData.reservations = updatedCustomer.reservations;
    }
    if (updatedCustomer.reviews) {
        updatedCustomerData.reviews = updatedCustomer.reviews;
    }
    const updatedInfo = await customersCollection.updateOne({ _id: id}, { $set: updatedCustomerData });
    if (updatedInfo.modifiedCount === 0) {
        throw "Could not update customer.";
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
    const customersCollection = await customers();
    const deletionInfo = await customersCollection.deleteOne({ _id: id });

    if (deletionInfo.deletedCount === 0) {
      throw "No customer exists with provided ID";
    }
    return { customerId: id.toString(), deleted: true };
}
module.exports = {
    create,
    get,
    getId,
    getAll,
    update,
    remove,
    getfromEmail
}