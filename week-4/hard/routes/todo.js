const { Router } = require("express");
const adminMiddleware = require("../middleware/user");
const { User, Todo} = require("../database/index");
const { z } = require("zod");
const router = Router();

const todoSchema = z.object({
    title: z.string().trim().min(3),
    isDone: z.boolean()
})

// todo Routes
router.post('/', async (req, res) => {
    const parsedData = todoSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            error: parsedData.error
        });
    }

    const userId = req.userId;
    const title = req.body.title;
    const isDone = req.body.isDone;
    try {
        await Todo.create({
            userId,
            title,
            isDone
        })
        res.json({
            msg:"todo addes suscussfully",
            userId:userId
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }    
});

router.put('/', adminMiddleware, (req, res) => {
    // Implement update todo  logic
});

router.delete('/', adminMiddleware, (req, res) => {
    // Implement delete todo logic
});

router.delete('/:id', adminMiddleware, (req, res) => {
    // Implement delete todo by id logic
});


router.get('/', adminMiddleware, async (req, res) => {
    const userId = req.userId;
    console.log(userId)
    try{
        const todos = await Todo.find({
            userId:userId
        })

        res.status(200).json({
            todos:todos
        });

    } catch(err) {
        console.log(err);
    }        
});

router.get('/:id', adminMiddleware, (req, res) => {
    // Implement fetching todo by id logic
});

module.exports = router;