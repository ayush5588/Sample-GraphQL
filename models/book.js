// Model is collection only

const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    name: String,
    genre: String,
    authorId: String
});

module.exports = mongoose.model('Book',BookSchema);