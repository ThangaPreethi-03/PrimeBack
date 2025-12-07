// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const dns = require("dns");

// ====================== REGISTER ======================
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, interests = [] } = req.body;

    email = email.toLowerCase().trim();

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already used' });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash: hash,
      interests
    });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== LOGIN ======================
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== CHECK EMAIL ======================
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  const domain = email.split("@")[1];

  // Validate domain exists using MX lookup
  dns.resolveMx(domain, async (err, mxRecords) => {
    if (err || !mxRecords || mxRecords.length === 0) {
      return res.json({ validDomain: false, exists: false });
    }

    // Check if user exists
    const found = await User.findOne({ email: email.toLowerCase().trim() });
    const exists = !!found;

    return res.json({
      validDomain: true,
      exists
    });
  });
});

module.exports = router;
