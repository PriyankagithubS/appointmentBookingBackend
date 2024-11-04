import express from 'express'
import { registerUser,loginUser,getProfile,updateUserProfile } from "../Controllers/user.Controller.js";
import authUser from '../Middleware/authUser.js';
import upload from '../Middleware/multer.js';



const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.put('/update-profile',upload.single('image'),authUser, updateUserProfile)




export default userRouter