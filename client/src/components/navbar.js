import "./navbar.scss";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };
  return (
    <div className="navbar">
      <ul className="navbar-ul">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/create-recipe">Create a Recipe</Link>
        </li>

        {!cookies.access_token ? (
          <li>
            <Link to="/auth">Login/Register</Link>
          </li>
        ) : (
          // fragments: so can use element without a parent
          <>
            <li>
              <Link to="/saved-recipes">Saved Recipes</Link>
            </li>
            <li>
              <button onClick={logout}> Logout </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};
