import { Router } from 'express';
import { showList, addGame, updateGame, deleteGame } from '../controllers/challenge.controllers.js';

const challengeRouter = Router();

challengeRouter.get('/', showList);
challengeRouter.post('/add-game', addGame);
challengeRouter.post('/update-game', updateGame);
challengeRouter.post('/delete-game', deleteGame);

export default challengeRouter;