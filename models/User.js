const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      firstname: {
        type: String,
        required: true,
        // required: [true, "can't be blank"],
        // match: [/^[\\p{L} .'-]+$/, 'is invalid'],
        index: true,
      },
      lastname: {
        type: String,
        required: true,
        // required: [true, "can't be blank"],
        // match: [/^[\\p{L} .'-]+$/, 'is invalid'],
        index: true,
      },
    },
    email: {
      type: String,
      lowercase: true,
      // required: [true, "can't be blank"],
      required: true,
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    bio: String,
    avatar: { type: String, default: '/images/avatar/default.png' },
    birthday: {
      type: String,
      required: true,
      // required: [true, "can't be blank"],
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String,
    },
    adminUser: {
      type: Boolean,
      default: false,
    },
    mentorUser: {
      type: Boolean,
      default: false,
    },
    grandpaUser: {
      type: Boolean,
      default: false,
    },
    hashpass: String,
    idCard: String,
    phone: [String],
    created: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
