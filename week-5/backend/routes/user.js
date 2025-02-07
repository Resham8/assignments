const { Router } = require("express");
const router = Router();
const authMiddleware = require("../middleware/user");
const { User, Todo } = require("../db/index");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async function (req, res) {
  const requiredBody = z.object({
    Username: z.string().min(3).max(100),
    password: z
      .string()
      .min(3)
      .max(30)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      ),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    return res.json({
      error: parsedDataWithSuccess.error,
    });
  }

  const Username = req.body.username;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 7);

  await User.create({
    Username: Username,
    password: password,
  });

  res.status(201).json({
    msg: "You are signed up",
  });
});

router.post("/login", async function (req, res) {
  const Username = req.body.Username;
  const password = req.body.password;

  const user = await mongoose.findOne({
    Username: Username,
  });

  if (user) {
    res.status(404).json({
      error: "User already exists",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: "Incorrect Password" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  res.status(200).json({
    token: token,
    msg: "login Successfull",
  });
})

module.exports = router;