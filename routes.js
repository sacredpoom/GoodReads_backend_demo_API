const express = require('express');
const Book = require('./models/Book');

const router = express.Router();

// utility function for error handling :: better standardization
const handleError = (res, err, message = 'Server Error', code = 500) => {
    console.error(err);
    res.status(code).json({ success: false, message });
};

// Get all books
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json({ success: true, data: books });
    } catch (err) {
        handleError(res, err);
    }
});

// Get a single book by ID
router.get('/books/:bookID', async (req, res) => {
    try {
        const book = await Book.findOne({ bookID: req.params.bookID });
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.json({ success: true, data: book });
    } catch (err) {
        handleError(res, err);
    }
});

// Get all books by an author
router.get('/books/author/:author', async (req, res) => {
    try {
        const books = await Book.find({ authors: { $regex: new RegExp(req.params.author, 'i') } }); // case insensitive regex
        if (books.length === 0) {
            return res.status(404).json({ success: false, message: 'No books found by this author' });
        }
        res.json({ success: true, data: books });
    } catch (err) {
        handleError(res, err);
    }
});

// Get all books with a specific title
router.get('/books/title/:title', async (req, res) => {
    try {
        const books = await Book.find({ title: { $regex: new RegExp(req.params.title, 'i') } });
        // log for debug
        //console.log(`Regex pattern: ${new RegExp(req.params.title, 'i')}`);
        if (books.length === 0) {
            return res.status(404).json({ success: false, message: 'No books found with this title' });
        }
        res.json({ success: true, data: books });
    } catch (err) {
        handleError(res, err);
    }
});

// Get all books with specified rating or higher
router.get('/books/rating/:rating', async (req, res) => {
    try {
        const rating = parseFloat(req.params.rating);

        // Input validation
        if (isNaN(rating) || rating < 0 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Invalid rating. Rating must be a number between 0 and 5.' });
        }

        const books = await Book.find({ average_rating: { $gte: rating } });
        if (books.length === 0) {
            return res.status(404).json({ success: false, message: `No books found with an average rating of ${rating} or higher.` });
        }

        res.json({ success: true, data: books });
    } catch (err) {
        handleError(res, err);
    }
});

// Get all books published after a specific year
router.get('/books/year-ge/:year', async (req, res) => {
    try {
        const year = parseInt(req.params.year, 10);

        // input validation
        if (isNaN(year) || !Number.isInteger(year) || year < 1500) {
            return res.status(400).json({ success: false, message: 'Invalid year' });
        }

        // the way pub date is formatted in csv is weird. substring the last 4 digits to get the year
        const books = await Book.aggregate([
            {
                $addFields: {
                    publication_year: {
                        $toInt: {
                            $substr: [
                                "$publication_date",
                                { $subtract: [{ $strLenCP: "$publication_date" }, 4] },
                                4
                            ]
                        }
                    }
                }
            },
            {
                $match: {
                    publication_year: { $gte: year } // greater than or equal to year
                }
            }
        ]);

        if (books.length === 0) {
            return res.status(404).json({ success: false, message: 'No books found for this year or later' });
        }

        res.json({ success: true, data: books });
    } catch (err) {
        handleError(res, err);
    }
});

// Get all books published before a specific year
router.get('/books/year-le/:year', async (req, res) => {
    try {
        const year = parseInt(req.params.year, 10);

        // input validation
        if (isNaN(year) || !Number.isInteger(year) || year < 1500) {
            return res.status(400).json({ success: false, message: 'Invalid year' });
        }

        // the way pub date is formatted in csv is weird. substring the last 4 digits to get the year
        const books = await Book.aggregate([
            {
                $addFields: {
                    publication_year: {
                        $toInt: {
                            $substr: [
                                "$publication_date",
                                { $subtract: [{ $strLenCP: "$publication_date" }, 4] },
                                4
                            ]
                        }
                    }
                }
            },
            {
                $match: {
                    publication_year: { $lte: year } // published before or on year
                }
            }
        ]);

        if (books.length === 0) {
            return res.status(404).json({ success: false, message: 'No books found for this year or earlier' });
        }

        res.json({ success: true, data: books });
    } catch (err) {
        handleError(res, err);
    }
});

module.exports = router;