import mongoose from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { config } from 'dotenv';
import { User } from '../models/User.model';

config();

const JwtKey: string = process.env.JWT_KEY as string;

const middleware = express();

middleware.use(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '') as string;
            if (!token) throw new Error('Not authorized to access to this resource');

            // Vérification du token et des informations contenue à l'intérieur
            const data: any = jsonwebtoken.verify(token, JwtKey);
            if (!data && !data._id) throw new Error('Not authorized to access to this resource');

            // Récupération de l'utilisateur pour le mettre dans le req et y avoir dans les routes après
            const user = await User.findOne({ _id: mongoose.Types.ObjectId(data._id), token: token });
            if (!user) throw new Error('Not authorized to access to this resource');
            Object.assign(req, { user });

            // Si tout se passe bien suite de la requête
            next();
        } catch (error) {
            res.status(400).send({ error: true, message: error.message, err: error });
        }
    }
);

export { middleware as authMiddleware };
