const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookID: String,
    title: String,
    authors: String,
    average_rating: String,
    isbn: String,
    isbn13: String,
    language_code: String,
    num_pages: String,
    ratings_count: String,
    text_reviews_count: String,
    publication_date: String,
    publisher: String
});

// indexes to optimize queries
bookSchema.index({ bookID: 1 }); 
bookSchema.index({ authors: 1 });
bookSchema.index({ title: 1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;