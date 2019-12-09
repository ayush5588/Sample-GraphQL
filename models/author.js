const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
    name: String,
    age: Number
});

module.exports = mongoose.model('Author',AuthorSchema);