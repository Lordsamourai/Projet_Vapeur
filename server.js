const express = require('express');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const hbs = require("hbs");

// Initialisation de l'application
const app = express();
const prisma = new PrismaClient();

// Enregistrement des helpers Handlebars
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('formatDate', function(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
});

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

// Configuration de Handlebars
app.set("view engine", "hbs"); // Définit Handlebars comme moteur de template
app.set("views", path.join(__dirname, "views")); // Définit le dossier des vues
hbs.registerPartials(path.join(__dirname, "views", "partials")); // Définit le dossier des partials

// Middleware pour parser les données du formulaire
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Importation des routeurs
const genreRouter = require('./routers/genre');
app.use('/genres', genreRouter);

const jeuxRouter = require('./routers/jeux');
app.use('/jeux', jeuxRouter);

const editeurRouter = require('./routers/editeur');
app.use('/editeurs', editeurRouter);

// Route principale "/" avec récupération des jeux mis en avant
app.get('/', async (req, res) => {
  try {
    // Récupération des jeux mis en avant
    const jeuxMisEnAvant = await prisma.jeu.findMany({
      where: { misEnAvant: true }, // Filtre pour récupérer seulement les jeux mis en avant
      orderBy: { titre: 'asc' }    // Trie par ordre alphabétique
    });

    // Affichage de la vue "index.hbs" avec les jeux récupérés
    res.render('index', { jeuxMisEnAvant });
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux mis en avant :", error);
    res.status(500).send("Erreur interne du serveur.");
  }
});

// Démarrage du serveur
const PORT = 3008;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
