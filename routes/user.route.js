const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateToken = require("../middleware/validatetokenhandler");
const router = express.Router();

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All field are mandatory" });
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    } else {
      return res.status(404).json({ message: "Email or password invalid." });
    }
  })
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All field are mandatory." });
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      return res.status(400).json({ message: "User already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    console.log(`User created ${user}`);
    if (user) {
      return res.status(201).json({ id: user.id, email: user.email });
    } else {
      return res.status(400).json({ message: "User data is not valid." });
    }
  })
);

router.get(
  "/current",
  validateToken,
  asyncHandler(async (req, res) => {
    return res.json(req.user);
  })
);

module.exports = router;
