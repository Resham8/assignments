const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { UserModal, TodoModel} = require("./database/index");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;

// User Routes
router.post('/signup',async (req, res) => {

    const requiredBody = z.object({
        email: z.string().min(3).max(100).email().trim(),
        name: z.string().min(3).max(100).trim(),
        password: z.string().min(3).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)
    })

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    if(!parsedDataWithSuccess.success){
        res.json({
            error: parsedDataWithSuccess.error
        })
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password; 

    const hashedPassword = bcrypt.hash(password, 5);

    await UserModal.create({
        email: email,
        password:hashedPassword,
        name:name
    })

    res.json({
        msg: "You are signed up"
    })
        
});

router.post('/login',async (req, res) => {
     const email = req.body.email;
     const password = req.body.password;

     const response = await UserModal.find({
        email:email
     })

     if(!response){
        res.status(404).json({
            msg:"User does not exists"
        })
     }

     const passwordMatch = await bcrypt.compare(password, response.password);

    if(passwordMatch){
        const token = jwt.sign({
            id: response._id.toString()
        }, JWT_SECRET);        

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            error: "Incorrect Credentials"
        })
    }
});

router.get('/todos', userMiddleware, (req, res) => {
    // Implement logic for getting todos for a user
});

router.post('/logout', userMiddleware, (req, res) => {
    // Implement logout logic
});

module.exports = router