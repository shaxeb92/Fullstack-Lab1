const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./models/Recipe');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Starting Server

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// CRUD API Endpoints
app.get('/api/recipes', async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

app.get('/api/recipes/:title', async (req, res) => {
  const recipe = await Recipe.findOne({ title: req.params.title });
  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
});

app.post('/api/recipes', async (req, res) => {
  const { title, ingredients, instructions, cookingTime } = req.body;
  const recipe = new Recipe({ title, ingredients, instructions, cookingTime });
  await recipe.save();
  res.status(201).json(recipe);
});

app.put('/api/recipes/:id', async (req, res) => {
  const { title, ingredients, instructions, cookingTime } = req.body;
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, { title, ingredients, instructions, cookingTime }, { new: true });
  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);
  if (recipe) {
    res.json({ message: 'Recipe deleted' });
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
});

// Serve static files
app.use(express.static('public'));

