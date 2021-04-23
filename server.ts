import { config } from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { routerIndex } from './src/routes';
import { connect } from './src/db/db';

config();

connect();

const port = 8000;

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    if (error !== null) {
        return response.status(400).json({ success: false, message: 'Invalid json' });
    }
    return next();
});

app.use(routerIndex);

app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});

