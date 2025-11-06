# 🍽️ Recipe App

A full-stack web application for discovering, managing, and sharing recipes. 🤩 

---

## Project Structure

- **`client/`** – Frontend built with React and styled with SCSS.
- **`server/`** – Backend using Node.js and Express.js.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+)
- [npm](https://www.npmjs.com/) (v6+)

### Installation

```bash
# Clone the repository
git clone https://github.com/louisecchan/recipe-app-copy.git
cd recipe-app-copy

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

---

## Deployment

### Deploying to Render

This application is configured to deploy on [Render](https://render.com).

**Quick Start:**
1. Follow the step-by-step guide in [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md)
2. For troubleshooting, see [`RENDER_DEPLOYMENT_GUIDE.md`](./RENDER_DEPLOYMENT_GUIDE.md)

**Essential Requirements:**
- MongoDB Atlas database (free tier available)
- Render account (free tier available)
- Environment variables configured:
  - `MONGO_URI` - Your MongoDB connection string
  - `NODE_ENV` - Set to `production`

**Render Configuration:**
- **Root Directory:** `server`
- **Build Command:** `yarn install`
- **Start Command:** `yarn start`

For detailed instructions, see the deployment guides in this repository.

---

## Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/recipe-app?retryWrites=true&w=majority
PORT=3001
NODE_ENV=development
```

**Note:** Never commit your `.env` file to version control!

---

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and MongoDB connection state.

### Authentication
```
POST /auth/register - Register a new user
POST /auth/login    - Login user
```

### Recipes
```
GET    /recipes              - Get all recipes
POST   /recipes              - Create a new recipe
GET    /recipes/:recipeId    - Get recipe by ID
PUT    /recipes              - Save a recipe to user
GET    /recipes/savedRecipes/ids/:userId - Get saved recipe IDs
GET    /recipes/savedRecipes/:userId     - Get saved recipes
```

---
