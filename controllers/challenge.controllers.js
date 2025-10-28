import mongoose from "mongoose";
import Game from "../models/game.model.js";
import { io } from '../app.js';

//Show the list of all games
export const showList = async (req, res, next) => {
    try {
        const gameList = await Game.find();
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
        //Create a game
        const {name, finished} = req.body;

        //Check if game already exists
        const gameExists = await Game.findOne({name});

        if(gameExists){
            const error = new Error("Game already exists");
            error.statusCode = 409;
            throw error;
        }

        //Actual creation
        const newGames = await Game.create([{name, finished}], {session});  //newGames[0]: weil man mehrere gleichzeitig erstellen kann
        
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
        const {name, finished} = req.body;

        const updatedGame = await Game.findOneAndUpdate(
            {name}, //Find game with name (unique)
            {name, finished}, 
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
// TODO -> bugged
export const deleteGame = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //Delete a game
        const { _id } = req.body;

        const deletedGame = await Game.findOneAndDelete({ _id });

        if(!deletedGame){
            const error = new Error("Couldn't delete. Game does not exist");
            error.statusCode = 409;
            throw error;
        }
    
        await session.commitTransaction();
        session.endSession();
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