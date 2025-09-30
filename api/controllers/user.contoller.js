import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

// update user

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update your own account!'));
    }
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateData = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePicture: req.body.profilePicture,
        };

               // Handle checklist progress updates
               if (req.body.checklistProgress) {
                   updateData.checklistProgress = req.body.checklistProgress;
               }

               // Handle CyberPatriot progress updates
               if (req.body.cyberPatriotProgress) {
                   updateData.cyberPatriotProgress = req.body.cyberPatriotProgress;
               }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error);
    }
}

// delete user

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your own account!'))
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted...');
    } catch (error) {
        next(error);
    }
}