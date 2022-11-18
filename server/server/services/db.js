'use strict';
require("dotenv").config();
const mongoose = require("mongoose");

const connectMongoose = async () => {

    // database connection ----------------------
    return mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        .then(() => console.log("db connected!"))
        .catch((err) => { console.error("db connection failed ", err); throw err; });
}

module.exports = { connectMongoose }
