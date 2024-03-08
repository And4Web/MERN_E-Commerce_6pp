import { NextFunction, Request, Response } from "express";
import User from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";

async function newUser(
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) {
  try {    
    const { name, email, photo, gender, _id, dob } = req.body;
    const user = await User.create({
      name,
      email,
      photo,
      gender,      
      _id,
      dob: new Date(dob),
    });

    return res
      .status(201)
      .json({ success: true,  message: `Welcome, ${user.name}`});
  } catch (error) {
    console.log("error creating new User: ", error)
    return res
      .status(400)
      .json({ success: false,  message: `Error >>> ${error}`});
  }
}

export default newUser;
