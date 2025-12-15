// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dns = require("dns");
const emailValidator = require("email-validator");
const User = require("../models/User");

const router = express.Router();

/* -------------------------
   EMAIL DOMAIN VALIDATION
-------------------------- */
async function isRealEmail(email) {
  if (!emailValidator.validate(email)) return false;

  const domain = email.split("@")[1];

  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/* ======================
   REGISTER
====================== */
router.post("/register", async (req, res) => {
  try {
    let { name, email, password, interests = [] } = req.body;

    email = email.toLowerCase().trim();

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "Email already used" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash: hash,
      interests,
    });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests,
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
        interests: user.interests,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   LOGIN
====================== */
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests,
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
        interests: user.interests,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   CHECK EMAIL
====================== */
router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.json({ validDomain: false, exists: false });
  }

  const domain = email.split("@")[1];

  dns.resolveMx(domain, async (err, mx) => {
    if (err || !mx || mx.length === 0) {
      return res.json({ validDomain: false, exists: false });
    }

    const found = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    res.json({
      validDomain: true,
      exists: !!found,
    });
  });
});

/* ======================
   GET CURRENT USER (🔥 IMPORTANT)
====================== */
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
});

module.exports = router;
