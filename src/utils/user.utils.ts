import jsonwebtoken from 'jsonwebtoken';
import { UserI } from '../intefaces/User.interface';
import { config } from 'dotenv';
import { User } from '../models/User.model';
import mongoose from 'mongoose';

config();

const JwtKey: string = process.env.JWT_KEY as string;

export const newToken = async (user: UserI): Promise<UserI> => {
    user.token = jsonwebtoken.sign({_id: user._id}, JwtKey, {expiresIn: '1h'});
    await User.updateOne({ _id: mongoose.Types.ObjectId(user._id)}, {$set: {token: user.token}});
    return(user);
};
