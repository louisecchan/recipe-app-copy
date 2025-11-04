import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.js";

const router = express.Router();

router.get("/", cacheMiddleware(3 * 60 * 1000), async (req, res) => {
  // Get all the recipes of the database with pagination (cached for 3 minutes)
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Use lean() for faster queries by returning plain JavaScript objects
    // Select only necessary fields to reduce data transfer
    const result = await RecipesModel.find({})
      .select('name ingredients instructions imageUrl cookingTime userOwner')
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    const total = await RecipesModel.countDocuments({});

    console.log(`Recipes found: ${result.length} of ${total}`);
    res.status(200).json({
      recipes: result,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecipes: total
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json(err);
  }
});

// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });
  console.log("New recipe:", recipe);

  try {
    const result = await recipe.save();
    console.log("Recipe saved:", result);
    
    // Clear cache when new recipe is created
    clearCache('/recipes');
    
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json(err);
  }
});

// Get a recipe by ID (cached for 5 minutes)
router.get("/:recipeId", cacheMiddleware(5 * 60 * 1000), async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId)
      .select('name ingredients instructions imageUrl cookingTime userOwner')
      .lean();
    console.log("🔍 Recipe Found:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error finding recipe:", err);
    res.status(500).json(err);
  }
});

// Save a Recipe
router.put("/", async (req, res) => {
  try {
    // Check if recipe exists
    const recipe = await RecipesModel.findById(req.body.recipeID).select('_id').lean();
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Get user and update in one query
    const user = await UserModel.findById(req.body.userID).select('savedRecipes');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("📚 Recipe to save:", recipe);
    console.log("👤 User saving recipe:", user);

    // Check if recipe is already saved
    if (user.savedRecipes.includes(req.body.recipeID)) {
      return res.status(200).json({ 
        savedRecipes: user.savedRecipes,
        message: "Recipe already saved" 
      });
    }

    user.savedRecipes.push(req.body.recipeID); // adding to saved recipes
    await user.save(); // save changes to user collection
    
    // Clear saved recipes cache for this user
    clearCache(`/savedRecipes/${req.body.userID}`);
    clearCache(`/savedRecipes/ids/${req.body.userID}`);
    
    console.log("✅ Recipe saved to user:", user.savedRecipes);
    res.status(201).json({ savedRecipes: user.savedRecipes }); // return back saved recipes
  } catch (err) {
    console.error("❌ Error saving recipe to user:", err);
    res.status(500).json(err);
  }
});

// Get id of saved recipes (cached for 2 minutes)
router.get("/savedRecipes/ids/:userId", cacheMiddleware(2 * 60 * 1000), async (req, res) => {
  // getting ID from saved recipes
  try {
    const user = await UserModel.findById(req.params.userId)
      .select('savedRecipes')
      .lean();
    console.log("📋 User's saved recipe IDs:", user?.savedRecipes);
    res.status(200).json({ savedRecipes: user?.savedRecipes || [] });
  } catch (err) {
    console.error("❌ Error fetching saved recipe IDs:", err);
    res.status(500).json(err);
  }
});

// Get saved recipes (cached for 2 minutes)
router.get("/savedRecipes/:userId", cacheMiddleware(2 * 60 * 1000), async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId)
      .select('savedRecipes')
      .lean();
    
    if (!user || !user.savedRecipes || user.savedRecipes.length === 0) {
      return res.status(200).json({ savedRecipes: [] });
    }

    // Use lean() and field selection for better performance
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    })
      .select('name ingredients instructions imageUrl cookingTime userOwner')
      .lean();
    
    console.log("📚 User's saved recipes:", savedRecipes);
    res.status(200).json({ savedRecipes });
  } catch (err) {
    console.error("❌ Error fetching saved recipes:", err);
    res.status(500).json(err);
  }
});

export { router as recipesRouter };
