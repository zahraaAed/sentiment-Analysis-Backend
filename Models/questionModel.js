import mongoose from 'mongoose';
import { model } from "mongoose";
const questionSchema = new mongoose.Schema({
 userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
 },
 question: {
    type: String,
    required: true,
 },
 answer: {
   type: String, 
   required: false, 
 },
answered: {
   type: Boolean,
   default: false,
},
}, { timestamps: true });

const Question = model('Question', questionSchema);

export default Question;