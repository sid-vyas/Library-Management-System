const userModel = require('../models/userModel');
const bookModel = require('../models/bookModel');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
};

const showLogin = (req, res) => {
  res.render('login', { error: null });
};

const showDashboard = async (req, res) => {
  try {
    const books = await bookModel.getAllBooks();
    if(req.session.user.role === 'Admin') {
      res.render('adminDashboard', { error: null , books});
    } else if(req.session.user.role === 'Librarian') {
      res.render('librarianDashboard', {error: null , books});
    } else {
      res.render('customerDashboard', {error: null, books});
    }
    } catch (error) {
    res.status(500).send('Error retrieving books from the database');
  }
};

const login = async (req, res) => {
  const { username, password, role } = req.body;
  const user = await userModel.getUserByUsernameAndPassword(username, password);

  if (user === null) {
    res.render('login', { error: 'Invalid username or password' });
  } else {
    // Checking if the user is blocked
    if(user.blocked === true) {
      res.render('login', { error: 'This account has been blocked. Contact your local administrator for any questions.' });
    }

    if(user.role === role) {
      req.session.user = user;      
      res.redirect('/dashboard');
      
    } else {
      res.render('login', { error: 'Role does not match' });
    }    
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

module.exports = {
  isAuthenticated,
  showLogin,
  showDashboard,
  login,
  logout,
};
