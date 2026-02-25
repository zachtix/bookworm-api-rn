import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";

export const getBooks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");
    const totalBooks = await Book.countDocuments();

    res.status(200).json({
      message: "get book successfully",
      data: books,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalBooks / limit),
        total: totalBooks,
      },
    });
  } catch (error) {
    console.log("Error get book route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBooksByUser = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    // res.json(books);
    res.status(200).json({
      message: "get book successfully",
      data: books,
      pagination: {
        page: 1,
        limit: books.length,
        totalPages: Math.ceil(books.length / books.length),
        total: books.length,
      },
    });
  } catch (error) {
    console.error("Get user books error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!title || !caption || !rating || !image)
      return res.status(400).json({ message: "All fields are required" });

    const uploadRes = await cloudinary.uploader.upload(image);
    const imageUrl = uploadRes.secure_url;

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      // user: req.user._id,
      user: req.user._id,
    });

    await newBook.save();

    res
      .status(201)
      .json({ message: "create book successfully", data: newBook });
  } catch (error) {
    console.log("Error create book route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editBook = async (req, res) => {};

export const deleteBook = async (req, res) => {
  try {
    const { id_book } = req.params;
    // const book = await Book.deleteOne({ _id: id_book });
    const book = await Book.findById(id_book);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    if (book.image && book.image.includes("cloudinary")) {
      const publicId = book.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
      try {
      } catch (error) {
        console.log("Error delete image from cloudinary:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }

    await book.deleteOne();

    res.status(200).json({ message: "delete book successfully" });
  } catch (error) {
    console.log("Error delete book route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
