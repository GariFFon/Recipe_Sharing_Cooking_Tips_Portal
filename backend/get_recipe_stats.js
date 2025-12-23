require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipe_portal';

const recipeSchema = new mongoose.Schema({
    cuisine: String,
    strArea: String
});

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);

async function getStats() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const cuisines = await Recipe.distinct('cuisine');
        const areas = await Recipe.distinct('strArea');
        const totalRecipes = await Recipe.countDocuments();

        console.log('\n--- Recipe Statistics ---');
        console.log(`Total Recipes: ${totalRecipes}`);
        console.log(`Number of Cuisines: ${cuisines.length}`);
        console.log(`Cuisines: ${cuisines.sort().join(', ')}`);

        // strArea often represents countries/regions
        const validAreas = areas.filter(a => a && a !== 'Unknown' && a !== 'Global');
        console.log(`Number of Countries/Regions (strArea): ${validAreas.length}`);
        console.log(`Countries/Regions: ${validAreas.sort().join(', ')}`);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

getStats();
