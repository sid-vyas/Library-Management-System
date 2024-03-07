const mongoose = require('mongoose');
const User = require('./userModel');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

const Category = mongoose.model('Category', categorySchema);

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  quantity: { type: Number, required: true },
  checkedOutQuantity: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
});

const Book = mongoose.model('Book', bookSchema);

const getAllBooks = async () => {
  try {
    const books = await Book.find().populate('category');
    return books;
  } catch (error) {
    throw new Error('Error retrieving books from the database');
  }
};

const deleteCategory = async (categoryId) => {
  try {
    await Book.deleteMany({ category: categoryId });
    await Category.findByIdAndDelete(categoryId);
    return true;
  
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).send('Error deleting category');
    return false;
  }
};

const checkOutBook = async (userId, bookId) => {
  try {
    await Book.findByIdAndUpdate(
      bookId,
      { $inc: { checkedOutQuantity: 1 } },
      { new: true }
    );

    User.getUserAndAddCheckedOutBook(userId, bookId);
    return true;
  } catch (error) {
    console.error('Error Checking Out:', error);
    res.status(500).send('Error Checking Out');
    return false;
  }
};

const returnBook = async (userId, bookId) => {
  try {
    await Book.findByIdAndUpdate(
      bookId,
      { $inc: { checkedOutQuantity: -1 } },
      { new: true }
    );

    await User.returnBook(userId, bookId);
    return true;
  } catch (error) {
    console.error('Error Checking Out:', error);
    res.status(500).send('Error Checking Out');
    return false;
  }
};

const deleteBook = async (bookId) => {
  try {
    await Book.findByIdAndDelete(bookId);
    return true;
  } catch(error) {
    return false;
  }
  
};


module.exports = {
  getAllBooks,
  deleteBook,
  deleteCategory,
  checkOutBook,
  returnBook
};
