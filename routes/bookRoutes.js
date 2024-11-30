import express from "express";
import {
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
  borrowBook,
  returnBook,
  getAllTransactions,
  getMemberTransactions,
} from "../controllers/bookController.js";
import { roleMiddleware } from "../middleware/auth.js"; 
const router = express.Router();

// Route to add a new book (Admin-only access)
router.post("/add-books", roleMiddleware(["Admin"]), addBook);

// Route to update book details (Admin-only access)
router.put("/update-books/:bookId", roleMiddleware(["Admin"]), updateBook);

// Route to delete a book (Admin-only access)
router.delete("/delete-books/:bookId", roleMiddleware(["Admin"]), deleteBook);

router.get("/all-books", getAllBooks);
// router.get("/all-books", roleMiddleware(["Librarian"]), getAllBooks);

router.post("/borrow-books/:bookId", roleMiddleware(["Member"]), borrowBook);

// Route to return a book (Authenticated users)
router.post("/return-books/:bookId", roleMiddleware(["Member"]), returnBook);

router.get("/all-transactions", roleMiddleware(["Admin"]), getAllTransactions);
router.get(
  "/all-transactions",
  roleMiddleware(["Librarian"]),
  getAllTransactions
);

router.get("/member-transactions",roleMiddleware(["Member"]), getMemberTransactions);

export default router;
