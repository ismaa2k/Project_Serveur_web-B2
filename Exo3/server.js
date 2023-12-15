const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const compression = require("compression"); // Middleware pour la compression
const app = express();
const port = 4000; // Utilisation du port 4000 pour le serveur Node.js

// Configuration de la compression des ressources statiques
app.use(compression());

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

// Gestion des ressources statiques
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "1d", // Cache-Control: max-age=1 jour pour les ressources statiques
  })
);

// Route pour afficher la liste des tâches (avec pagination)
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
