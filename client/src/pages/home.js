import "./home.css";
import React, { useEffect, useState, useRef } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";

export const Home = () => {
  const [recipes, setRecipes] = useState([]); // keep track of all the recipes existing in database
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "https://server-recipe-app-copy.onrender.com/recipes?limit=100"
        );
        // Handle both old and new response formats
        const recipesData = response.data.recipes || response.data;
        setRecipes(recipesData);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://server-recipe-app-copy.onrender.com/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();

    if (cookies.access_token) fetchSavedRecipes();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        "https://server-recipe-app-copy.onrender.com/recipes",
        {
          recipeID,
          userID,
        },
        {
          headers: { authorization: cookies.access_token },
        }
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div className="recipe-container">
      <h1 className="recipe-cat-heading">Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <motion.li
            initial={{ opacity: 0.3 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            key={recipe._id}
          >
            <div>
              <h2 className="recipe-title">{recipe.name}</h2>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />

            <div className="instructions">
              <p className="cookingTime">
                Cooking Time: {recipe.cookingTime} minutes
              </p>
              <h3>Ingredients</h3>

              <p className="recipe-ingredients">{recipe.ingredients}</p>
              <h3>Method</h3>

              <p className="recipe-instructions" id="method">
                {recipe.instructions}
              </p>
            </div>

            <button
              onClick={() => saveRecipe(recipe._id)}
              disabled={isRecipeSaved(recipe._id)}
              className="saveButton"
            >
              {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};
