import mongoose from "mongoose";
import { ObjectId } from "mongoose.Schema.Types";

const questionSchema = new mongoose.Schema({
    quizId: ObjectId,
    questionsText: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    topic: String,
    points: Number,
    tags: [String]
});


export default mongoose.model('Question', questionSchema);

