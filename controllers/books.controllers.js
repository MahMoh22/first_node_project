const Book = require('../models/Books');
const statusHelper = require('../utils/status.helper');
const asyncWrapper = require('../middleware/asyncWrapper');
const ERRORHelper = require('../utils/error.helper');
const getAllBooks = 
asyncWrapper(
    async (req, res) => {
        const query = req.query;
        const limit = query.limit ? parseInt(query.limit) : 10;
        const page = query.page ? parseInt(query.page) : 1;
        const skip = (page - 1) * limit;
        const books = await Book.find({},{"__v":false}).limit(limit).skip(skip);
        res.json({
            status: statusHelper.SUCCESS,
            message: 'Books fetched successfully',
            data: {books: books},
        });
            }
        ) ;
const createBook = asyncWrapper( async (req, res) => {
        const book = new Book(req.body);
        await book.save();
        
        res.json({
            status: statusHelper.SUCCESS, 
            message: 'Book created successfully',
            data: {book: book},
        });
    
});
const updateBook = asyncWrapper( async (req, res, next) => {
        console.log(req.body);
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            select: '-__v'
        });
        if (!book) {
            const error = ERRORHelper.create('Book not found', 404,statusHelper.FAIL);
            return next(error);
        }
        return res.json({ 
            status: statusHelper.SUCCESS,
            message: 'Book updated successfully',
            data: {book: book},
         });
});
const deleteBook = asyncWrapper( async (req, res, next) => {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            const error = ERRORHelper.create('Book not found', 404,statusHelper.FAIL);
            return next(error);
        }
        return res.json({ 
            status: statusHelper.SUCCESS,
            message: 'Book deleted successfully' ,
            data: null,
        });
});
const getBook = asyncWrapper( async (req, res, next) => {
        const id = req.params.id;
        const book = await Book.findById(req.params.id,{"__v":false});
        if (!book) {
            const error = ERRORHelper.create('Book not found', 404,statusHelper.FAIL);
            return next(error);
        }
        return res.json({
            status: statusHelper.SUCCESS,
            message: 'Book fetched successfully',
            data: {book: book},
        });
});

module.exports = {
    getAllBooks: getAllBooks,
    createBook: createBook,
    updateBook: updateBook,
    deleteBook: deleteBook,
    getBook: getBook
}