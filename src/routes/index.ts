import express from 'express';
import { UserController } from '../controllers/User.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const route = express();

route.post('/register', UserController.register);
route.post('/login', UserController.login);
route.get('/users', authMiddleware, UserController.getAllUsers);
route.post('/user/takeshot', authMiddleware, UserController.takeShot);
route.post('/user/sendshot', authMiddleware, UserController.sendShot);
route.put('/user/bottle', authMiddleware, UserController.newBottle);
route.get('/user/notifications', authMiddleware, UserController.getAllNotifications);

export { route as routerIndex };
