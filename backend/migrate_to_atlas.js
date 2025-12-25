const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

// Local MongoDB URI
const LOCAL_URI = 'mongodb://localhost:27017/recipe_portal';

// Atlas URI (from your .env)
const ATLAS_URI = 'mongodb+srv://yashpatil23_db_user:I1YANW72HGwDjbRB@recipesharing.liffncd.mongodb.net/recipe_portal?retryWrites=true&w=majority&appName=RecipeSharing';

async function migrateData() {
    try {
        console.log('Connecting to local MongoDB...');
        await mongoose.connect(LOCAL_URI);

        console.log('Fetching all recipes from local database...');
        const recipes = await Recipe.find({}).lean();
        console.log(`Found ${recipes.length} recipes in local database`);

        if (recipes.length === 0) {
            console.log('No recipes found in local database!');
            process.exit(0);
        }

        // Disconnect from local
        await mongoose.disconnect();

        console.log('\nConnecting to MongoDB Atlas...');
        await mongoose.connect(ATLAS_URI);

        console.log('Clearing existing data in Atlas...');
        await Recipe.deleteMany({});

        console.log('Importing recipes to Atlas...');
        await Recipe.insertMany(recipes);

        console.log(`\n✅ Successfully migrated ${recipes.length} recipes to MongoDB Atlas!`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateData();
