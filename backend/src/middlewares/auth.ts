import User from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";


// middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async(req, res, next)=>{
  const {id} = req.query;
  const user = await User.findById(id);

  if(!id || !user || user.role !== "admin"){
    return next(new ErrorHandler("Unauthorized", 401))
  }
  
  next();
})