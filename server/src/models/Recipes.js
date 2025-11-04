import mongoose from "mongoose";

const recipeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      type: String,
      required: true,
    },
  ],
  instructions: [
    {
      type: String,
      required: true,
    },
  ],
  imageUrl: {
    type: String,
    required: true,
  },
  cookingTime: {
    type: Number,
    required: true,
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Add indexes for faster queries
recipeSchema.index({ userOwner: 1 }); // Index for filtering by user
recipeSchema.index({ name: 1 }); // Index for searching by name
recipeSchema.index({ cookingTime: 1 }); // Index for filtering by cooking time
recipeSchema.index({ createdAt: -1 }); // Index for sorting by creation date

export const RecipesModel = mongoose.model("Recipes", recipeSchema);
