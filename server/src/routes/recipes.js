import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  // Get all the recipes of the database
  try {
    const result = await RecipesModel.find({});
    console.log("Recipes found:", result);
    res.status(200).json(result);
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

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    console.log("🔍 Recipe Found:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error finding recipe:", err);
    res.status(500).json(err);
  }
});

// Save a Recipe
router.put("/", async (req, res) => {
  const recipe = await RecipesModel.findById(req.body.recipeID); // get recipe ID
  const user = await UserModel.findById(req.body.userID); // get user ID
  console.log("📚 Recipe to save:", recipe);
  console.log("👤 User saving recipe:", user);
  try {
    user.savedRecipes.push(recipe); // adding to saved recipes
    await user.save(); // save changes to user collection
    console.log("✅ Recipe saved to user:", user.savedRecipes);
    res.status(201).json({ savedRecipes: user.savedRecipes }); // return back saved recipes
  } catch (err) {
    console.error("❌ Error saving recipe to user:", err);
    res.status(500).json(err);
  }
});

// Get id of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  // getting ID from saved recipes
  try {
    const user = await UserModel.findById(req.params.userId);
    console.log("📋 User's saved recipe IDs:", user?.savedRecipes);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.error("❌ Error fetching saved recipe IDs:", err);
    res.status(500).json(err);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });
    console.log("📚 User's saved recipes:", savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.error("❌ Error fetching saved recipes:", err);
    res.status(500).json(err);
  }
});

export { router as recipesRouter };
