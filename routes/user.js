import { Router } from 'express';
import { authorizedUser, login, register } from '../controllers/user.js';

const routes = Router();

routes.post('/register', register);
routes.post('/login', login);

routes.get('/verifytoken', authorizedUser);

export default routes;
