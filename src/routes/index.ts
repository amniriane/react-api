import express from 'express';
import { UserController } from '../controllers/User.controller';

const route = express();

route.post('/register', UserController.register);
route.post('/login', UserController.login);
route.get('/users', UserController.getAllUsers);
route.get('/user', UserController.getOneUser);
route.put('/user', UserController.takeShot);
route.put('/user/bottle', UserController.newBottle);

export { route as routerIndex };
