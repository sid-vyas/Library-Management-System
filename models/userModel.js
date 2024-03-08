const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Librarian', 'Customer'], required: true },
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number. Please enter only digits.`
    }
  },
  blocked: { type: Boolean, default: false },
  checkedOutBooks: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], default: [] }
});

const User = mongoose.model('User', userSchema);

const getUserAndAddCheckedOutBook = async (userId, bookId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      { $push: { checkedOutBooks: bookId } },
      { new: true }
    );
  } catch(error) {
    console.log(error);
  }
}

const getUserCheckedOutBooks = async (username) => {
  try {
    const user = await User.findOne({ username }).populate('checkedOutBooks');
    if (!user) {
      throw new Error('User not found');
    }
    return user.checkedOutBooks;
  } catch (error) {
    console.error('Error retrieving checked out books:', error);
  }
}

const returnBook = async (userId, bookId) => {
  try {
    await User.findByIdAndUpdate(userId, { $pull: { checkedOutBooks: bookId } });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).send('Error returning book');
  }
}

const getUserByUsernameAndPassword = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    console.log('Username not found')
    return null;
  }
  const passwordMatch = password === user.password;
  if (passwordMatch) {
    console.log('Password Match');
    return user;
  } else {
    console.log('Password Not Match');
    return null;
  }
};

const blockOrUnblockUserById = async (userId) => {
  try {
    const user = await User.findById(userId);

    if(user.blocked === true) {
      await User.updateOne({ _id: userId }, { blocked: false });
    } else {
      await User.updateOne({ _id: userId }, { blocked: true });
    }

  } catch (error) {
    throw new Error('Error blocking user in the database');
  }
};

const changeUserDetails = async (userId, updates) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    return user;
  } catch (error) {
    throw new Error('Error updating user details');
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    throw new Error('Error retrieving users from the database');
  }
};

const createUser = async (username, password, role, firstName, lastName, email, phoneNumber) => {
  return await User.create({ username, password, role, firstName, lastName, email, phoneNumber });
};


module.exports = {
  getUserByUsernameAndPassword,
  createUser,
  getAllUsers,
  blockOrUnblockUserById,
  changeUserDetails,
  getUserAndAddCheckedOutBook,
  getUserCheckedOutBooks,
  returnBook
};
