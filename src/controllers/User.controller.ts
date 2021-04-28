import { Request, Response } from 'express';
import { UserI } from '../intefaces/User.interface';
import { User } from '../models/User.model';
import { Notification } from '../models/Notification.model';
import { newToken } from '../utils/user.utils';
import mongoose from 'mongoose';
import { NotificationI } from '../intefaces/Notification.interface';

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

    static takeShot = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserI = request.user;

            const { drink } = req.body;

            if (drink === undefined) {
                throw new Error('Missing important fields!');
            }

            if (user.drink?.date) {
                const timeBetweenLastDrink = (Date.now() - user.drink?.date) / 1000;
                if (timeBetweenLastDrink < 600) {
                    throw new Error('You cannot drink for moment. Wait fiew minutes');
                }
            }

            if (drink === true) {
                const toUpdate = {
                    canReceived: false,
                    canSend: true,
                    drinked: true,
                    date: Date.now()
                };
                user.drink = toUpdate;
                user.shotNumber -= 1;

                await User.updateOne({ _id: mongoose.Types.ObjectId(user._id)}, {$set: { drink: toUpdate, shotNumber: user.shotNumber }});

                await Notification.updateMany({ targetId: mongoose.Types.ObjectId(user._id) }, { $set: { seen: true } }) ;

                res.status(200).send({ error: false, message: (user.shotNumber > 0) ? 'Yeaahhh you are not a pussy' : 'Yeaahhh you are not a pussy, be careful you need to buy a bottle', user: user});
            } else {
                const toUpdate = {
                    canReceived: false,
                    canSend: false,
                    drinked: false,
                    date: Date.now()
                };
                user.drink = toUpdate;

                await User.updateOne({ _id: mongoose.Types.ObjectId(user._id)}, {$set: { drink: toUpdate }});

                await Notification.updateMany({ targetId: mongoose.Types.ObjectId(user._id)}, {$set: { seen: true } });

                res.status(200).send({ error: false, message: 'You are a pussy', user: await User.findOne({ _id: mongoose.Types.ObjectId(user._id) }, {  password: 0, token: 0, __v: 0 }) });
            }
        } catch (error) {
            res.status(400).send({ error: true, message: error.message, err: error });
        }
    }

    static sendShot = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserI = request.user;

            const { targetId } = req.body;

            if (!targetId) {
                throw new Error('Missing important fields!');
            }

            const target: UserI = await User.findOne({ _id: mongoose.Types.ObjectId(targetId) });
            if (!target){
                throw new Error('Target id doesn\'t exist');
            }

            if (user.drink && !user.drink.canSend) {
                const timeBetweenLastDrink = (Date.now() - user.drink.date) / 1000;
                if (timeBetweenLastDrink < 600) {
                    throw new Error('You cannot send shot for moment. Wait fiew minutes.');
                }
            }

            if (target.drink && target.drink.date) {
                const timeBetweenLastDrink = (Date.now() - target.drink.date) / 1000;
                if (timeBetweenLastDrink < 600) {
                    throw new Error(target.name + ' cannot drink for moment. Wait fiew minutes');
                }
            }

            await Notification.create({title: user.name + ' send a shot !', message: 'So, do you want to take my drink ?', senderId: user._id, targetId: target._id, seen: false  });

            res.status(200).send({ error: false, message: 'Your drink as been send'});
        } catch (error) {
            res.status(400).send({ error: true, message: error.message, err: error });
        }
    }

    static newBottle = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserI = request.user;

            await User.updateOne({ _id: mongoose.Types.ObjectId(user._id)}, {$set: { shotNulber: 17 }});

            res.status(200).send({ error: false, message: 'A new bottle was purchased !', user: await User.findOne({ _id: mongoose.Types.ObjectId(user._id) }, {  password: 0, token: 0, __v: 0 }) });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message, err: error });
        }
    }

    static getAllNotifications = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserI = request.user;

            const allNotifications: NotificationI[]  = await Notification.find({ targetId: user._id }, { __v: 0 });

            res.status(200).send({ error: false, message: 'Successfull notifications acquisition', notifications: allNotifications});
        } catch (error) {
            res.status(400).send({ error: true, message: error.message, err: error });
        }
    }
}
