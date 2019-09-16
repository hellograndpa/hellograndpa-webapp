const express = require('express');

const { logIn } = require('../middlewares/logIn');

const router = express.Router();

const Message = require('../models/Message');

// Get home page
router.get('/', logIn, async (req, res) => {
  const messages = await Message.find({
    userTo: req.session.currentUser._id,
  }).populate('userFrom booking');

  res.render('user/messages/list', { messages });
});

module.exports = router;
