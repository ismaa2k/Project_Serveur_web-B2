const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app1 = express();
const port1 = process.env.PORT || 3001;

const methodOverride = require("method-override");
app1.use(methodOverride("_method"));

// Configuration du moteur de modèle EJS
app1.set("view engine", "ejs"); // Utilisation de EJS comme moteur de modèle
app1.set("views", path.join(__dirname, "views")); // Chemin vers le répertoire des vues

// Connexion à MongoDB
mongoose.connect("mongodb://127.0.0.1/todolist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Création du modèle pour les tâches
const Task = mongoose.model("Task", { description: String });

// Middleware pour parser le corps des requêtes en JSON
app1.use(express.json());
app1.use(express.urlencoded({ extended: true }));

// Route pour afficher la liste des tâches
app1.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app1.get("/getTasks", async (req, res) => {
  const limit = parseInt(req.query.limit) || 3; // Limite le nombre de tâches par défaut à 3
  const page = parseInt(req.query.page) || 1; // Récupère le numéro de page, par défaut 1
  
  try {
    const tasks = await Task.find()
      .limit(limit)
      .skip((page - 1) * limit);

    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur de serveur");
  }
});

app1.delete("/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;
    await Task.deleteOne({ _id: taskId }); // Utilisez deleteOne pour supprimer la tâche par son ID
    res.redirect("/"); // Redirige après la suppression
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la suppression de la tâche");
  }
});


// Route pour ajouter une nouvelle tâche
app1.post("/", async (req, res) => {
  try {
    const task = new Task({ description: req.body.description });
    await task.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur de serveur");
  }
});

// Démarrage du serveur
app1.listen(port1, () => {
  console.log(`Serveur démarré sur http://localhost:${port1}`);
});
