const router = require("express").Router();
const Message = require("../models/Message");

//add
router.post("/", async (req, res)=>{
    const newMsg = new Message(req.body);
    try{
        const savedOne = await newMsg.save();
        res.status(200).json(savedOne);
    }catch(err){
        console.log("Error while adding the new message");
        res.status(500).json("Erro");
    }
})



//get
router.get("/:conversationId", async (req,res)=>{
    try{
        const allMsgs = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(allMsgs);
    }catch(err){
        res.status(500).json(err);
    }
})



module.exports = router