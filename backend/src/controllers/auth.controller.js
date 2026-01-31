import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user.model.js";

export const signup=async(req, res)=>{
    const {name,email,password}=req.body;
    const hash = await bcrypt.hash(password,10);
      await createUser(name,email,hash);
  res.status(201).json({message:"User created"});
}


export const login=async(req, res)=>{
const user=await findUserByEmail(req.body.email);
const isPasswordValid=await bcrypt.compare(req.body.password,user.password);
if(!isPasswordValid){
    return res.status(401).json({message:"Invalid credentials"});   }
    const token=jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:"2h"});
    res.status(200).json({token});
}
