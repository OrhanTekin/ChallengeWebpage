import { Router } from 'express';
import { showList, addGame, updateGame, deleteGame, deleteGamesOfListId} from '../controllers/challenge.controllers.js';

const challengeRouter = Router();

challengeRouter.get('/:listId', showList);
challengeRouter.post('/add-game/:listId', addGame);
challengeRouter.post('/update-game/:listId', updateGame);
challengeRouter.post('/delete-game/:listId', deleteGame);
challengeRouter.post('/delete-games/:listId', deleteGamesOfListId);

export default challengeRouter;