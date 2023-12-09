const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://0.0.0.0:27017/test1");
// mongodb://localhost:27017
// mongodb://localhost:27017

connect.then(()=>{
    console.log("connectio sucessful");
})
.catch((error)=>{
    console.log("Error in connection");
    console.log(error);
});

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

//model
const collection =new mongoose.model("users",LoginSchema);
module.exports = collection;
