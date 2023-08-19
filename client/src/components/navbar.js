import "./navbar.scss";
import Hamburger from "hamburger-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const closeMobileMenu = () => setIsNavExpanded(false);

  // hamburger
  const [isOpen, setOpen] = useState(false);

  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="navbar">
      <img
        id="site-logo"
        src={require("../images/siteLogo.png")}
        alt="Site Logo"
      />

      <div
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
      >
        {" "}
        <div className="hamburger">
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
      </div>

      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <ul className="navbar-ul">
          <li>
            <Link to="/" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/create-recipe" onClick={closeMobileMenu}>
              Create a Recipe
            </Link>
          </li>

          {!cookies.access_token ? (
            <li>
              <Link to="/auth" onClick={closeMobileMenu}>
                Login/Register
              </Link>
            </li>
          ) : (
            // fragments: so can use element without a parent
            <>
              <li>
                <Link to="/saved-recipes" onClick={closeMobileMenu}>
                  Saved Recipes
                </Link>
              </li>
              <li>
                <button onClick={logout}> Logout </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};
