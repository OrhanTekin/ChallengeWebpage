import mongoose from "mongoose";
import List from "../models/list.model.js";
import { io } from '../app.js';


//Show all challenge lists
export const showList = async (req, res, next) => {
    try {
        const gameLists = await List.find();
        res.status(200).json({
            success: true,
            message: "GET challenge lists",
            data: {
                lists: gameLists
            }
        });
    } catch (error) {
        next(error);
    }
};


export const addList = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //Create a game
        const {number, name, status, date} = req.body;

        //Check if game already exists
        const listExists = await List.findOne({name});

        if(listExists){
            const error = new Error("List already exists");
            error.statusCode = 409;
            throw error;
        }

        //Actual creation
        const newLists = await List.create([{number, name, status, date}], {session});  //newGames[0]: weil man mehrere gleichzeitig erstellen kann
        
        await session.commitTransaction();
        session.endSession();

        // Notify all clients
        io.emit("refreshLists");

        res.status(201).json({
            success: true,
            message: "List created successfully",
            data: {
                list: newLists[0] 
            }
        });
        

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};


//Delete a list
export const deleteList = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //Delete a game
        const { _id } = req.body;

        const deletedList = await List.findOneAndDelete({ _id });

        if(!deletedList){
            const error = new Error("Couldn't delete. List does not exist");
            error.statusCode = 409;
            throw error;
        }
    
        await session.commitTransaction();
        session.endSession();
        // Notify all clients
        io.emit("refreshLists");
        res.status(201).json({
            success: true,
            message: "Game deleted successfully",
            data: {
                list: deletedList
            }
        });
        

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        next(error);
    }
};