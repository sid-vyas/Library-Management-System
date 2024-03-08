const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');


const viewAllBooks = async (req, res) => {
  try {
    const books = await bookModel.getAllBooks();
    if(req.session.user.role === 'Admin') {
      res.render('adminBooks', { books });
    } else if (req.session.user.role === 'Librarian') {
      res.render('librarianBooks', { books });
    } else {
      res.render('customerBooks', { books });
    }
    } catch (error) {
    res.status(500).send('Error retrieving books from the database');
  }
};

const getIndexPage = async (req, res) => {
  try {
    const books = await bookModel.getAllBooks();
    res.render('index', { books });
    } catch (error) {
    res.status(500).send('Error retrieving books from the database');
  }
};

const viewAddCategory = async (req, res) => {
  try {
    const categories = await bookModel.getAllCategories();
    res.render('addCategory', { categories, error: null });
  } catch(error) {
    res.status(500).send('Error fetching categories');
  }
};

const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    await bookModel.addCategory(categoryName);
    res.redirect('/view-add-category');
  } catch(error) {
    res.status(500).send('Error adding new category.');
  }
};

const viewCheckedOutBooks = async (req, res) => {
  try {
    if(req.session.user.role === 'Customer') {
      const checkedOutBooks = await userModel.getUserCheckedOutBooks(req.session.user.username);
      res.render('checkedOutBooks', { checkedOutBooks });
    } else {
      const checkedOutBooks = await bookModel.getAllCheckedOutBooks();
      res.render('librarianCheckedOutBooks', { checkedOutBooks });
    }
  } catch(error) {
    console.log(error)
  }
}

const returnBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const isReturned = await bookModel.returnBook(req.session.user._id, bookId);
    if(isReturned) {
      res.redirect('/checked-out-books');
    } else {
      res.status(500).send('Error Returning Book');
    }
  } catch(error) {
    res.status(500).send('Error Returning Book');
  }
}

const showEditQuantityForm = async (req, res) => {
  try {
      res.render('librarianEditBookQuantity');
    } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

const showUpdateBookQuantity = async (req, res) => {
  try {
      const { bookId } = req.body
      res.render('librarianEditBookQuantity');
    } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

const checkOutBook = async (req, res) => {
  try {
    const { bookId } = req.body
    const isCheckedOut = await bookModel.checkOutBook(req.session.user._id , bookId);
    if(isCheckedOut) {
      res.redirect('/books');
    } else {
      res.status(500).send('Error checking out book');
    }
  } catch (error) {
  res.status(500).send('Internal Server Error');
}
};


const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const isDeleted = await bookModel.deleteCategory(categoryId);
    if(isDeleted) {
      res.redirect('/books');
    } else {
      res.status(500).send('Error deleting category');
    }
  } catch (error) {
    res.status(500).send('Error deleting category');
  }
};

const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const isDeleted = await bookModel.deleteBook(bookId);
    if(isDeleted) {
      res.redirect('/books');
    } else {
      res.status(500).send('Error deleting book');
    }
  } catch (error) {
    res.status(500).send('Error deleting book');
  }
};


module.exports = {
  viewAllBooks,
  deleteCategory,
  deleteBook,
  showEditQuantityForm,
  showUpdateBookQuantity,
  getIndexPage,
  checkOutBook,
  viewCheckedOutBooks,
  returnBook,
  addCategory,
  viewAddCategory
};
