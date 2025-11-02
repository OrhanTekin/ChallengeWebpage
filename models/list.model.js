import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: [true, "A list number is required"],
        unique: true
    },
    name: {
        type: String,
        required: [true, "List Name is required"],
        trim: true,
        unique: true,
        minLength : 1,
        maxLength : 30,
        index: true
    },
    status: {
        type: String,
        enum: ["Completed", "Ongoing", "Failed"],
        required: true,
        default: false
    },
    date:{
        type: Date,
        default: Date.now
    }

}, {timestamps: true});

const List = mongoose.model("List", listSchema);

export default List;