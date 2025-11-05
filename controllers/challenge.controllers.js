import mongoose from "mongoose";
import Game from "../models/game.model.js";
import { io } from '../app.js';

//Show the list of all games
export const showList = async (req, res, next) => {
    try {
        const { listId } = req.params;
        const gameList = await Game.find({listId}).sort({ createdAt: 1 }); //sort by createdAt so that new games are at the bottom
        res.status(200).json({
            success: true,
            message: "GET game list",
            data: {
                games: gameList
            }
        });
    } catch (error) {
        next(error);
    }
};

//Add a game to the list
export const addGame = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //Create a game in the correct list
        const {name, gifLink, status, neededWins} = req.body;
        const { listId } = req.params;
        //Check if game already exists
        const gameExists = await Game.findOne({name, listId });

        if(gameExists){
            const error = new Error("Game already exists");
            error.statusCode = 409;
            throw error;
        }

        //Actual creation
        const newGames = await Game.create([{name, gifLink, status, neededWins, listId}], {session});  //newGames[0]: weil man mehrere gleichzeitig erstellen kann
        
        await session.commitTransaction();
        session.endSession();

        // Notify all clients
        io.emit("refreshGames");

        res.status(201).json({
            success: true,
            message: "Game created successfully",
            data: {
                game: newGames[0] 
            }
        });
        

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

//Update a game from the list
export const updateGame = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //Update a game
        const {_id, name, gifLink, status, currentStreak, failCount, tries} = req.body;
        const { listId } = req.params;

        const updatedGame = await Game.findOneAndUpdate(
            {_id, listId}, //Find game with name (unique)
            {_id, name, gifLink, status, currentStreak, failCount, tries, listId}, 
            { 
                new: true,        // return updated document
                runValidators: true // validate against schema
            }
        )

        //Check if game exists
        if (!updatedGame) {
            const error = new Error("Game not found");
            error.statusCode = 409;
            throw error;
        }
    
        
        await session.commitTransaction();
        session.endSession();

        // Notify all clients
        io.emit("refreshGames");
        res.status(201).json({
            success: true,
            message: "Game updated successfully",
            data: {
                game: updatedGame
            }
        });
        

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

//Delete a game from the list 
export const deleteGame = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //Delete a game
        const { _id } = req.body;
        const { listId } = req.params;

        const deletedGame = await Game.findOneAndDelete({ _id, listId});

        if(!deletedGame){
            const error = new Error("Couldn't delete. Game does not exist");
            error.statusCode = 409;
            throw error;
        }
    
        await session.commitTransaction();
        session.endSession();
        // Notify all clients
        io.emit("refreshGames");
        res.status(201).json({
            success: true,
            message: "Game deleted successfully",
            data: {
                game: deletedGame
            }
        });
        

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        next(error);
    }
};


//Deletes all games with a certain list id
export const deleteGamesOfListId = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //Delete a game
        const { listId } = req.params;

        const deletedGames = await Game.deleteMany({listId});
    
        await session.commitTransaction();
        session.endSession();
        // Notify all clients
        io.emit("refreshGames");
        res.status(201).json({
            success: true,
            message: `Deleted ${deletedGames.deletedCount} game(s) successfully.`,
            data: {
                game: deletedGames
            }
        });
        

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        next(error);
    }
};