let mongoose = require('mongoose')
    , Schema = mongoose.Schema;
let wordSchema = new Schema({
    word: {
        type: String,
        index: true,
        unique: true
    },
    type: {
        type: "String",
        enum: ["positive", "negative"]
    }
});
module.exports.Word = mongoose.model("Word", wordSchema);