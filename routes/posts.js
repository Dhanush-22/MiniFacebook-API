const Post = require("../models/Post");
const User = require("../models/User");

const router = require("express").Router();




// Posts Home Page

// router.get("/", async )



// create post
router.post("/", async (req,res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json("Posted successfully");
    }catch(err){
        res.status(500).json("Error while creating a post");
    }
});


// update post
router.put("/:postId", async (req,res)=>{
    try{
        if(req.body.postId === req.params.postId){
            const post =  Post.findById(req.body.postId);
            await post.updateOne({$set:req.body});
            res.status(200).json("Post updated successfully");
        }else{
            res.status(403).json("You can update your posts only");
        }
    }catch(err){
        res.status(500).json("Error while updating a post");
    }
});


// delete post
router.delete("/:postId", async (req,res)=>{
    try{
        if(req.body.postId === req.params.postId){
            const post =  await Post.findByIdAndDelete(req.body.postId);
            res.status(200).json("Post has been deleetd");
        }else{
            res.status(403).json("You can delete your posts only");
        }
    }catch(err){
        res.status(500).json("Error while deleting a post");
    }
});

// like dislike post
router.put("/:postId/like", async (req,res)=>{
    console.log(req.params.postId);
    console.log(req.body.userId);
    try{
        const postP = await Post.findById(req.params.postId);
        if(!postP.likes.includes(req.body.userId)){
            await postP.updateOne({$push : { likes : req.body.userId } } );
            res.status(200).json("You just liked this post.");
        }else{
            await postP.updateOne({$pull : { likes : req.body.userId } } );
            res.status(200).json("You just unliked this post.");
        }
    }catch(err){
        console.log(err);
        res.status(500).json("Error while liking a post.");
    }
});
// get post
// router.get("/:postId", async (req,res)=>{
//     try{
//         const postP = await Post.findById(req.params.postId);
//         res.status(200).json(postP);
//     }catch(err){
//         console.log(err);
//         res.status(500).json("Error while fetching a post.");
//     }
// });

// get timeline post --> user following posts

router.get("/timeline/:userId", async (req, res) =>{
    console.log(req.body.userId);
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({'userId': req.params.userId});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({'userId': friendId});
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    }catch(err){
        console.log(err);
        res.status(500).json("Error while fetching timeline posts.")
    }
});


// get user's all posts
router.get("/profile/:username", async (req, res) =>{
    try{
        const user = await User.findOne({username:req.params.username});
        const posts = await Post.find({'userId': user._id});
        console.log("Successfully Fetched.............");
        res.status(200).json(posts);

    }catch(err){
        console.log(err);
        res.status(500).json("Error while fetching timeline posts." + req.params.username)
    }
});






module.exports = router





