const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, "public")));
// Configuration du moteur de modèle EJS
app.set("view engine", "ejs"); // Assurez-vous d'avoir installé EJS via npm/yarn

// Connexion à MongoDB
mongoose.connect("mongodb://127.0.0.1/todolist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Création du modèle pour les tâches
const Task = mongoose.model("Task", { description: String });

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route pour afficher la liste des tâches
// Route pour afficher la liste des tâches
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route pour ajouter une nouvelle tâche
app.post("/", async (req, res) => {
  const task = new Task({ description: req.body.description });
  await task.save();
  res.redirect("/");
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
