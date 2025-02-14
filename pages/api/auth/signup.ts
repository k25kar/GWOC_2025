import dbConnect from "@/lib/dbConnect";
import User from "@/src/models/User";
let bcrypt = require('bcryptjs');
 
const handler = async(req:any,res:any) => {
 if(req.method !== 'POST') {
    return;
 }
 const {name, email, password}:any = req.body;
 if (
    !name ||
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 6
 ){
    res.status(422).json({
        message: 'Validation error'
    });
    return;
 }

 await dbConnect.connect();
 const  existingUser = await User.findOne({email: email})
 if (existingUser) {
    res.status(422).json({message: 'User already exists'});
    await dbConnect.disconnect();
    return;
 }
 const newUser = new User({
    name,
    email,
    password: bcrypt.hashSync(password),
    isAdmin: false
 })
 const user = await newUser.save();
 await dbConnect.disconnect();
 res.status(201).send({
   message: "Created user",
   _id: user._id,
   name: user.username,
   email: user.email,
   isAdmin: user.isAdmin,

 });

}

export default handler;