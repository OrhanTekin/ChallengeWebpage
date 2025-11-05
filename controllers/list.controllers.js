import mongoose from "mongoose";
import List from "../models/list.model.js";
import { io } from '../app.js';


//Show all challenge lists
export const showLists = async (req, res, next) => {
    try {
        const now = new Date();
        
        //Update any expired lists
        await List.updateMany(
            {
                status: "Ongoing",
                endDate: { $lt: now }
            },
            { $set: { status: "Failed" } }
        );

        //Fetch updated lists
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

//Find a list by id
export const showListById = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const list = await List.findOne({_id});

        if (!list) {
            const error = new Error(`List with id ${_id} not found`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "GET challenge list",
            data: {
                list: list
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
        const {number, name, status, startDate, endDate} = req.body;

        //Check if game already exists
        const listExists = await List.findOne({name});

        if(listExists){
            const error = new Error("List already exists");
            error.statusCode = 409;
            throw error;
        }

        //Actual creation
        const newLists = await List.create([{number, name, status, startDate, endDate}], {session});  //newGames[0]: weil man mehrere gleichzeitig erstellen kann
        
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


export const updateList = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //Update a list
        const {status} = req.body;
        const { _id } = req.params;

        const updateList = await List.findOneAndUpdate(
            {_id},
            {status}, 
            { 
                new: true,        // return updated document
                runValidators: true // validate against schema
            }
        )

        //Check if game exists
        if (!updateList) {
            const error = new Error("Game not found");
            error.statusCode = 409;
            throw error;
        }
    
        
        await session.commitTransaction();
        session.endSession();

        // Notify all clients
        io.emit("refreshLists");
        res.status(201).json({
            success: true,
            message: "List updated successfully",
            data: {
                game: updateList
            }
        });
        

    } catch (error) {
        console.error('Error occurred while updating list:', error);
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