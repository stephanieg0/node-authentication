'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BCRYPT_DIFFICULTY = 11;

const UserSchema = mongoose.Schema({
  email: String,
  password: String
});

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, BCRYPT_DIFFICULTY, (err, hash) => {
    console.log(this, this.password, BCRYPT_DIFFICULTY);

    if (err) throw err;

    this.password = hash;
    next();
  });
});

module.exports = mongoose.model('Users', UserSchema);
