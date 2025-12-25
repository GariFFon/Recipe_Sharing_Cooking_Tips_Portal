const mongoose = require('mongoose');
const User = require('./models/User');

const LOCAL_URI = 'mongodb://localhost:27017/recipe_portal';
const ATLAS_URI = 'mongodb+srv://yashpatil23_db_user:I1YANW72HGwDjbRB@recipesharing.liffncd.mongodb.net/recipe_portal?retryWrites=true&w=majority&appName=RecipeSharing';


async function migrateUsers() {
    try {
        console.log('Connecting to local MongoDB...');
        await mongoose.connect(LOCAL_URI);

        const users = await User.find({}).lean();
        console.log(`Found ${users.length} users in local database`);

        if (users.length === 0) {
            console.log('No users to migrate.');
            process.exit(0);
        }

        await mongoose.disconnect();

        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(ATLAS_URI);

        console.log('Importing users to Atlas...');
        await User.insertMany(users);

        console.log(`✅ Successfully migrated ${users.length} users to Atlas!`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

migrateUsers();
