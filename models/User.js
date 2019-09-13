const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: true
  },
  email: {
    type: String,
    trim: true,
    require: true
  },
  hashed_password: {
    type: String,
    require: true
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now()
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  update: Date,
  following: [{ type: ObjectId, ref: 'User' }],
  followers: [{ type: ObjectId, ref: 'User' }]
});

userSchema
  .virtual('password')
  .set(function(password) {
    //create temporary variable called _password
    this._password = password;
    //generate a timestamp
    this.salt = uuidv1();
    //encryptPassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(() => this._password);

userSchema.methods = {
  authenticate: function(plaintext) {
    return this.encryptPassword(plaintext) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  }
};

module.exports = mongoose.model('User', userSchema);
