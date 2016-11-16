const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  id: String,
  provider: String,
  token: String,
  displayName: String,
  email: String,
  photo: String,
  chatroom: Array
});

module.exports = mongoose.model('User', UserSchema);
