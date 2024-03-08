const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;

// Database connection
const mongoose = require('mongoose');

// Models
const userModel = require('./models/userModel');
const bookModel = require('./models/bookModel');

// Controllers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const bookController = require('./controllers/bookController');

// Middleware
app.set('view engine', 'ejs');
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', bookController.getIndexPage);

app.get('/register', userController.viewRegistrationForm);
app.post('/register', userController.registerUser);

app.get('/login', authController.showLogin);
app.post('/login', authController.login);
app.get('/logout', authController.isAuthenticated, authController.logout);

app.get('/dashboard', authController.showDashboard);

app.get('/books', authController.isAuthenticated, bookController.viewAllBooks);
app.post('/delete-category', bookController.deleteCategory);
app.post('/delete-book', bookController.deleteBook);
app.get('/:bookId/edit-quantity', bookController.showEditQuantityForm);
app.post('/:bookId/update-quantity', bookController.showUpdateBookQuantity);

app.get('/view-add-category', authController.isAuthenticated, bookController.viewAddCategory);
app.post('/add-category', authController.isAuthenticated, bookController.addCategory );

app.post('/check-out', authController.isAuthenticated, bookController.checkOutBook);
app.get('/checked-out-books', authController.isAuthenticated, bookController.viewCheckedOutBooks);
app.post('/return-book', authController.isAuthenticated, bookController.returnBook);

app.get('/all-checked-out-books', authController.isAuthenticated, bookController.viewCheckedOutBooks);

app.get('/profile', authController.isAuthenticated, userController.showProfile);
app.get('/edit-profile', authController.isAuthenticated, userController.showEditProfile);
app.post('/edit-profile', authController.isAuthenticated, userController.editUserDetails);

app.get('/viewAllUsers', authController.isAuthenticated, userController.viewAllUsers);

app.get('/add-librarian', authController.isAuthenticated, userController.showAddLibrarian);
app.post('/add-librarian', authController.isAuthenticated, userController.createLibrarian);


app.post('/block-user', userController.blockOrUnblockUser);


const startApplication = async() => {
  await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  })

  console.log('Connected to MongoDB');

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startApplication();