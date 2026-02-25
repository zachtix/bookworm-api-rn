import express from "express";
import {
  createBook,
  deleteBook,
  editBook,
  getBooks,
  getBooksByUser,
} from "../controller/bookController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/user", protectRoute, getBooksByUser);

router.post("/", protectRoute, createBook);

router.patch("/:id_book", protectRoute, editBook);

router.delete("/:id_book", protectRoute, deleteBook);

export default router;
