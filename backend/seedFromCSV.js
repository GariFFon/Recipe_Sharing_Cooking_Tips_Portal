require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Recipe = require('./models/Recipe');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipe_portal';
const CSV_FILE_PATH = './Cleaned_Indian_Food_Dataset.csv';

// Helper function to parse ingredients from CSV format
function parseIngredients(ingredientsString) {
  if (!ingredientsString) return [];
  
  // Split by comma and clean up each ingredient
  return ingredientsString
    .split(',')
    .map(ing => ing.trim())
    .filter(ing => ing.length > 0);
}

// Helper function to parse instructions from CSV format
function parseInstructions(instructionsString) {
  if (!instructionsString) return [];
  
  // Split by periods or newlines and clean up
  return instructionsString
    .split(/\.\s+|\n+/)
    .map(inst => inst.trim())
    .filter(inst => inst.length > 10) // Filter out very short fragments
    .map(inst => inst.endsWith('.') ? inst : inst + '.');
}

// Helper function to estimate prep and cook time from total time
function estimateTimes(totalTimeInMins) {
  const total = parseInt(totalTimeInMins) || 30;
  
  // Assume prep is about 1/3 of total time, cook is 2/3
  const prepTime = Math.round(total * 0.3);
  const cookTime = Math.round(total * 0.7);
  
  return {
    prepTime: `${prepTime} mins`,
    cookTime: `${cookTime} mins`
  };
}

// Helper function to get default image if URL is missing or invalid
function getImageUrl(imageUrl) {
  if (imageUrl && imageUrl.startsWith('http')) {
    return imageUrl;
  }
  // Default food image from Unsplash
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
}

// Function to convert CSV row to Recipe document
function csvRowToRecipe(row) {
  const { prepTime, cookTime } = estimateTimes(row.TotalTimeInMins);
  const ingredients = parseIngredients(row.TranslatedIngredients || row['Cleaned-Ingredients']);
  const instructions = parseInstructions(row.TranslatedInstructions);
  
  // Extract a description from first instruction or use a default
  let description = '';
  if (instructions.length > 0) {
    description = instructions[0].substring(0, 150);
    if (instructions[0].length > 150) {
      description += '...';
    }
  } else {
    description = `A delicious ${row.Cuisine || 'traditional'} recipe featuring ${ingredients.slice(0, 3).join(', ')}.`;
  }
  
  return {
    title: row.TranslatedRecipeName || 'Untitled Recipe',
    image: getImageUrl(row['image-url']),
    description: description,
    ingredients: ingredients,
    instructions: instructions,
    tips: `Total time: ${row.TotalTimeInMins || 30} minutes. Ingredient count: ${row['Ingredient-count'] || ingredients.length}`,
    prepTime: prepTime,
    cookTime: cookTime,
    servings: '4',
    difficulty: parseInt(row.TotalTimeInMins) > 60 ? 'Hard' : parseInt(row.TotalTimeInMins) > 30 ? 'Medium' : 'Easy',
    cuisine: row.Cuisine || 'Global',
    dietaryType: 'Veg', // Default to Veg for Indian food dataset, can be updated later
    source: 'manual',
    strSource: row.URL || '',
    userName: 'Recipe Database',
    createdAt: new Date()
  };
}

// Main seeding function
async function seedRecipesFromCSV() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Optional: Clear existing recipes (uncomment if you want to start fresh)
    // console.log('🗑️  Clearing existing recipes...');
    // await Recipe.deleteMany({});
    // console.log('✅ Existing recipes cleared!');
    
    const recipes = [];
    let rowCount = 0;
    let errorCount = 0;
    
    console.log('📖 Reading CSV file...');
    
    // Read and parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (row) => {
          try {
            rowCount++;
            const recipe = csvRowToRecipe(row);
            
            // Basic validation
            if (recipe.title && recipe.ingredients.length > 0) {
              recipes.push(recipe);
            } else {
              errorCount++;
              console.log(`⚠️  Skipping row ${rowCount}: Missing required fields`);
            }
            
            // Log progress every 100 rows
            if (rowCount % 100 === 0) {
              console.log(`📊 Processed ${rowCount} rows, ${recipes.length} valid recipes...`);
            }
          } catch (error) {
            errorCount++;
            console.error(`❌ Error processing row ${rowCount}:`, error.message);
          }
        })
        .on('end', () => {
          console.log(`✅ CSV file reading completed!`);
          console.log(`📊 Total rows: ${rowCount}`);
          console.log(`✅ Valid recipes: ${recipes.length}`);
          console.log(`⚠️  Errors/Skipped: ${errorCount}`);
          resolve();
        })
        .on('error', reject);
    });
    
    if (recipes.length === 0) {
      console.log('❌ No valid recipes found to insert!');
      return;
    }
    
    console.log('\n💾 Inserting recipes into database...');
    console.log('⏳ This may take a few moments...\n');
    
    // Insert recipes in batches to avoid memory issues
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < recipes.length; i += batchSize) {
      const batch = recipes.slice(i, i + batchSize);
      try {
        await Recipe.insertMany(batch, { ordered: false });
        insertedCount += batch.length;
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${insertedCount}/${recipes.length} recipes`);
      } catch (error) {
        // Some recipes might fail due to duplicates or validation
        if (error.writeErrors) {
          const successCount = batch.length - error.writeErrors.length;
          insertedCount += successCount;
          console.log(`⚠️  Batch ${Math.floor(i / batchSize) + 1}: ${successCount} inserted, ${error.writeErrors.length} failed`);
        } else {
          console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Database seeding completed!');
    console.log(`✅ Successfully inserted ${insertedCount} recipes`);
    
    // Display some statistics
    const totalRecipes = await Recipe.countDocuments();
    console.log(`\n📊 Database Statistics:`);
    console.log(`   Total recipes in database: ${totalRecipes}`);
    
    const cuisines = await Recipe.aggregate([
      { $group: { _id: '$cuisine', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log(`\n🍽️  Recipes by Cuisine:`);
    cuisines.forEach(c => {
      console.log(`   ${c._id}: ${c.count}`);
    });
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding function
console.log('🌱 Starting CSV Recipe Seeding Process...\n');
seedRecipesFromCSV();
