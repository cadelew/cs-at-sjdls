import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from './models/quiz.model.js';
import Question from './models/question.model.js';

dotenv.config({ path: './.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

async function cleanupQuizzes() {
    console.log('🧹 Starting Quiz Cleanup...\n');
    
    try {
        // Get all quizzes
        const allQuizzes = await Quiz.find({});
        console.log(`Found ${allQuizzes.length} total quizzes`);
        
        // Separate generated vs manual quizzes
        const generatedQuizzes = allQuizzes.filter(quiz => 
            quiz.generatedBy === 'system' || 
            quiz.generatedBy === 'ai' ||
            quiz.questionIds?.length > 0
        );
        
        const manualQuizzes = allQuizzes.filter(quiz => 
            quiz.generatedBy === 'manual' || 
            (!quiz.generatedBy && !quiz.questionIds?.length)
        );
        
        console.log(`📊 Quiz Breakdown:`);
        console.log(`- Generated quizzes: ${generatedQuizzes.length}`);
        console.log(`- Manual quizzes: ${manualQuizzes.length}`);
        
        // Option 1: Delete all generated quizzes
        console.log('\n🗑️ Deleting all generated quizzes...');
        const deleteResult = await Quiz.deleteMany({
            $or: [
                { generatedBy: 'system' },
                { generatedBy: 'ai' },
                { questionIds: { $exists: true, $ne: [] } }
            ]
        });
        
        console.log(`✅ Deleted ${deleteResult.deletedCount} generated quizzes`);
        
        // Option 2: Keep only the most recent generated quiz of each type
        // Uncomment this section if you want to keep some generated quizzes
        
        /*
        console.log('\n🎯 Keeping only the most recent generated quiz of each type...');
        
        // Group by quiz title pattern
        const quizGroups = {};
        generatedQuizzes.forEach(quiz => {
            const baseTitle = quiz.title.replace(/ - .*$/, ''); // Remove " - Mixed Level" etc
            if (!quizGroups[baseTitle]) {
                quizGroups[baseTitle] = [];
            }
            quizGroups[baseTitle].push(quiz);
        });
        
        // Delete all but the most recent in each group
        for (const [baseTitle, quizzes] of Object.entries(quizGroups)) {
            if (quizzes.length > 1) {
                // Sort by creation date, keep only the most recent
                quizzes.sort((a, b) => new Date(b.createdAt || b.metadata?.generatedAt) - new Date(a.createdAt || a.metadata?.generatedAt));
                const toDelete = quizzes.slice(1); // All except the first (most recent)
                
                const idsToDelete = toDelete.map(q => q._id);
                await Quiz.deleteMany({ _id: { $in: idsToDelete } });
                console.log(`Deleted ${toDelete.length} older quizzes for "${baseTitle}"`);
            }
        }
        */
        
        // Show remaining quizzes
        const remainingQuizzes = await Quiz.find({});
        console.log(`\n📋 Remaining quizzes: ${remainingQuizzes.length}`);
        remainingQuizzes.forEach(quiz => {
            console.log(`- ${quiz.title} (${quiz.totalQuestions} questions, ${quiz.timeLimit} min)`);
        });
        
        console.log('\n🎉 Quiz cleanup completed!');
        
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🔌 Database connection closed.');
    }
}

// Run the cleanup
cleanupQuizzes();

