import {Book} from "../models/Book.js";
import Transaction from '../models/Transaction.js';

// Add a new book
export const addBook = async (req, res) => {
  try {
    const { title, author, genre, publishedDate, availableCopies } = req.body;

    // Create a new book
    const newBook = new Book({
      title,
      author,
      genre,
      publishedDate,
      availableCopies,
    });

    // Save the book to the database
    await newBook.save();

    res.status(201).json({
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("Error adding book:", error);
    res
      .status(500)
      .json({ message: "Error adding book", error: error.message });
  }
};

// Update book details
export const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, genre, publishedDate, availableCopies } = req.body;

    // Find the book by ID
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update the book details
    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.publishedDate = publishedDate || book.publishedDate;
    book.availableCopies = availableCopies || book.availableCopies;

    // Save the updated book
    await book.save();

    res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params; 

    // Find and delete the book by ID
    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book,
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};
export const getAllBooks = async (req, res) => {
  try {
    // Retrieve all books from the database
    const books = await Book.find(); // Get all books from the Book model

    res.status(200).json({
      message: "Books retrieved successfully",
      books: books, // Return the list of books
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
};



// Borrow a book (for members)
export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params; 
    const userId = req.user.id; 

    // Find the book by ID
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book is available
    if (book.availableCopies <= 0) {
      return res
        .status(400)
        .json({ message: "No available copies of the book" });
    }

    // Create a new transaction for borrowing
    const transaction = new Transaction({
      userId,
      bookId: book._id,
      borrowedAt: new Date(),
    });

    await transaction.save();

    // Update the book's available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(200).json({
      message: "Book borrowed successfully",
      transaction,
      book,
    });
  } catch (error) {
    console.error("Error borrowing book:", error);
    res
      .status(500)
      .json({ message: "Error borrowing book", error: error.message });
  }
};

// Return a book (for members)
export const returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    // Find the book by ID
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book was borrowed by the user
    const transaction = await Transaction.findOne({
      userId,
      bookId: book._id,
      returnedAt: null,
    });

    if (!transaction) {
      return res
        .status(400)
        .json({ message: "You have not borrowed this book" });
    }

    // Update the return date of the transaction
    transaction.returnedAt = new Date();
    await transaction.save();

    // Update the book's available copies
    book.availableCopies += 1;
    await book.save();

    res.status(200).json({
      message: "Book returned successfully",
      transaction,
      book,
    });
  } catch (error) {
    console.error("Error returning book:", error);
    res
      .status(500)
      .json({ message: "Error returning book", error: error.message });
  }
};
export const getAllTransactions = async (req, res) => {
  try {
    // Retrieve all transactions from the database
    const transactions = await Transaction.find()
      .populate("userId", "name email") 
      .populate("bookId", "title author")
      .sort({ borrowedAt: -1 }); 

    res.status(200).json({
      message: "Transactions retrieved successfully",
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res
      .status(500)
      .json({ message: "Error retrieving transactions", error: error.message });
  }
};


// Get borrow/return transactions for the logged-in member
export const getMemberTransactions = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Find transactions for the logged-in member
    const transactions = await Transaction.find({ userId })
      .populate("bookId", "title author") // Populate book details
      .sort({ borrowedAt: -1 }); 

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user" });
    }

    res.status(200).json({
      message: "Transactions retrieved successfully",
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res
      .status(500)
      .json({ message: "Error retrieving transactions", error: error.message });
  }
};
