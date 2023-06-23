const router = require("express").Router();
const Conversation = require("../models/Conversation");


//new conversation

router.post("/", async (req,res)=>{
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });
    try{
        const savedOne = await newConversation.save();
        res.status(200).json(savedOne);
    }catch(err){
        console.log("Error while saving the new conversation");
        res.status(500).json("Erro");
    }
})


//get conversation of user
router.get("/:userId", async (req,res)=>{
    try{
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId]},
        });
        res.status(200).json(conversation);
    }catch(err){
        res.status(500).json(err);
    }
})


//get conversation that includes two ids
router.get("/find/:userId1/:userId2", async (req,res)=>{
    try{
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.userId1, req.params.userId2]},
        });
        res.status(200).json(conversation);
    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router