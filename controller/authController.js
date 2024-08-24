import { hashPassword,comparePassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async(req, res) =>{
try {
    
    const {name, email, password} = req.body;
   if(!name) return res.send({error: 'Name is missing'});
   if(!email) return res.send({error: 'email is missing'});
   if(!password) return res.send({error: 'password is missing'});
   

   const existinguser = await userModel.findOne({email});
   if(existinguser) 
   {
     return res.status(200).send(
        {
            success: true,
            message: 'Already registred user, please login'

        }
     )
   }

   const hashedPassword = await hashPassword(password);
   const user = await new userModel({name, email, password:hashedPassword}).save();
   res.status(201).send({
    success: true,
    message: 'User registered success',
    user
   })
} catch (error) {
    console.log(error);

    res.status(500).send({
        success: false,
        message: 'Error in Regirestration',
        error
    })
}
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) return res.status(404).send({ error: 'email is missing' });
        if (!password) return res.status(404).send({ error: 'Password is missing' });
        //get user
        const user = await userModel.findOne({ email });

        if (!user) return res.status(404).send({ success: false, message: 'Email is not registered' });

        const match = await comparePassword(password, user.password)

        if (!match) return res.status(200).send({ success: false, message: 'User or Passwod is invalid' });
        // token create
        const token = await JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })

        const tokenOption={
            httpOnly:true,
            secure:true
        }

        res.cookie('token',token,tokenOption).status(200).json({
            success: true,
            message: 'login Success',
            data: token
        })
    } catch (error) {
        console.log('error', error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}

export const userDetailsController = async (req, res) => {
    try{
        console.log("userId",req.userId)
        const user = await userModel.findById(req.userId)
        res.status(200).json({
            data : user,
            error : false,
            success : true,
            message : "User details"
        })

        console.log("user",user)
    }catch(error){
        console.log('error', error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}

export const userLogoutController = async (req, res) => {
    try{
        res.clearCookie("token")
        res.json({
            message: "Logged out successfully",
            error:false,
            success: true,
            data: []
        })
    }catch(error){
        console.log('error', error);
        res.status(500).send({
            success: false,
            message: 'Error logging out',
            error
        })
    }
}