import { Request, Response } from 'express';
import { UserI } from '../intefaces/User.interface';
import { User } from '../models/User.model';

export class UserController {
    static register = async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;
            if ( !name || !email || !password ){
                throw new Error('Missing important fields!');
            }
            const user = await User.findOne({email: email});
            if ( user ){
                throw new Error('Email already used');
            }
            const newUser: UserI = await User.create(req.body);
            res.status(201).send({ error: false, message: 'User created', user: { _id: newUser._id, email: newUser.email } });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message, err: error });
        }
    }

    static login = (req: Request, res: Response) => {
        try {
        } catch (error) {
        }
    }

    /*static updateUser = (req: Request, res: Response) => {
        try {
        } catch (error) {
        }
    }*/

    static getOneUser = (req: Request, res: Response) => {
        try {
        } catch (error) {
        }
    }

    static getAllUsers = (req: Request, res: Response) => {
        try {
        } catch (error) {
        }
    }

    static takeShot = (req: Request, res: Response) => {
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
