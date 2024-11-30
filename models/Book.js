import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    availableCopies: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", BookSchema);
