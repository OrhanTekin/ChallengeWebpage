import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Game Name is required"],
        trim: true,
        unique: true,
        minLength : 1,
        maxLength : 50,
        index: true
    },
    finished: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true});

const Game = mongoose.model("Game", gameSchema);

export default Game;



//{"success":true,"message":"Game created successfully","data":{"game":{"name":"League Of Legends","finished":true,"_id":"68fd27a931a8549037b822c8","createdAt":"2025-10-25T19:40:25.520Z","updatedAt":"2025-10-25T19:40:25.520Z","__v":0}}}