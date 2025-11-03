import { Router } from 'express';
import { showLists, showListById, addList, updateList, deleteList } from '../controllers/list.controllers.js';

const listRouter = Router();

listRouter.get('/', showLists);
listRouter.get('/:_id', showListById);
listRouter.post('/add-list', addList);
listRouter.post('/update-list/:_id', updateList);
listRouter.post('/delete-list', deleteList);

export default listRouter;