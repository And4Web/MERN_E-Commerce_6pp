import User from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
// Route - /api/v1/user/new
// function - create new user
export const newUser = TryCatch(async function (req, res, next) {
    const { name, email, photo, gender, _id, dob } = req.body;
    let user = await User.findById(_id);
    if (user)
        return res
            .status(200)
            .json({ success: true, message: `Welcome, ${user.name}!` });
    if (!_id || !name || !email || !photo || !gender || !dob)
        return next(new ErrorHandler("Please add all fields.", 400));
    user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
    });
    return res
        .status(201)
        .json({ success: true, message: `Welcome, ${user.name}` });
});
// Route - /api/v1/user/all
// function - returns all users
export const getAllUsers = TryCatch(async function (req, res, next) {
    const users = await User.find({}, { createdAt: 0, updatedAt: 0, __v: 0 });
    return res
        .status(200)
        .json({
        success: true,
        message: "All users fetched successfully from the database",
        totalUsers: users.length,
        users,
    });
});
export const getUser = TryCatch(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id }, { createdAt: 0, updatedAt: 0, __v: 0 });
    if (!user) {
        return next(new ErrorHandler("Invalid user id, user not found in database.", 404));
        // return res.status(404).json({success: false, message: "User not found in database."})
    }
    return res.status(200).json({ success: true, message: "User found.", user });
});
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("User Deletion failed, invalid user id.", 404));
    await user.deleteOne();
    return res.status(200).json({ success: true, message: "User deleted successfully." });
});
