const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
require('dotenv').config();

async function countRecipes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Recipe.countDocuments();
        console.log(`\n📊 Total recipes in MongoDB Atlas: ${count}`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

countRecipes();
