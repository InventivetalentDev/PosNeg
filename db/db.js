const mongoose = require("mongoose");

module.exports = function (config) {

    // Connect to DB
    console.log("Connecting to mongodb://" + ((config.mongo.user || "admin") + ":*****" + "@" + (config.mongo.address || "localhost") + ":" + (config.mongo.port || 27017) + "/" + (config.mongo.database || "database")))
    mongoose.connect("mongodb://" + ((config.mongo.user || "admin") + ":" + (config.mongo.pass || "admin") + "@" + (config.mongo.address || "localhost") + ":" + (config.mongo.port || 27017) + "/" + (config.mongo.database || "database"))).then(() => {
        console.log("DB connected!")
    }, (err) => {
        console.log(err);
    })

    mongoose.Promise = Promise;
}