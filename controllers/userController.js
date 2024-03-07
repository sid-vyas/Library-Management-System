const userModel = require('../models/userModel');

const viewRegistrationForm = (req, res) => {
  res.render('register', { error: null });
};

const registerUser = async (req, res) => {
  const { username, password, role, firstName, lastName, email, phoneNumber } = req.body;
  try {
    await userModel.createUser(username, password, role, firstName, lastName, email, phoneNumber);
    res.redirect('/login');
  } catch (err) {
    res.render('register', { error: err.message });
  }
};

const showProfile = (req, res) => {
  const user = req.session.user;
  res.render('profile', { user });
};

const showEditProfile = (req, res) => {
  const user = req.session.user;
  res.render('editProfile', { user });
};

const editUserDetails = async (req, res) => {
  const userId = req.session.user._id;
  
  const updates = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber
  };

  try {
    const updatedUser = await userModel.changeUserDetails(userId, updates);
    req.session.user = updatedUser;
    res.redirect('/profile');
  } catch (error) {
    res.status(500).send('Error updating user details');
  }
};

const showAddLibrarian = (req, res) => {
  res.render('addLibrarian', { success: "", error: "" });
}

const createLibrarian = async (req, res) => {
  const { username, password, firstName, lastName, email, phoneNumber } = req.body;
  try {
    await userModel.createUser(username, password, 'Librarian', firstName, lastName, email, phoneNumber);
    res.render('addLibrarian', { success: "Librarian added successfully", error: "" });
  } catch (err) {
    res.render('addLibrarian', { success: "", error: "Librarian could not be added" });
  }
};


const viewAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    const currentUser = req.session.user;
    res.render('viewAllUsers', { users, currentUser });
  } catch (error) {
    res.status(500).send('Error retrieving users from the database');
  }
};

const blockOrUnblockUser = async (req, res) => {
  const { userId } = req.body;
  
  try {
    await userModel.blockOrUnblockUserById(userId);
    res.redirect('/viewAllUsers');
  } catch (error) {
    res.status(500).send('Error blocking user');
  }
};

module.exports = {
  viewRegistrationForm,
  registerUser,
  showProfile,
  viewAllUsers,
  blockOrUnblockUser,
  showAddLibrarian,
  createLibrarian,
  showEditProfile,
  editUserDetails
};
