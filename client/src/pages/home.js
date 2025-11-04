import "./home.css";
import React, { useEffect, useState, useRef } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";

export const Home = () => {
  const [recipes, setRecipes] = useState([]); // keep track of all the recipes existing in database
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRecipe, setActiveRecipe] = useState(0);
  const [cookies, _] = useCookies(["access_token"]);
  const userID = useGetUserID();
  const recipeRefs = useRef([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "https://server-recipe-app-copy.onrender.com/recipes"
        );
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
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

  const scrollToRecipe = (index) => {
    const element = recipeRefs.current[index];
    if (element) {
      const navbarHeight = 80; // Adjust this to match your navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveRecipe(index);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      recipeRefs.current.forEach((ref, index) => {
        if (ref) {
          const { offsetTop, offsetHeight } = ref;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveRecipe(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [recipes]);

  return (
    <div className="recipe-container">
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {recipes.length > 0 && (
            <>
              <h1 className="recipe-cat-heading">Recipes</h1>
              <div className="recipe-sidebar">
                {recipes.map((recipe, index) => (
                  <div
                    key={recipe._id}
                    className={`sidebar-dot ${
                      activeRecipe === index ? "active" : ""
                    }`}
                    onClick={() => scrollToRecipe(index)}
                    title={recipe.name}
                  />
                ))}
              </div>
            </>
          )}
          <ul>
            {recipes.map((recipe, index) => (
              <motion.li
                initial={{ opacity: 0.3 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                key={recipe._id}
                ref={(el) => (recipeRefs.current[index] = el)}
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
        </>
      )}
    </div>
  );
};
