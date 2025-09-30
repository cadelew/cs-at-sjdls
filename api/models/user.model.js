import { Timestamp } from "bson";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    checklistProgress:{
        type: Map,
        of: Boolean,
        default: {}
    },
    cyberPatriotProgress:{
        type: Map,
        of: Boolean,
        default: {}
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema)

export default User;