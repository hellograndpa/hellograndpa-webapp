const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    userTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    message: String,
    sentDateHour: Date,
    readed: Boolean,
  },
  { timestamps: true },
);
const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
