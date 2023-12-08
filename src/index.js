const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("login");
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});

app.get("/resetpasswordpage",(req,res)=>{
    res.render("resetpasswordpage");
});

// sign up 
app.post("/", async (req,res)=>{

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const data = {
        email: req.body.email,
        name: req.body.username,
        password: hashedPassword
    }
    //first check user exist or not
    const existusr = await collection.findOne({email: data.email});
    // console.log(existusr);
    if(existusr){
        return res.send("User already exist with this email");
    }else{
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.redirect("/signup");
    }
    
});

// login
app.post("/signup",async (req,res)=>{
    try{
        const check = await collection.findOne({email: req.body.email});
        if(!check){
            res.send("User not found please signup");
        }
        //compare password
        // console.log(check.password);
        const passwordcheck = await bcrypt.compare(req.body.password, check.password);
        // console.log(passwordcheck);
        if(passwordcheck){
            return res.render("home");
        
        }else{
            return res.send("incorrect password");
        }
    }
    catch(error){
        console.log(error);
        return res.send("Wrong details");
    }

});

//reset password

app.post("/changepassword", async (req,res)=>{
    // console.log(req.body);
    try{
        if(req.body.newPassword !== req.body.confirmPassword){
            res.send("password didn't match");
        }

        console.log(req.body.newPassword);
        const user = await collection.findOne({email: req.body.email});
        if (!user) {
            return res.send("User not found");
        }
        console.log(user.password);
        user.password = await bcrypt.hash(req.body.newPassword,10);
        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log(user.password);

        await user.save();
        return res.status(200).send('Password updated successfully');
    
    }
    catch(err){
        console.log(err);
        return res.send("something went wrong");
    }
    
});

app.listen(3000,()=>{
    console.log("Server running at port 3000")
});