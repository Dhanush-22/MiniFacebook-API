const router = require("express").Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = router

// router.get("/",function (req, res){
//     res.send("<h1>This is the user Page</h1>")
// });



// Update user
router.put("/:id", async (req,res)=>{
    console.log(req.body.userId);
    console.log(req.params.id);
    if(req.body.userId === req.params.id){
        if(req.body.password){
            try{
                await bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    req.body.password = hash;
                });
            }catch(err){
                res.status(500).json("Error while updating password");
            }
        }
        try{
            const userUpdated = await User.findByIdAndUpdate(req.params.id,{
                $set : req.body
            });
            res.status(200).json("Account has been updated");
        }catch(err){
            res.status(500).json("Error while updating the account");
        }
    }else{
        return res.status(403).json("You can update only your account!");
    }
});


// Delete a user
router.delete("/:id", async (req,res)=>{
    if(req.body.userId === req.params.id){
        try{
            // const deletedUser = User.findByIdAndDelete(req.params.id);
            const deletedUser = User.deleteOne({"_id" : req.params.id}, function(err){
                if(err){
                    console.log(err);
                }else{
                    // console.log("Done");
                    res.status(200).json("Account has been deleted Successfully");
                }
            } );
            
        }catch(err){
            res.status(500).json("Error while deleting the account");
        }
    }else{
        return res.status(403).json("You can delete only your account!");
    }
});



// Get a user

router.get("/", async (req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
    try{
        const user = userId? (await User.findById(userId)) : (await User.findOne({username:username}));
        const {password, ...other} = user._doc
        res.status(200).json(other);
    }catch(e){
        console.log(e);
        res.status(500).json("Error while fetching an user.")
    }
});


// get friends
router.get("/friends/:userId", async (req, res) =>{
    try{
        const currUser = await User.findById(req.params.userId);
        const friends = await Promise.all(
            currUser.followings.map((friendId) => {
                return User.findById(friendId);
            }));
        let friendsList = [];
        friends.map(friend=>{
            const {_id, username, profilePicture} = friend;
            friendsList.push({_id, username, profilePicture});
        })
        res.status(200).json(friendsList);
    }catch(err){
        res.status(404).json("Error while fetching friends");
    }
})


// Follow a user
router.put("/:id/follow", async (req, res) =>{
    if (req.body.userId != req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push : {followers : req.body.userId}});
                await currentUser.updateOne({$push : {followings : req.params.id}});
                res.status(200).json("You have just started following "+ user.username);
            }else{
                res.status(403).json("You are already following the "+ user.username);
            }
        }catch(err){
            res.status(500).json("Error raised while trying to follow");
        }
    }else{
        res.status(403).json("You can't follow yourself");

    }
});



// Unfollow a user
router.put("/:id/unfollow", async (req, res) =>{
    if (req.body.userId != req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull : {followers : req.body.userId}});
                await currentUser.updateOne({$pull : {followings : req.params.id}});
                res.status(200).json("Unfollowed "+ user.username);
            }else{
                res.status(403).json("You are not following "+ user.username);
            }
        }catch(err){
            console.log(err);
            res.status(500).json("Error raised while trying to follow");
        }
    }else{
        res.status(403).json("You can't unfollow yourself");

    }
});
