import { Request, Response } from 'express';
import { UserI } from '../intefaces/User.interface';
import { User } from '../models/User.model';
import { newToken } from '../utils/user.utils';

export class UserController {
    static register = async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                throw new Error('Missing important fields!');
            }
            const user = await User.findOne({ email: email });
            if (user) {
                throw new Error('Email already used');
            }
            const newUser: UserI = await User.create(req.body);
            res.status(201).send({ error: false, message: 'User created', user: { _id: newUser._id, email: newUser.email } });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message, err: error });
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error('Missing important fields!');
            }
            let user: UserI = await User.findOne({ email: email, password: password });
            if (!user) {
                throw new Error('Please provide a valid email and password.');
            }
            user = await newToken(user);
            res.status(200).send({ error: false, message: 'User connected', user: { _id: user._id, email: user.email, token: user.token, drink: user.drink, shotNumber: user.shotNumber } });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message, err: error });
        }
    }
    static getAllUsers = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserI = request.user;
            const allUsers: UserI[]  = await User.find({ _id: { $ne:  user._id } }, {  password: 0, token: 0, __v: 0 });
            res.status(200).send({ error: false, message: 'Success users acquisition', users: allUsers});
        } catch (error) {
            res.status(400).send({ error: true, message: error.message, err: error });
        }
    }

    static takeShot = (req: Request, res: Response) => {
        try {
        } catch (error) {
        }
    }

    static sendShot = (req: Request, res: Response) => {
        try {
        } catch (error) {
        }
    }

    static newBottle = (req: Request, res: Response) => {
        try {
        } catch (error) {
        }
    }
}
