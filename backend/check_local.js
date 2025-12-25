const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

const LOCAL_URI = 'mongodb://localhost:27017/recipe_portal';

async function checkLocal() {
    try {
        console.log('Connecting to local MongoDB...');
        await mongoose.connect(LOCAL_URI);

        const count = await Recipe.countDocuments();
        console.log(`\n📊 Total recipes in LOCAL database: ${count}`);

        if (count > 0) {
            const sample = await Recipe.findOne();
            console.log('\nSample recipe:', sample.title);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error connecting to local MongoDB:');
        console.error('Make sure MongoDB is running locally!');
        console.error(error.message);
        process.exit(1);
    }
}

checkLocal();
