const router = require("express").Router();
const User = require("../models/User");


const bodyParser = require("body-parser");


const bcrypt = require("bcrypt");
const saltRounds = 15;


router.get("/",function (req, res){
    res.send("<h1>This is the Auth Page</h1>")
});



// router.get("/register",async (req,res) => {
//     // res.send("Yet to design login page")
//     // console.log(UserSchema);
//     // res.send("hvj kuhger");
//     const userItem = new User({
//         username : "Johny J",
//         email : "Johny12345@gmail.com",
//         passwd : "123456"
//     });
//     try{
//         userItem.save();
//         res.send("Registered");
//     }catch(e){
//         console.log(e);
//         res.send("Failed");
//     }
//     res.send("Failed");
//     });



router.post("/register",async (req,res) => {
    await bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password: hash
        });
        try{
            newUser.save(function(err){
                if(err) {
                    console.log(err);
                    console.log("Error while registering");
                    res.status(404).json("Oops!!");
                }else{
                    console.log("Registered successfully");
                    res.status(200).json("Done");
                }
            })
        }catch(err){
            console.log(err);
        }
    });
});


router.post("/login", function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    if(!email){
        res.status(404).json("Enter the email");
    }

    User.findOne({email: email}, function(err,results){
        if(err){
            console.log("Erorr while logging in");
        }else{
            if(results){
                bcrypt.compare(password, results.password).then(function(isValid) {
                    if(isValid === true){
                        res.status(200).json(results);
                    }
                    else{
                        res.status(404).json("Wrong password, Try again");
                    }
                });
            }
        }
    });

});


module.exports = router




