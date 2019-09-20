const express = require('express');

const { logIn } = require('../middlewares/logIn');

const router = express.Router();

const Message = require('../models/Message');

// Get home page
router.get('/inbox', logIn, async (req, res) => {
  const messages = await Message.find({
    userTo: req.session.currentUser._id,
  }).populate('userFrom booking');

  res.render('user/messages/inbox', { messages });
});

router.get('/sent', logIn, async (req, res) => {
  const messages = await Message.find({
    userFrom: req.session.currentUser._id,
  }).populate('userFrom booking');

  res.render('user/messages/sent', { messages });
});

module.exports = router;
