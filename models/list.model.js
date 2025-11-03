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
    startDate:{
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    }

}, {timestamps: true});

const List = mongoose.model("List", listSchema);

export default List;