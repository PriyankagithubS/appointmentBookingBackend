import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary"
import userModel from "../Models/user.Model.js";
import jwt from "jsonwebtoken";


//register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please enter all fields" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = await userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({ success: true, message: "User registered successfully", token })


    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
//login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Please enter all fields" })
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

            res.json({ success: true, message: "User logged in successfully", token })
           
        }else{
            return res.json({ success: false, message: "Invalid credentials" })
        }

        

    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
//get profile
export const getProfile = async (req, res) => {
    try {
       const {userId}=req.body
       const userData=await userModel.findById(userId).select('-password')

       res.json({success:true,userData})

    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
//update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile=req.file;
        if (!name || !phone ||!address||!dob ||!gender){
            return res.json({ success: false, message: "Please enter all fields" })
        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address:JSON.parse(address), dob, gender })
        if(imageFile){
            //uploading image to cloudinary
            const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageUrl=imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image:image.url })
        }
        res.json({ success: true, message: "User profile updated successfully" })
        const user = await userModel.findByIdAndUpdate(req.params.id, {
            name,
            address,
            gender,
            dob,
            phone
        }, { new: true });

        res.json({ success: true, message: "User profile updated successfully", user })

    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//API for appoinmtnt booking

export const bookAppointment = async (req, res) => {
    try {
        const { userId, slotDate,slotTime } = req.body;

        if (!userId || !slotDate || !slotTime ) {
            return res.json({ success: false, message: "Please enter all fields" })
        }
        const newAppointment = new appointmentModel({
            userId,
            doctorId,
            doctorInfo,
            userInfo,
            date,
            time,
            status
        })
        await newAppointment.save();
        const user = await userModel.findById(userId);
        const notification = user.notification;
        notification.push({
            type: "new-appointment-request",
            message: `A new appointment request from ${user.name}`,
            onClickPath: "/doctor/appointments"
        })
        await user.save();
        res.json({ success: true, message: "Appointment booked successfully" })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}