import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    quizId: String,
    questionsText: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    topic: String,
    points: Number, 
    tags: [String]
});


export default mongoose.model('Question', questionSchema);

