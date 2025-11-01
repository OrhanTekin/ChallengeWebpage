import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    listId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'List', 
        required: true 
    },
    name: {
        type: String,
        required: [true, "Game Name is required"],
        trim: true,
        minLength : 1,
        maxLength : 50,
        index: true
    },
    gifLink: {
        type: String,
        trim: true,
        maxLength : 500,
    },
    finished: {
        type: Boolean,
        required: true,
        default: false
    },
    currentStreak: {
        type: Number,
        required: true,
        default: 0
    },
    neededWins: {
        type: Number,
        required: true,
        validate: {
            validator: function(v){
                return v > 0;
            }
        }
    },
    failCount:{
        type:Number,
        required: true,
        default: 0,     
    },
    tries: [
        {
            attempt: {
                type: Number,
                required: true
            },
            streak: {
                type: Number,
                required: true,
            },
            result: {
                type: String,
                enum: ["Completed", "Failed"],
                required: true
            },
            failureReason: {
                type: String,
                trim: true,
                minLength : 1,
                maxLength : 50,
            }
        }
    ]

}, {timestamps: true});

gameSchema.index({ listId: 1, name: 1 }, { unique: true });

const Game = mongoose.model("Game", gameSchema);

export default Game;