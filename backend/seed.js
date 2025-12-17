require('dotenv').config();
const mongoose = require('mongoose');

// Schema definition (must match server.js)
const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [String],
    instructions: [String],
    tips: String,
    prepTime: { type: String, default: '15 mins' },
    cookTime: { type: String, default: '30 mins' },
    servings: { type: String, default: '4' },
    difficulty: { type: String, default: 'Medium' },
    createdAt: { type: Date, default: Date.now }
});

const RecipeModel = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipe_portal';

const sampleRecipes = [
    {
        title: "Rustic Roasted Tomato Basil Soup",
        // Reliable image source
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
        description: "A comforting, velvety soup made with vine-ripened roasted tomatoes, fresh basil, and a touch of cream. Perfect for chilly evenings.",
        ingredients: ["3 lbs Roma tomatoes", "1 head garlic", "1/2 cup basil", "1 cup broth", "1/2 cup cream"],
        instructions: ["Roast tomatoes and garlic.", "Blend with basil.", "Simmer with broth and cream."],
        tips: "Serve with grilled cheese.",
        prepTime: "10 mins",
        cookTime: "45 mins",
        servings: "4 bowls",
        difficulty: "Easy"
    },
    {
        title: "Lemon Herb Roasted Chicken",
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80",
        description: "Juicy, tender chicken with crispy skin, infused with zesty lemon and aromatic rosemary.",
        ingredients: ["1 whole chicken", "2 lemons", "Rosemary", "Butter", "Garlic"],
        instructions: ["Preheat oven 425F.", "Season chicken.", "Roast 1h 15m."],
        tips: "Rest for 15 mins before carving.",
        prepTime: "15 mins",
        cookTime: "1 hr 15 mins",
        servings: "5 people",
        difficulty: "Medium"
    },
    {
        title: "Artisan Sourdough Bread",
        image: "https://wildthistlekitchen.com/wp-content/uploads/2025/02/Artisan-Sourdough-Bread-Recipe-1-4.jpg",
        description: "Crusty on the outside, soft and airy on the inside. This no-knead sourdough is worth the wait.",
        ingredients: ["500g bread flour", "350g water", "100g starter", "10g salt"],
        instructions: ["Mix ingredients.", "Fold every 30m.", "Ferment 6h.", "Bake 450F."],
        tips: "Use steam in oven for crust.",
        prepTime: "30 mins",
        cookTime: "45 mins",
        servings: "1 loaf",
        difficulty: "Hard"
    },
    {
        title: "Berry & Fig Glazed Tart",
        // Changed this image as the Mousse one might have been tricky or generic
        image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
        description: "A stunning dessert featuring fresh seasonal berries and a sweet fig glaze atop a buttery crust.",
        ingredients: ["Tart shell", "Custard filling", "Mixed Berries", "Fig jam"],
        instructions: ["Bake tart shell.", "Fill with custard.", "Top with fruit.", "Glaze."],
        tips: "Assemble just before serving to keep crust crisp.",
        prepTime: "40 mins",
        cookTime: "20 mins",
        servings: "8 slices",
        difficulty: "Medium"
    },
    {
        title: "Avocado & Egg Toast",
        image: "https://images.unsplash.com/photo-1525351444148-18fc4a48502d?auto=format&fit=crop&w=800&q=80",
        description: "The quintessential brunch staple. Creamy avocado, perfectly poached egg, and red pepper flakes.",
        ingredients: ["Sourdough slice", "1 Avocado", "1 Egg", "Chili flakes", "Lemon"],
        instructions: ["Toast bread.", "Mash avocado with lemon.", "Poach egg.", "Assemble."],
        tips: "Use fresh free-range eggs for better yolks.",
        prepTime: "5 mins",
        cookTime: "5 mins",
        servings: "1 person",
        difficulty: "Easy"
    }
];

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        console.log('Clearing old recipes...');
        await RecipeModel.deleteMany({});
        console.log('Seeding new recipes...');
        await RecipeModel.insertMany(sampleRecipes);
        console.log('Done!');
        process.exit();
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
