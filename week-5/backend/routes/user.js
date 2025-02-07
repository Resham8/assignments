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
    username: z.string().min(3).max(100),
    password: z
      .string()
      .min(3)
      .max(30)
      // .regex(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      // ),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    return res.json({
      error: parsedDataWithSuccess.error,
    });
  }

  const username = req.body.username;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 3);

  await User.create({
    username: username,
    password: hashedPassword,
  });

  res.status(201).json({
    msg: "You are signed up",
  });
});

router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({
    username: username,
  });

  if (!user) {
    res.status(404).json({
      error: "User does not exists",
    });
  }

  // console.log(password)
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: "Incorrect Password" });
  }

  const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET);

  res.status(200).json({
    token: token,
    msg: "login Successfull",
  });
})

module.exports = router;