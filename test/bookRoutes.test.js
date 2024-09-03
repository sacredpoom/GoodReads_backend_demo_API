const request = require('supertest');
const express = require('express'); 
const mongoose = require('mongoose');
const Book = require('../models/Book');
const bookRoutes = require('../routes');

const app = express();
app.use(express.json());
app.use('/api', bookRoutes);

jest.mock('../models/Book');

describe('Book Routes', () => {
    // test the get all books endpoint
    describe('GET /api/books', () => {
        it('should return all books', async () => {
            const mockBooks = [
                { bookID: '1', title: 'Book One', authors: 'Author One' },
                { bookID: '2', title: 'Book Two', authors: 'Author Two' }
            ];

            Book.find.mockResolvedValue(mockBooks);

            const res = await request(app).get('/api/books');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockBooks);
        });

        it('should return an empty array if no books exist', async () => {
            const mockBooks = []; // no books in the database

            Book.find.mockResolvedValue(mockBooks);
            const res = await request(app).get('/api/books');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual([]); // expect empty array
        });

        it('should handle errors gracefully', async () => {
            Book.find.mockRejectedValue(new Error('Database Error'));

            const res = await request(app).get('/api/books');

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Server Error');
        });
    });

    // test get a single book by ID endpoint
    describe('GET /api/books/:bookID', () => {
        it('should return a book by ID', async () => {
            const mockBooks = {bookID: '1', title: 'Book One', authors: 'Author One' };

            Book.findOne.mockResolvedValue(mockBooks);

            const res = await request(app).get('/api/books/1');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockBooks);
        });

        it('should return 404 if book is not found', async () => {
            Book.findOne.mockResolvedValue(null); // no book found

            const res = await request(app).get('/api/books/1');

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Book not found');
        });

        it('should handle errors gracefully', async () => {
            Book.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/books/1');

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Server Error');
        });
    });

    // test for GET books by AUTHOR endpoint
    describe('GET /api/books/author/:author', () => {
        it('should return books by the specified author', async () => {
            const mockBooks = [
                { bookID: '1', title: 'Book One', authors: 'Author One' },
                { bookID: '2', title: 'Book Two', authors: 'Author Two' }
            ];

            Book.find.mockResolvedValue(mockBooks);

            const res = await request(app).get('/api/books/author/Author$20One');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockBooks);
        });

        it('should return a 404 error if no books are found by the author', async () => {
            const mockBooks = [];

            Book.find.mockResolvedValue(mockBooks);

            const res = await request(app).get('/api/books/author/Tolkien');

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('No books found by this author');
        });

        it('should handle database errors gracefully', async () => {
            Book.find.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/books/author/Tolkien');

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Server Error');
        });
    });

    // test for GET books by TITLE endpoint
    describe('GET /api/books/title/:title', () => {
        it('should return books by the specified title', async () => {
            const mockBooks = [
                { bookID: '1', title: 'Book One', authors: 'Author One' },
                { bookID: '2', title: 'Book Two', authors: 'Author Two' }
            ];

            Book.find.mockResolvedValue(mockBooks);

            const res = await request(app).get('/api/books/title/one');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockBooks);
        });

        it('should return a 404 error if no books are found by the title', async () => {
            const mockBooks = [];

            Book.find.mockResolvedValue(mockBooks);

            const res = await request(app).get('/api/books/title/One');

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('No books found with this title');
        });

        it('should handle database errors gracefully', async () => {
            Book.find.mockRejectedValue(new Error('Database Error'));

            const res = await request(app).get('/api/books/title/One');

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Server Error');
        });
    });

    // test for GET books with AVG RATING 
    describe('GET /api/books/rating/:rating', () => {
        it('should return books with a rating of 4.0 or higher', async () => {
            const mockBooks = [
                { bookID: '1', title: 'Book One', authors: 'Author One', rating: 4.0 },
                { bookID: '2', title: 'Book Two', authors: 'Author Two', rating: 1.0 }
            ];

            Book.find.mockResolvedValue(mockBooks);

            const res = await request(app).get('/api/books/rating/4');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockBooks);
        });

        it('should return a 404 error if no books are found with rating 4.0 or higher', async () => {
            const mockBooks = [];

            Book.find.mockResolvedValue(mockBooks);

            const res = await request(app).get('/api/books/rating/4');

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe(`No books found with an average rating of 4 or higher.`);
        });

        it('should return a 400 error if the rating is invalid (not a number or out of range)', async () => {
            const res = await request(app).get('/api/books/rating/abc'); //invalid rating

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid rating. Rating must be a number between 0 and 5.');
        });

        it('should handle database errors gracefully', async () => {
            Book.find.mockRejectedValue(new Error('Database Error'));

            const res = await request(app).get('/api/books/rating/4');

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Server Error');
        });
    });

    // test for GET books published after a specific year
    describe('GET /api/books/year-ge/:year', () => {
        it('should return books published after the specified year', async () => {
            const year = 2000;
            const mockBooks = [
                { bookID: '1', title: 'Book One', authors: 'Author One', publication_date: '2001-01-01' },
                { bookID: '2', title: 'Book Two', authors: 'Author Two', publication_date: '2010-01-01' }
            ];

            Book.aggregate.mockResolvedValue(mockBooks);

            const res = await request(app).get(`/api/books/year-ge/${year}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockBooks);
        });

        it('should return a 404 error if no books are found for the specified year', async () => {
            const year = 2025;
            const mockBooks = [];

            Book.aggregate.mockResolvedValue(mockBooks);

            const res = await request(app).get(`/api/books/year-ge/${year}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('No books found for this year or later');
        });

        it('should return a 400 error if input year is not a number or less than 1500', async () => {
            const year = 'abc';
            const mockBooks = [
                { bookID: '1', title: 'Book One', authors: 'Author One', publication_date: '2001-01-01' },
                { bookID: '2', title: 'Book Two', authors: 'Author Two', publication_date: '2010-01-01' }
            ];

            Book.aggregate.mockResolvedValue(mockBooks);

            const res = await request(app).get(`/api/books/year-ge/${year}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toEqual('Invalid year');
        })

        it('should handle errors gracefully', async () => {
            const year = 2000;
            const errorMessage = 'Database Error';

            Book.aggregate.mockRejectedValue(new Error(errorMessage));

            const res = await request(app).get(`/api/books/year-ge/${year}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Server Error');
        });
    });

    // test for GET books published before a specific year
    describe('GET /api/books/year-le/:year', () => {
        it('should return books published before a specified year', async () => {
            const year = 2010;
            const mockBooks = [
                { bookID: '1', title: 'Book One', authors: 'Author One', publication_date: '2001-01-01' },
                { bookID: '2', title: 'Book Two', authors: 'Author Two', publication_date: '2012-01-01' }
            ];

            Book.aggregate.mockResolvedValue(mockBooks);

            const res = await request(app).get(`/api/books/year-le/${year}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockBooks);
        });

        it('should return a 404 error if no books are found for the specified year', async () => {
            const year = 1900;
            const mockBooks = [];

            Book.aggregate.mockResolvedValue(mockBooks);

            const res = await request(app).get(`/api/books/year-le/${year}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('No books found for this year or earlier');
        });

        it('should return a 400 error if input year is not a number or less than 1500', async () => {
            const year = 'abc';
            const mockBooks = [
                { bookID: '1', title: 'Book One', authors: 'Author One', publication_date: '2001-01-01' },
                { bookID: '2', title: 'Book Two', authors: 'Author Two', publication_date: '2010-01-01' }
            ];

            Book.aggregate.mockResolvedValue(mockBooks);

            const res = await request(app).get(`/api/books/year-le/${year}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toEqual('Invalid year');
        })

        it('should handle errors gracefully', async () => {
            const year = 2000;
            const errorMessage = 'Database Error';

            Book.aggregate.mockRejectedValue(new Error(errorMessage));

            const res = await request(app).get(`/api/books/year-le/${year}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Server Error');
        });
    });
});