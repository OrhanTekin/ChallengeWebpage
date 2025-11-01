import { Router } from 'express';
import { showList, addList, deleteList } from '../controllers/list.controllers.js';

const challengeRouter = Router();

challengeRouter.get('/', showList);
challengeRouter.post('/add-list', addList);
challengeRouter.post('/delete-list', deleteList);

export default challengeRouter;