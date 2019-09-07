const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      firstname: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true,
      },
      lastname: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true,
      },
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    bio: String,
    avatar: { tuype: String, default: '../images/avatardefault.jpg' },
    birthday: Date,
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: Number,
    },
    admin: Boolean,
    hashpass: String,
    dni: Number,
    tel: [Number],
    created: {
      type: Date,
      default: Date.now,
    },
    active: Boolean,
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
